/* TOEIC Reading Hub β — script.js
   Reading特化 / スマホ優先 / 全データはオリジナル
   問題データは questions-part5-grammar.js などで定義された配列を結合して使用する */

// ── データ結合 ──────────────────────────────────────────────────────────
const QUESTIONS = [].concat(
  typeof QUESTIONS_P5_GRAMMAR !== 'undefined' ? QUESTIONS_P5_GRAMMAR : [],
  typeof QUESTIONS_P5_VOCAB   !== 'undefined' ? QUESTIONS_P5_VOCAB   : [],
  typeof QUESTIONS_P6         !== 'undefined' ? QUESTIONS_P6         : [],
  typeof QUESTIONS_P7         !== 'undefined' ? QUESTIONS_P7         : []
);

const PARTS = ['Part 5 Grammar', 'Part 5 Vocabulary', 'Part 6 Text Completion', 'Part 7 Reading'];
const PART_ICONS = {
  'Part 5 Grammar': '🔤',
  'Part 5 Vocabulary': '📖',
  'Part 6 Text Completion': '📝',
  'Part 7 Reading': '📰',
};
const PART_SUB = {
  'Part 5 Grammar': '短文穴埋め（文法）',
  'Part 5 Vocabulary': '短文穴埋め（語彙）',
  'Part 6 Text Completion': '長文穴埋め',
  'Part 7 Reading': '読解',
};

// ── localStorage ────────────────────────────────────────────────────────
const STORE_KEY = 'toeic_reading_hub_v1';

function loadDB() {
  try {
    const d = JSON.parse(localStorage.getItem(STORE_KEY));
    if (d && typeof d === 'object') return Object.assign(defaultDB(), d);
  } catch (e) {}
  return defaultDB();
}
function defaultDB() {
  return { answered: {}, correctCount: {}, wrong: {}, bookmarks: {}, attempts: 0, correctTotal: 0, lastDay: null, streak: 0 };
}
function saveDB() { try { localStorage.setItem(STORE_KEY, JSON.stringify(DB)); } catch (e) {} }
let DB = loadDB();

function todayStr() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
function bumpStreak() {
  const t = todayStr();
  if (DB.lastDay === t) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yStr = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
  DB.streak = (DB.lastDay === yStr) ? (DB.streak || 0) + 1 : 1;
  DB.lastDay = t;
  saveDB();
}

function recordAnswer(q, isCorrect) {
  DB.answered[q.id] = true;
  DB.attempts = (DB.attempts || 0) + 1;
  if (isCorrect) {
    DB.correctTotal = (DB.correctTotal || 0) + 1;
    DB.correctCount[q.id] = (DB.correctCount[q.id] || 0) + 1;
    if (DB.wrong[q.id]) delete DB.wrong[q.id];
  } else {
    DB.wrong[q.id] = (DB.wrong[q.id] || 0) + 1;
  }
  bumpStreak();
  saveDB();
}
function toggleBookmark(id) {
  if (DB.bookmarks[id]) delete DB.bookmarks[id]; else DB.bookmarks[id] = true;
  saveDB();
}

