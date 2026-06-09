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
  }
];
