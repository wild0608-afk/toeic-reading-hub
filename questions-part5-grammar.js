// TOEIC Reading Hub β — Part 5 Grammar 問題データ
// 共通スキーマ:
// {
//   id: "TOEIC-2026-0001",
//   part: "Part 5 Grammar",
//   level: "easy" | "medium" | "hard",
//   question: "英文（空所は ____ で表す）",
//   options: ["A", "B", "C", "D"],
//   correct: 0,            // 0〜3
//   explanation: "日本語の解説",
//   translation: "英文の和訳",
//   skill: "品詞 / 時制 / 関係詞 など",
//   source: "オリジナル問題",
//   verified: false
// }
// すべてオリジナル英文・オリジナル設問。公式問題・既存教材の英文/設問/選択肢のコピー禁止。
const QUESTIONS_P5_GRAMMAR = [
  {
    id: "TOEIC-2026-0001",
    part: "Part 5 Grammar",
    level: "standard",
    question: "The marketing team worked ____ to meet the tight deadline for the product launch.",
    options: ["efficient", "efficiently", "efficiency", "efficiencies"],
    correct: 1,
    explanation: "動詞 worked を修飾するので副詞の efficiently が正解。(A) efficient は形容詞、(C) efficiency と (D) efficiencies は名詞で、動詞を修飾できない。",
    translation: "マーケティングチームは、製品発売の厳しい締め切りに間に合わせるため効率的に働いた。",
    skill: "品詞（動詞を修飾する副詞）",
    source: "オリジナル問題",
    verified: false
  },
  {
    id: "TOEIC-2026-0002",
    part: "Part 5 Grammar",
    level: "advanced",
    question: "____ in 2008, the consulting firm has since expanded into more than twenty countries.",
    options: ["Founding", "Founded", "To found", "Founds"],
    correct: 1,
    explanation: "主語 the consulting firm は「設立された」側なので、受動の意味を持つ過去分詞 Founded で始める分詞構文が正解。(A) Founding は能動で意味が合わず、(C) To found と (D) Founds も文構造上この位置に置けない。",
    translation: "2008年に設立されて以来、そのコンサルティング会社は20か国以上に進出してきた。",
    skill: "分詞構文（過去分詞・受動）",
    source: "オリジナル問題",
    verified: false
  },
  {
    id: "TOEIC-2026-0009",
    part: "Part 5 Grammar",
    level: "standard",
    question: "The new software has significantly improved the ____ of our customer service team.",
    options: ["productive", "productively", "productivity", "produce"],
    correct: 2,
    explanation: "the の後ろで improved の目的語となる名詞が必要なので productivity（生産性）が正解。(A) productive は形容詞、(B) productively は副詞、(D) produce は動詞または「農産物」の意味で文意に合わない。",
    translation: "新しいソフトウェアは、顧客サービスチームの生産性を大幅に向上させた。",
    skill: "品詞（名詞）",
    source: "オリジナル問題",
    verified: false
  },
  {
    id: "TOEIC-2026-0010",
    part: "Part 5 Grammar",
    level: "advanced",
    question: "Despite the ____ increase in online orders, the company managed to ship every package on time.",
    options: ["substantial", "substantially", "substance", "substantiate"],
    correct: 0,
    explanation: "名詞 increase を前から修飾する形容詞が必要なので substantial（かなりの）が正解。(B) substantially は副詞、(C) substance は名詞、(D) substantiate は動詞で名詞を修飾できない。",
    translation: "オンライン注文が大幅に増加したにもかかわらず、会社はすべての荷物を予定通り発送できた。",
    skill: "品詞（名詞を修飾する形容詞）",
    source: "オリジナル問題",
    verified: false
  },
  {
    id: "TOEIC-2026-0011",
    part: "Part 5 Grammar",
    level: "standard",
    question: "Ms. Tanaka ____ for the company for over a decade and is now its most experienced analyst.",
    options: ["works", "has worked", "worked", "will work"],
    correct: 1,
    explanation: "for over a decade（10年以上）と now が示す現在までの継続なので、現在完了 has worked が正解。(A) 現在形、(C) 過去形、(D) 未来形はいずれも継続の文意に合わない。",
    translation: "タナカさんは10年以上この会社で働いており、今では最も経験豊富なアナリストだ。",
    skill: "時制（現在完了の継続）",
    source: "オリジナル問題",
    verified: false
  },
  {
    id: "TOEIC-2026-0012",
    part: "Part 5 Grammar",
    level: "advanced",
    question: "By the time the keynote speaker arrived, most of the attendees ____ already taken their seats.",
    options: ["have", "has", "were", "had"],
    correct: 3,
    explanation: "arrived（過去）より前に着席が完了していたので、過去完了を作る had taken が正解。(A)(B) は現在完了で時制が合わず、(C) were taken は受動態で意味が変わる。",
    translation: "基調講演者が到着するころには、出席者のほとんどがすでに着席していた。",
    skill: "完了形（過去完了の時間関係）",
    source: "オリジナル問題",
    verified: false
  },
  {
    id: "TOEIC-2026-0013",
    part: "Part 5 Grammar",
    level: "standard",
    question: "The annual conference ____ in Singapore this year, attracting over a thousand participants.",
    options: ["held", "was held", "has held", "holding"],
    correct: 1,
    explanation: "conference は「開催される」側なので受動態 was held が正解。(A) は過去能動、(C) は現在完了の能動、(D) は現在分詞で、いずれも主語との関係が合わない。",
    translation: "今年の年次会議はシンガポールで開催され、1000人を超える参加者を集めた。",
    skill: "受動態",
    source: "オリジナル問題",
    verified: false
  },
  {
    id: "TOEIC-2026-0014",
    part: "Part 5 Grammar",
    level: "advanced",
    question: "Employees ____ in the pilot program will receive a detailed survey at the end of the month.",
    options: ["enroll", "enrolling", "enrolled", "to enroll"],
    correct: 2,
    explanation: "Employees を後置修飾し「（プログラムに）登録された従業員」の意味になる過去分詞 enrolled が正解。(B) enrolling は能動で意味が逆、(A) 原形と (D) 不定詞は名詞を後置修飾できない。",
    translation: "パイロットプログラムに登録された従業員は、月末に詳細なアンケートを受け取る。",
    skill: "分詞（過去分詞による後置修飾）",
    source: "オリジナル問題",
    verified: false
  },
  {
    id: "TOEIC-2026-0015",
    part: "Part 5 Grammar",
    level: "standard",
    question: "____ the shipment was delayed, the store still received the products before the holiday sale.",
    options: ["Although", "Because", "Therefore", "During"],
    correct: 0,
    explanation: "「遅れたが、それでも届いた」という譲歩を表すので接続詞 Although が正解。(B) Because は理由、(C) Therefore は副詞で節をつなげず、(D) During は前置詞で後ろに文を取れない。",
    translation: "出荷は遅れたものの、その店は休暇セールの前に商品を受け取ることができた。",
    skill: "接続詞（譲歩 although）",
    source: "オリジナル問題",
    verified: false
  },
  {
    id: "TOEIC-2026-0016",
    part: "Part 5 Grammar",
    level: "advanced",
    question: "The consultant ____ recommendations we followed last year helped us reduce costs by fifteen percent.",
    options: ["who", "which", "whom", "whose"],
    correct: 3,
    explanation: "後ろに recommendations（名詞）が続き「そのコンサルタントの提言」という所有関係になるので所有格の関係代名詞 whose が正解。(A) who は主格、(B) which は人に使えず、(C) whom は目的格で直後に名詞を従えない。",
    translation: "私たちが昨年従ったそのコンサルタントの提言は、コストを15%削減するのに役立った。",
    skill: "関係詞（所有格 whose）",
    source: "オリジナル問題",
    verified: false
  },
  {
    id: "TOEIC-2026-0017",
    part: "Part 5 Grammar",
    level: "standard",
    question: "The maintenance crew will inspect the elevators ____ regular intervals to ensure passenger safety.",
    options: ["on", "in", "at", "by"],
    correct: 2,
    explanation: "at regular intervals で「一定の間隔で」という定型表現になるので at が正解。(A) on、(B) in、(D) by はこの名詞句と結びつかない。",
    translation: "保守作業員は乗客の安全を確保するため、一定の間隔でエレベーターを点検する。",
    skill: "前置詞（at regular intervals）",
    source: "オリジナル問題",
    verified: false
  },
  {
    id: "TOEIC-2026-0018",
    part: "Part 5 Grammar",
    level: "hard",
    question: "The latest model is far ____ its predecessor in both battery life and processing speed.",
    options: ["superior than", "superior to", "more superior to", "superiority to"],
    correct: 1,
    explanation: "superior は前置詞 to を伴って「〜より優れている」を表すので superior to が正解。(A) than は取らず、(C) more superior は二重比較で誤り、(D) superiority は名詞で is の補語として機能しない。",
    translation: "最新モデルはバッテリー寿命と処理速度の両面で、旧モデルよりはるかに優れている。",
    skill: "比較（superior to・ラテン比較級）",
    source: "オリジナル問題",
    verified: false
  }
];
