// TOEIC Reading Hub β — Part 7 Reading 問題データ
// 共通スキーマ + Part 7 追加項目:
// {
//   id: "TOEIC-2026-0001",
//   part: "Part 7 Reading",
//   level: "easy" | "medium" | "hard",
//   passageType: "email" | "notice" | "article" | "chat" | "advertisement" など,
//   passage: "オリジナル英文パッセージ本文",
//   question: "設問文",
//   options: ["A", "B", "C", "D"],
//   correct: 0,            // 0〜3
//   explanation: "日本語の解説",
//   translation: "パッセージ/設問の和訳",
//   skill: "概要把握 / 詳細 / 推測 / 言い換え など",
//   source: "オリジナル問題",
//   verified: false
// }
// すべてオリジナル英文・オリジナル設問。公式問題・既存教材のコピー禁止。
const QUESTIONS_P7 = [
  {
    id: "TOEIC-2026-0007",
    part: "Part 7 Reading",
    level: "standard",
    passageType: "email",
    passage: "To: All Staff\nFrom: Facilities Management\nSubject: Parking Lot Maintenance\n\nPlease be aware that the north parking lot will be closed for resurfacing from Monday, June 9 to Wednesday, June 11. During this period, employees may use the south lot or the street-level spaces behind Building C. We apologize for any inconvenience and appreciate your cooperation.",
    question: "What are employees asked to do during the maintenance period?",
    options: ["Work from home for three days", "Park in alternative locations", "Pay for street parking", "Report to Building C for reassignment"],
    correct: 1,
    explanation: "本文に「南駐車場やC棟裏の路上スペースを利用してよい」とあり、従業員は代替の場所に駐車するよう求められている。(A) 在宅勤務、(C) 有料駐車、(D) C棟での再配置はいずれも本文に根拠がない。",
    translation: "（宛先：全スタッフ／差出人：施設管理／件名：駐車場メンテナンス）北駐車場は6月9日(月)から11日(水)まで舗装工事のため閉鎖されます。その間、従業員は南駐車場かC棟裏の路上スペースを利用できます。ご不便をおかけしますが、ご協力をお願いいたします。",
    skill: "Part 7 詳細把握（指示内容の読み取り）",
    source: "オリジナル問題",
    verified: false
  },
  {
    id: "TOEIC-2026-0008",
    part: "Part 7 Reading",
    level: "hard",
    passageType: "text message chat",
    passage: "Daniel (9:02 a.m.): The client just moved our presentation up to 1 p.m. today. Can the slides be ready by noon?\nMei (9:05 a.m.): The design is done, but I'm still waiting on the final sales figures from Robert.\nDaniel (9:06 a.m.): I'll call him now. If he sends them within the hour, will that work?\nMei (9:08 a.m.): That's cutting it close, but yes — as long as I have them by eleven.",
    question: "What does Mei imply about finishing the slides?",
    options: ["The design still needs major revisions", "She cannot complete them without Robert's data", "The presentation should be postponed", "She has already sent the slides to the client"],
    correct: 1,
    explanation: "Mei は「デザインは完了したが、Robert からの最終売上数字を待っている」「11時までにもらえれば間に合う」と述べており、Robert のデータがなければスライドを完成できないことを示唆している。(A) デザインは完了済み、(C) 延期には触れていない、(D) 送信済みも本文と矛盾する。",
    translation: "（チャット）ダニエル(9:02):クライアントがプレゼンを今日の13時に前倒しした。正午までにスライドを用意できる？／メイ(9:05):デザインは完成したけど、Robertからの最終売上数字をまだ待っている。／ダニエル(9:06):今すぐ彼に電話する。1時間以内に送ってくれれば間に合う？／メイ(9:08):ぎりぎりだけど、11時までにもらえれば大丈夫。",
    skill: "Part 7 推測（含意の読み取り）",
    source: "オリジナル問題",
    verified: false
  }
];
