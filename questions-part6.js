// TOEIC Reading Hub β — Part 6 Text Completion 問題データ
// 共通スキーマ:
// {
//   id: "TOEIC-2026-0001",
//   part: "Part 6 Text Completion",
//   level: "easy" | "medium" | "hard",
//   question: "空所を含む短文（または該当文）。空所は ____ で表す",
//   options: ["A", "B", "C", "D"],
//   correct: 0,            // 0〜3
//   explanation: "日本語の解説",
//   translation: "英文の和訳",
//   skill: "文脈語彙 / 接続表現 / 文選択 など",
//   source: "オリジナル問題",
//   verified: false
// }
// すべてオリジナル英文・オリジナル設問。公式問題・既存教材のコピー禁止。
const QUESTIONS_P6 = [
  {
    id: "TOEIC-2026-0005",
    part: "Part 6 Text Completion",
    level: "standard",
    question: "Thank you for your interest in our service. Unfortunately, the Basic plan you mentioned is no longer available. ____, we recommend the Standard plan, which includes all the same features at a similar price.",
    options: ["Instead", "However", "Therefore", "For example"],
    correct: 0,
    explanation: "廃止されたプランの「代わりに」別のプランを勧める流れなので Instead が正解。(B) However は逆接だが後続が推奨内容で不自然、(C) Therefore は因果関係、(D) For example は例示で文脈に合わない。",
    translation: "当サービスにご関心をお寄せいただきありがとうございます。あいにく、お問い合わせのベーシックプランは現在ご利用いただけません。代わりに、ほぼ同じ機能を同程度の価格で備えたスタンダードプランをお勧めします。",
    skill: "Part 6 接続副詞（文脈のつながり）",
    source: "オリジナル問題",
    verified: false
  },
  {
    id: "TOEIC-2026-0006",
    part: "Part 6 Text Completion",
    level: "advanced",
    question: "We were disappointed with the recent shipment. Because the supplier failed to ____ the terms of the contract, we have decided to look for a new vendor.",
    options: ["honor", "admit", "remind", "consist"],
    correct: 0,
    explanation: "honor the terms of the contract で「契約条件を守る・履行する」という意味になり、新しい業者を探す理由として自然。(B) admit は「認める」、(C) remind は「思い出させる」、(D) consist は「成り立つ（consist of）」で文意に合わない。",
    translation: "最近の納品には失望させられた。供給業者が契約条件を守らなかったため、私たちは新しいベンダーを探すことにした。",
    skill: "Part 6 文脈語彙・コロケーション（honor the terms）",
    source: "オリジナル問題",
    verified: false
  }
];
