// TOEIC Reading Hub β — Part 5 Vocabulary 問題データ
// 共通スキーマ:
// {
//   id: "TOEIC-2026-0001",
//   part: "Part 5 Vocabulary",
//   level: "easy" | "medium" | "hard",
//   question: "英文（空所は ____ で表す）",
//   options: ["A", "B", "C", "D"],
//   correct: 0,            // 0〜3
//   explanation: "日本語の解説",
//   translation: "英文の和訳",
//   skill: "語彙 / コロケーション / 動詞語法 など",
//   source: "オリジナル問題",
//   verified: false
// }
// すべてオリジナル英文・オリジナル設問。公式問題・既存教材のコピー禁止。
const QUESTIONS_P5_VOCAB = [
  {
    id: "TOEIC-2026-0003",
    part: "Part 5 Vocabulary",
    level: "standard",
    question: "All employees are required to ____ to the new data security guidelines by the end of the month.",
    options: ["adhere", "attach", "apply", "appoint"],
    correct: 0,
    explanation: "adhere to で「〜を順守する」という意味になり、guidelines（指針）に従う文脈に合う。(B) attach to は「付属する」、(C) apply to は「当てはまる／応募する」、(D) appoint は「任命する」で文意に合わない。",
    translation: "全従業員は月末までに新しいデータセキュリティ指針を順守することが求められている。",
    skill: "語彙（動詞＋前置詞 adhere to）",
    source: "オリジナル問題",
    verified: false
  },
  {
    id: "TOEIC-2026-0004",
    part: "Part 5 Vocabulary",
    level: "advanced",
    question: "The board postponed its decision because the financial projections were considered too ____ to rely on.",
    options: ["tentative", "reluctant", "eligible", "prospective"],
    correct: 0,
    explanation: "「頼るには〜すぎる」の空所には「暫定的で不確実な」を表す tentative が最適。(B) reluctant は「気が進まない（人を主語にする）」、(C) eligible は「資格がある」、(D) prospective は「見込みの」で文意に合わない。",
    translation: "財務予測は頼るには暫定的すぎると見なされたため、取締役会は決定を延期した。",
    skill: "語彙（形容詞 tentative のニュアンス）",
    source: "オリジナル問題",
    verified: false
  }
];