// ── 共通ユーティリティ ────────────────────────────────────────────────
function escapeHTML(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function countByPart(part) { return QUESTIONS.filter(q => q.part === part).length; }

// ── アプリ状態 ────────────────────────────────────────────────────────
const App = {
  screen: 'home',
  quiz: null,        // { mode, questions, index, results }
  selected: null,    // 選択済みインデックス（解答後）
};

const $app = () => document.getElementById('app');

function go(screen) { App.screen = screen; render(); window.scrollTo(0, 0); }

// ── 出題開始 ──────────────────────────────────────────────────────────
function startQuiz(mode, part) {
  let pool = QUESTIONS.slice();
  if (mode === 'category') pool = pool.filter(q => q.part === part);
  else if (mode === 'review') pool = pool.filter(q => DB.wrong[q.id]);
  else if (mode === 'bookmark') pool = pool.filter(q => DB.bookmarks[q.id]);

  shuffle(pool);

  let n = pool.length;
  if (mode === 'daily') { pool = pickDaily(); n = pool.length; }
  else if (mode === 'random10') n = Math.min(10, pool.length);
  else if (mode === 'random20') n = Math.min(20, pool.length);
  else if (mode === 'exam') n = Math.min(20, pool.length);

  const qs = pool.slice(0, n);
  if (qs.length === 0) { App.quiz = { mode, questions: [], index: 0, results: [] }; go('quiz'); return; }

  App.quiz = { mode, questions: qs, index: 0, results: [] };
  App.selected = null;
  go('quiz');
}

function pickDaily() {
  // 未学習を優先 → 間違えた問題 → ランダム補充、最大5問
  const undone = shuffle(QUESTIONS.filter(q => !DB.answered[q.id]));
  const wrong = shuffle(QUESTIONS.filter(q => DB.wrong[q.id]));
  const rest = shuffle(QUESTIONS.slice());
  const out = []; const seen = {};
  for (const list of [undone, wrong, rest]) {
    for (const q of list) { if (out.length >= 5) break; if (!seen[q.id]) { seen[q.id] = 1; out.push(q); } }
  }
  return out;
}

// ── レンダリング ──────────────────────────────────────────────────────
function render() {
  const fns = {
    home: renderHome,
    categories: renderCategories,
    quiz: renderQuiz,
    result: renderResult,
    stats: renderStats,
    bookmark: renderBookmarkList,
    'pos-map': renderPosMap,
    'conjprep-map': renderConjPrepMap,
    'paraphrase-map': renderParaphraseMap,
    'reading-map': renderReadingMap,
    course: renderCourse,
    guide: renderGuide,
  };
  const fn = fns[App.screen] || renderHome;
  $app().innerHTML = fn();
}

// ── ホーム ────────────────────────────────────────────────────────────
function renderHome() {
  const total = QUESTIONS.length;
  const done = Object.keys(DB.answered).length;
  const rate = DB.attempts ? Math.round((DB.correctTotal / DB.attempts) * 100) : 0;
  const wrongCnt = Object.keys(DB.wrong).length;

  return `
  <div class="screen">
    <div class="home-top">
      <div class="home-hero-deco" aria-hidden="true">
        <svg viewBox="0 0 120 80" preserveAspectRatio="none">
          <rect x="6" y="56" width="10" height="20" fill="#ffffff" opacity="0.12"/>
          <rect x="34" y="46" width="10" height="30" fill="#ffffff" opacity="0.12"/>
          <rect x="62" y="34" width="10" height="42" fill="#ffffff" opacity="0.14"/>
          <rect x="90" y="20" width="10" height="56" fill="#ffffff" opacity="0.16"/>
          <polyline points="11,54 39,44 67,32 95,18" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.3"/>
        </svg>
      </div>
      <div class="home-brand">TOEIC READING HUB β</div>
      <div class="home-title">TOEIC 700→800<br>Reading Speed Training</div>
      <div class="home-sub">読む速度・正確性・言い換え対応力を鍛える Reading 特化アプリ</div>
      <div class="home-badges">
        <span class="home-badge">⚡ Speed</span>
        <span class="home-badge">🎯 Accuracy</span>
        <span class="home-badge">💬 Paraphrase</span>
      </div>
    </div>
    <div class="home-body">
      <div class="daily-hero">
        <span class="daily-hero-target" aria-hidden="true">🎯</span>
        <div class="daily-hero-label">🌟 今日の学習</div>
        <div class="daily-hero-title">今日の5問</div>
        <div class="daily-hero-sub">Part 5〜7から毎日5問。読む速度と正確性を積み上げよう。</div>
        <button class="daily-hero-btn" data-action="start-daily">スタート</button>
      </div>

      <div class="home-stats">
        <div class="home-stat"><div class="home-stat-val">${done}</div><div class="home-stat-lbl">学習済み</div></div>
        <div class="home-stat"><div class="home-stat-val">${rate}%</div><div class="home-stat-lbl">正答率</div></div>
        <div class="home-stat"><div class="home-stat-val">${DB.streak || 0}</div><div class="home-stat-lbl">連続日数</div></div>
      </div>

      <div class="section-label">演習メニュー</div>
      <div class="menu-grid">
        <button class="menu-btn" data-action="go-categories"><span class="menu-btn-icon">📚</span><span class="menu-btn-label">分野別学習</span><span class="menu-btn-sub">Part別に解く</span></button>
        <button class="menu-btn" data-action="start-random10"><span class="menu-btn-icon">🎲</span><span class="menu-btn-label">ランダム10問</span><span class="menu-btn-sub">横断練習</span></button>
        <button class="menu-btn" data-action="start-random20"><span class="menu-btn-icon">🎲</span><span class="menu-btn-label">ランダム20問</span><span class="menu-btn-sub">横断練習</span></button>
        <button class="menu-btn" data-action="start-exam"><span class="menu-btn-icon">🏆</span><span class="menu-btn-label">20問まとめて演習</span><span class="menu-btn-sub">即時解説つき</span></button>
        <button class="menu-btn" data-action="start-review"><span class="menu-btn-icon">🔄</span><span class="menu-btn-label">間違い復習</span><span class="menu-btn-sub">${wrongCnt}問</span></button>
        <button class="menu-btn" data-action="go-bookmark"><span class="menu-btn-icon">🔖</span><span class="menu-btn-label">付箋</span><span class="menu-btn-sub">${Object.keys(DB.bookmarks).length}問</span></button>
      </div>

      <div class="section-label">学習サポート</div>
      <div class="menu-stack">
        <button class="menu-btn full" data-action="go-reading-map"><span class="menu-btn-icon">🗺️</span><span class="menu-btn-label">Reading Map（弱点マップ）</span><span class="menu-btn-sub">700→800に必要な読解観点と弱点</span></button>
        <button class="menu-btn full" data-action="go-course"><span class="menu-btn-icon">📘</span><span class="menu-btn-label">7日間Readingコース</span><span class="menu-btn-sub">何から始めるか迷わない導線</span></button>
        <button class="menu-btn full" data-action="go-pos-map"><span class="menu-btn-icon">🔤</span><span class="menu-btn-label">品詞マップ</span><span class="menu-btn-sub">語尾と位置で品詞を見抜く</span></button>
        <button class="menu-btn full" data-action="go-conjprep-map"><span class="menu-btn-icon">🔗</span><span class="menu-btn-label">接続詞・前置詞マップ</span><span class="menu-btn-sub">後ろがSVか名詞かで整理</span></button>
        <button class="menu-btn full" data-action="go-paraphrase-map"><span class="menu-btn-icon">🔁</span><span class="menu-btn-label">言い換えマップ</span><span class="menu-btn-sub">TOEIC頻出の言い換え</span></button>
        <button class="menu-btn full" data-action="go-stats"><span class="menu-btn-icon">📊</span><span class="menu-btn-label">学習記録</span><span class="menu-btn-sub">正答率・Part別成績</span></button>
        <button class="menu-btn full" data-action="go-guide"><span class="menu-btn-icon">📗</span><span class="menu-btn-label">使い方ガイド</span><span class="menu-btn-sub">何から始めればいいか</span></button>
      </div>

      <div class="section-label">データ</div>
      <div class="home-stats">
        <div class="home-stat"><div class="home-stat-val">${total}</div><div class="home-stat-lbl">Total Questions</div></div>
        <div class="home-stat"><div class="home-stat-val">${countByPart('Part 5 Grammar') + countByPart('Part 5 Vocabulary')}</div><div class="home-stat-lbl">Part 5</div></div>
        <div class="home-stat"><div class="home-stat-val">${countByPart('Part 6 Text Completion')}/${countByPart('Part 7 Reading')}</div><div class="home-stat-lbl">Part 6 / 7</div></div>
      </div>
    </div>
  </div>`;
}

function headerBar(title) {
  return `<div class="header"><button class="btn-back" data-action="go-home"><span class="btn-back-arrow">←</span>戻る</button><div class="header-title">${escapeHTML(title)}</div></div>`;
}

// ── カテゴリ選択 ──────────────────────────────────────────────────────
function renderCategories() {
  const rows = PARTS.map(p => `
    <div class="cat-card" data-action="start-category" data-part="${escapeHTML(p)}">
      <span class="cat-icon">${PART_ICONS[p]}</span>
      <div>
        <div class="cat-name">${escapeHTML(p)}</div>
        <div class="cat-count">${escapeHTML(PART_SUB[p])}・${countByPart(p)}問</div>
      </div>
      <span class="cat-card-r">›</span>
    </div>`).join('');
  return `<div class="screen">${headerBar('分野別学習')}<div class="cat-list">${rows}</div></div>`;
}

// ── クイズ ────────────────────────────────────────────────────────────
function renderQuiz() {
  const Q = App.quiz;
  if (!Q || Q.questions.length === 0) {
    return `<div class="screen">${headerBar('演習')}
      <div class="empty"><div class="empty-icon">🗂️</div>
      <div class="empty-msg">まだこの条件で出題できる問題がありません。<br>ホームの「今日の5問」や「分野別学習」から始めてみましょう。</div></div></div>`;
  }
  const q = Q.questions[Q.index];
  const answered = App.selected !== null;
  const pct = Math.round((Q.index / Q.questions.length) * 100);
  const star = DB.bookmarks[q.id] ? '🔖 付箋済み' : '🔖 付箋';
  const starStyle = DB.bookmarks[q.id] ? '' : 'opacity:.3';

  const passageHtml = (q.part === 'Part 7 Reading' && q.passage) ? `
    <div class="quiz-passage">
      ${q.passageType ? `<div class="quiz-passage-type">${escapeHTML(q.passageType)}</div>` : ''}
      ${escapeHTML(q.passage)}
    </div>` : '';

  const opts = q.options.map((o, i) => {
    let cls = 'opt-btn';
    if (answered) {
      cls += ' disabled';
      if (i === q.correct) cls += ' correct';
      else if (i === App.selected) cls += ' wrong';
    }
    const letter = String.fromCharCode(65 + i);
    return `<button class="${cls}" data-action="answer" data-i="${i}"><span class="opt-letter">${letter}</span><span>${escapeHTML(o)}</span></button>`;
  }).join('');

  let explainHtml = '';
  if (answered) {
    const ok = App.selected === q.correct;
    explainHtml = `
      <div class="explain">
        <div class="explain-verdict ${ok ? 'ok' : 'ng'}">${ok ? '正解' : '不正解'}（正解：${String.fromCharCode(65 + q.correct)}）</div>
        ${q.explanation ? `<div class="explain-row"><span class="explain-label">解説</span>${escapeHTML(q.explanation)}</div>` : ''}
        ${q.translation ? `<div class="explain-row"><span class="explain-label">和訳</span>${escapeHTML(q.translation)}</div>` : ''}
        ${q.skill ? `<div class="explain-row"><span class="explain-label">ポイント</span>${escapeHTML(q.skill)}</div>` : ''}
      </div>
      <div class="quiz-actions">
        <button class="btn-primary" data-action="next">${Q.index + 1 < Q.questions.length ? '次の問題へ' : '結果を見る'}</button>
      </div>`;
  }

  return `
  <div class="screen">
    ${headerBar(Q.mode === 'exam' ? '20問演習' : '演習')}
    <div class="quiz-body">
      <div class="quiz-progress">
        <span>${Q.index + 1} / ${Q.questions.length}</span>
        <button class="bookmark-btn" style="${starStyle}" data-action="bookmark">${star}</button>
      </div>
      <div class="quiz-bar"><div class="quiz-bar-fill" style="width:${pct}%"></div></div>
      <div class="quiz-tag">${PART_ICONS[q.part] || ''} ${escapeHTML(q.part)}</div>
      ${passageHtml}
      <div class="quiz-question">${escapeHTML(q.question)}</div>
      <div class="opt-list">${opts}</div>
      ${explainHtml}
    </div>
  </div>`;
}

// ── 結果 ──────────────────────────────────────────────────────────────
function renderResult() {
  const Q = App.quiz || { results: [], questions: [] };
  const total = Q.results.length;
  const correct = Q.results.filter(r => r).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  let msg = '続けることが力になります。';
  if (pct >= 80) msg = 'すばらしい！この調子で語数を増やしましょう。';
  else if (pct >= 60) msg = '合格ラインの感触。間違えた問題を復習しよう。';
  else if (total > 0) msg = '解説と和訳を読み直して、根拠を固めましょう。';

  return `
  <div class="screen">
    ${headerBar('結果')}
    <div class="result-body">
      <div class="result-score">${correct}<small> / ${total}</small></div>
      <div class="result-msg">${escapeHTML(msg)}（正答率 ${pct}%）</div>
      <div class="result-card">
        <div class="card-title">次にやること</div>
        <div class="card-body">間違えた問題は「間違い復習」でもう一度。語彙は「言い換えマップ」、文法は「品詞マップ」で確認すると定着します。</div>
      </div>
      <div class="quiz-actions">
        <button class="btn-ghost" data-action="go-home">ホームへ</button>
        <button class="btn-primary" data-action="start-daily">今日の5問へ</button>
      </div>
    </div>
  </div>`;
}

// ── 学習記録 ──────────────────────────────────────────────────────────
function renderStats() {
  const done = Object.keys(DB.answered).length;
  const rate = DB.attempts ? Math.round((DB.correctTotal / DB.attempts) * 100) : 0;
  const bars = PARTS.map(p => {
    const ids = QUESTIONS.filter(q => q.part === p).map(q => q.id);
    const dn = ids.filter(id => DB.answered[id]).length;
    const tot = ids.length;
    const w = tot ? Math.round((dn / tot) * 100) : 0;
    return `<div class="bar-row">
      <div class="bar-row-top"><span class="bar-row-name">${PART_ICONS[p]} ${escapeHTML(p)}</span><span class="bar-row-val">${dn}/${tot}</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${w}%"></div></div></div>`;
  }).join('');

  return `
  <div class="screen">
    ${headerBar('学習記録')}
    <div class="body-pad">
      <div class="stat-row">
        <div class="stat-cell"><div class="stat-cell-val">${done}</div><div class="stat-cell-lbl">学習済み</div></div>
        <div class="stat-cell"><div class="stat-cell-val">${rate}%</div><div class="stat-cell-lbl">正答率</div></div>
        <div class="stat-cell"><div class="stat-cell-val">${Object.keys(DB.wrong).length}</div><div class="stat-cell-lbl">苦手問題</div></div>
      </div>
      <div class="section-label">Part別の進捗</div>
      ${bars}
      <button class="reset-btn" data-action="reset">🗑️ 学習データをリセット</button>
    </div>
  </div>`;
}

// ── 付箋一覧 ──────────────────────────────────────────────────────────
function renderBookmarkList() {
  const ids = Object.keys(DB.bookmarks);
  if (ids.length === 0) {
    return `<div class="screen">${headerBar('付箋')}<div class="empty"><div class="empty-icon">🔖</div><div class="empty-msg">まだ付箋を付けた問題はありません。<br>演習中に「🔖 付箋」をタップすると、気になる問題をここにためておけます。</div></div></div>`;
  }
  return `<div class="screen">${headerBar('付箋')}<div class="body-pad">
    <div class="intro-line">付箋を付けた ${ids.length} 問をまとめて復習できます。</div>
    <button class="btn-primary" data-action="start-bookmark">付箋の問題を解く</button>
  </div></div>`;
}

// ── 品詞マップ ────────────────────────────────────────────────────────
function renderPosMap() {
  const data = [
    { tag: '名詞 noun', title: '名詞の見分け方', kv: ['語尾：<b>-tion / -sion / -ment / -ness / -ity / -ance / -ence</b>', '位置：冠詞や形容詞の<b>後ろ</b>、文の主語・目的語', '例：decision, management, ability'] },
    { tag: '動詞 verb', title: '動詞の見分け方', kv: ['語尾：<b>-ize / -ise / -ate / -en / -ify</b>', '位置：主語の<b>後ろ</b>で動作・状態を表す', '例：organize, activate, simplify'] },
    { tag: '形容詞 adjective', title: '形容詞の見分け方', kv: ['語尾：<b>-ous / -ive / -ful / -al / -able / -ible / -ent / -ant</b>', '位置：<b>名詞の前</b>、または be 動詞の<b>後ろ</b>', '例：effective, reliable, significant'] },
    { tag: '副詞 adverb', title: '副詞の見分け方', kv: ['語尾：多くは <b>-ly</b>', '位置：動詞・形容詞・文全体を修飾（名詞は修飾しない）', '例：quickly, recently, carefully'] },
  ];
  return mapScreen('品詞マップ', '空所の前後を見て、入るべき品詞を判断する練習に使います。', data);
}

// ── 接続詞・前置詞マップ ──────────────────────────────────────────────
function renderConjPrepMap() {
  const data = [
    { tag: '理由', title: 'because / because of', kv: ['<b>because</b> ＋ 主語+動詞（接続詞）', '<b>because of</b> ＋ 名詞（前置詞）', '見分け：後ろが文か名詞か'] },
    { tag: '譲歩', title: 'although / despite', kv: ['<b>although</b> ＋ 主語+動詞（接続詞）', '<b>despite / in spite of</b> ＋ 名詞（前置詞）', '意味は「〜だけれども」で共通'] },
    { tag: '時', title: 'while / during', kv: ['<b>while</b> ＋ 主語+動詞（接続詞）', '<b>during</b> ＋ 名詞（前置詞）', '「〜の間」を文で言うか名詞で言うか'] },
    { tag: '論理', title: 'so that / therefore', kv: ['<b>so that</b> ＋ 主語+動詞（目的・結果）', '<b>therefore</b> は副詞（文と文をつなぐ）', '接続副詞は単独で節をつなげない点に注意'] },
  ];
  return mapScreen('接続詞・前置詞マップ', '後ろが「文（SV）」か「名詞」かで、接続詞・前置詞を見分けます。', data);
}

// ── 言い換えマップ ────────────────────────────────────────────────────
function renderParaphraseMap() {
  const data = [
    { tag: '動詞', title: 'よく出る動詞の言い換え', kv: ['purchase ＝ buy（買う）', 'obtain ＝ get（得る）', 'require ＝ need（必要とする）', 'assist ＝ help（手伝う）', 'postpone ＝ put off（延期する）'] },
    { tag: '形容詞・副詞', title: '形容詞・副詞の言い換え', kv: ['sufficient ＝ enough（十分な）', 'complimentary ＝ free（無料の）', 'approximately ＝ about（およそ）', 'mandatory ＝ required（必須の）'] },
    { tag: '熟語', title: '熟語・前置詞句の言い換え', kv: ['due to ＝ because of（〜のため）', 'in charge of ＝ responsible for（〜の担当）', 'a variety of ＝ various（さまざまな）', 'prior to ＝ before（〜の前に）'] },
  ];
  return mapScreen('言い換えマップ', 'Part 7 の正解選択肢は本文の言い換えです。同義表現をためておきましょう。', data);
}

function mapScreen(title, intro, data) {
  const cards = data.map(d => `
    <div class="card">
      <div class="card-tag">${escapeHTML(d.tag)}</div>
      <div class="card-title">${escapeHTML(d.title)}</div>
      <ul class="kv-list">${d.kv.map(x => `<li>${x}</li>`).join('')}</ul>
    </div>`).join('');
  return `<div class="screen">${headerBar(title)}<div class="body-pad"><div class="intro-line">${escapeHTML(intro)}</div>${cards}</div></div>`;
}

// ── Reading Map（弱点マップ） ──────────────────────────────────────────
// 700→800 の読解観点を、各問の skill とゆるく対応づけて学習状況・弱点を表示する。
// localStorage 構造は変更しない（既存の DB.answered / DB.wrong を読むだけ）。
function renderReadingMap() {
  // 観点 → skill に含まれるキーワード（部分一致）
  const views = [
    { tag: 'Vocabulary in Context', title: '文脈語彙力', desc: '空所や本文に合う語を、意味とコロケーションで選ぶ力。', keys: ['語彙', 'ビジネス動詞', 'ビジネス名詞', 'コロケーション', '文脈語彙', '文脈動詞', '文脈名詞', '紛らわしい', '句動詞', '形容詞（', '副詞（'] },
    { tag: 'Connector', title: '接続・論理の流れ', desc: '接続詞・接続副詞で文と文のつながり（順接・逆接・因果）をつかむ。', keys: ['接続', '相関接続', '対比'] },
    { tag: 'Grammar Accuracy', title: '文法の正確さ', desc: '時制・態・分詞・関係詞・比較・仮定法・前置詞などを素早く正確に判断する。', keys: ['時制', '完了形', '受動態', '分詞', '関係詞', '比較', '仮定法', '品詞', '倒置', '一致', '語法', '前置詞（'] },
    { tag: 'Part 6 Flow', title: 'Part 6 文脈・文選択', desc: '空所を1文だけでなく前後の流れで判断し、最適な一文を選ぶ。', keys: ['文挿入', '指示語', '代名詞', 'Part 6'] },
    { tag: 'Purpose', title: 'Part 7 目的・主旨', desc: '文書全体が何のために書かれたかをつかむ。', keys: ['目的把握'] },
    { tag: 'Detail', title: 'Part 7 詳細・依頼', desc: '日時・条件・依頼など、本文の具体情報を正確に読み取る。', keys: ['詳細把握', '依頼内容把握', '理由・原因把握'] },
    { tag: 'Paraphrase', title: '言い換え対応', desc: '正解選択肢は本文の言い換え。同義表現を見抜く。', keys: ['言い換え', '同義表現'] },
    { tag: 'Inference', title: '推論', desc: '本文に直接書かれていない含意を、根拠から論理的に推測する。', keys: ['推論', '含意', '推測'] },
  ];

  const matched = q => views.find(v => v.keys.some(k => (q.skill || '').includes(k)));

  const cards = views.map(v => {
    const qs = QUESTIONS.filter(q => v.keys.some(k => (q.skill || '').includes(k)));
    const total = qs.length;
    const done = qs.filter(q => DB.answered[q.id]).length;
    const weak = qs.filter(q => DB.wrong[q.id]).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const weakTag = weak > 0 ? `<span style="font-size:11px;font-weight:700;color:#b91c1c;background:#fef2f2;border-radius:4px;padding:2px 7px;margin-left:6px">要復習 ${weak}問</span>` : '';
    return `
    <div class="card">
      <div class="card-tag">${escapeHTML(v.tag)}</div>
      <div class="card-title">${escapeHTML(v.title)} ${weakTag}</div>
      <div class="card-body">${escapeHTML(v.desc)}</div>
      <div class="bar-row" style="margin-top:8px">
        <div class="bar-row-top"><span class="bar-row-name">学習状況</span><span class="bar-row-val">${done}/${total}問</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      </div>
    </div>`;
  }).join('');

  // どの観点にも対応づかない skill があれば把握用に（表示はしないが将来の調整に備える）
  const intro = '700→800 の Reading は <b>Speed（速く）</b>・<b>Accuracy（正確に）</b>・<b>Paraphrase（言い換えに強く）</b>の3本柱。下の観点ごとに学習状況と「要復習」を確認し、弱い観点から復習しましょう。';
  return `
  <div class="screen">
    ${headerBar('Reading Map（弱点マップ）')}
    <div class="body-pad">
      <div class="intro-line">${intro}</div>
      ${cards}
      <div class="card">
        <div class="card-title">使い方のヒント</div>
        <ul class="kv-list">
          <li><b>要復習</b>が付いた観点は「間違い復習」で重点的に解き直す。</li>
          <li>学習状況のバーが低い観点は「分野別学習」で問題数を増やす。</li>
          <li>言い換え・推論は Part 7、接続・文選択は Part 6 で鍛えられます。</li>
        </ul>
      </div>
    </div>
  </div>`;
}

// ── 7日間Readingコース ────────────────────────────────────────────────
function renderCourse() {
  const days = [
    { d: 'Day 1', t: '品詞と文の骨組み', read: '品詞マップ', solve: 'Part 5 Grammar を中心に', point: '空所の前後を見て「入る品詞」を判断する癖をつける。' },
    { d: 'Day 2', t: '語彙とコロケーション', read: '言い換えマップ', solve: 'Part 5 Vocabulary を中心に', point: '単語は意味だけでなく「相性のよい語」とセットで覚える。' },
    { d: 'Day 3', t: '時制・態・準動詞', read: '品詞マップ（動詞）', solve: 'Part 5 Grammar を中心に', point: '動詞は「時制・能動受動・to/ing」の3点で考える。' },
    { d: 'Day 4', t: '接続詞・前置詞・関係詞', read: '接続詞・前置詞マップ', solve: 'Part 5 / Part 6 を中心に', point: '後ろが文か名詞かで、接続詞か前置詞かを見分ける。' },
    { d: 'Day 5', t: 'Part 6 文脈読み', read: '言い換えマップ', solve: 'Part 6 Text Completion を中心に', point: '空所は1文だけでなく前後の流れで判断する。' },
    { d: 'Day 6', t: 'Part 7 メール・告知', read: '言い換えマップ', solve: 'Part 7 Reading を中心に', point: '設問→本文の順で読み、言い換えを探す。' },
    { d: 'Day 7', t: '総点検', read: '間違い復習', solve: '20問まとめて演習', point: '新しい知識より、間違えた理由をつぶすことを優先する。' },
  ];
  const cards = days.map(x => `
    <div class="card">
      <div class="day-tag">${escapeHTML(x.d)}</div>
      <div class="card-title">${escapeHTML(x.t)}</div>
      <ul class="kv-list">
        <li><b>読む</b>：${escapeHTML(x.read)}</li>
        <li><b>解く</b>：${escapeHTML(x.solve)}</li>
      </ul>
      <div class="day-point">💡 ${escapeHTML(x.point)}</div>
    </div>`).join('');
  return `<div class="screen">${headerBar('7日間Readingコース')}<div class="body-pad">
    <div class="intro-line">何から始めるか迷わないための7日間の導線です。1日1テーマで「読む→解く」を進めましょう。</div>${cards}</div></div>`;
}

// ── 使い方ガイド ──────────────────────────────────────────────────────
function renderGuide() {
  const cards = [
    { icon: '🚀', title: 'このアプリの使い方', kv: ['まずは「7日間Readingコース」で全体像をつかむ', '次に「分野別学習」で弱いPartを解く', '間違えた問題は「間違い復習」で戻る', '品詞は「品詞マップ」、語彙は「言い換えマップ」で確認'] },
    { icon: '🎯', title: '対象とゴール', kv: ['対象：TOEIC 700点台から800点突破を狙う学習者', 'ゴール：Readingの処理速度・正確性・言い換え対応力の強化', 'Listening は対象外（Reading特化）'] },
    { icon: '🧩', title: '画面の見方', kv: ['解答後に「解説・和訳・ポイント」を確認', '🔖 で付箋を付けてあとでまとめて復習', '学習記録で Part 別の進捗を確認'] },
    { icon: '⚠️', title: '注意', note: true, kv: ['本アプリは学習補助用のβ版です', '問題はすべてオリジナルで、公式問題の再現ではありません', 'スコアは目安であり、合否を保証するものではありません'] },
  ];
  const html = cards.map(c => `
    <div class="card">
      <div class="card-title">${c.icon} ${escapeHTML(c.title)}</div>
      <ul class="kv-list${c.note ? ' note-list' : ''}">${c.kv.map(x => `<li>${escapeHTML(x)}</li>`).join('')}</ul>
    </div>`).join('');
  return `<div class="screen">${headerBar('使い方ガイド')}<div class="body-pad">${html}</div></div>`;
}

// ── イベント処理 ──────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const a = el.dataset.action;
  switch (a) {
    case 'go-home':          go('home'); break;
    case 'go-categories':    go('categories'); break;
    case 'go-stats':         go('stats'); break;
    case 'go-bookmark':      go('bookmark'); break;
    case 'go-course':        go('course'); break;
    case 'go-guide':         go('guide'); break;
    case 'go-pos-map':       go('pos-map'); break;
    case 'go-conjprep-map':  go('conjprep-map'); break;
    case 'go-paraphrase-map':go('paraphrase-map'); break;
    case 'go-reading-map':   go('reading-map'); break;

    case 'start-daily':      startQuiz('daily'); break;
    case 'start-random10':   startQuiz('random10'); break;
    case 'start-random20':   startQuiz('random20'); break;
    case 'start-exam':       startQuiz('exam'); break;
    case 'start-review':     startQuiz('review'); break;
    case 'start-bookmark':   startQuiz('bookmark'); break;
    case 'start-category':   startQuiz('category', el.dataset.part); break;

    case 'answer': {
      if (App.selected !== null) break;
      const i = parseInt(el.dataset.i, 10);
      App.selected = i;
      const Q = App.quiz; const q = Q.questions[Q.index];
      const ok = i === q.correct;
      Q.results.push(ok);
      recordAnswer(q, ok);
      render();
      break;
    }
    case 'next': {
      const Q = App.quiz;
      App.selected = null;
      if (Q.index + 1 < Q.questions.length) { Q.index++; render(); }
      else go('result');
      break;
    }
    case 'bookmark': {
      const Q = App.quiz; const q = Q.questions[Q.index];
      toggleBookmark(q.id); render();
      break;
    }
    case 'reset': {
      if (confirm('学習データをすべてリセットしますか？この操作は元に戻せません。')) {
        DB = defaultDB(); saveDB(); go('home');
      }
      break;
    }
  }
});

// ── 起動 ──────────────────────────────────────────────────────────────
render();
