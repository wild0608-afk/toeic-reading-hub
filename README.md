# TOEIC Reading Hub β v0.1

**TOEIC 700点台から800点突破を狙う学習者**向けの、**Reading特化** TOEIC 学習アプリ（β）。
鍛える力：**読む速度・正確性・言い換え対応力**（Speed / Accuracy / Paraphrase）。

## 方針
- **Listening は実装しない**（Reading特化）。
- 問題は**すべてオリジナル英文・オリジナル設問**。公式問題・既存教材の英文/設問/選択肢のコピーは禁止。
- まずは **100問β** を目標（v0.1 は骨組み＋データ構造準備まで）。

## カテゴリ（part）
1. `Part 5 Grammar` — 短文穴埋め（文法）
2. `Part 5 Vocabulary` — 短文穴埋め（語彙）
3. `Part 6 Text Completion` — 長文穴埋め
4. `Part 7 Reading` — 読解（オリジナルパッセージ）

## 機能（v0.1 骨組み）
- ホーム（主役：今日の5問）
- 今日の5問 / 分野別学習 / ランダム10問 / ランダム20問 / ミニ模試20問
- 間違い復習 / 付箋 / 学習記録
- 学習補助：品詞マップ / 接続詞・前置詞マップ / 言い換えマップ / 7日間Readingコース / 使い方ガイド

## データ構造
共通項目：
`id, part, level, question, options, correct, explanation, translation, skill, source, verified`

Part 7 追加項目：
`passageType, passage`

- `id`：`TOEIC-2026-0001` から連番
- `options`：4択 / `correct`：0〜3
- 問題本体は `questions-part5-grammar.js` / `questions-part5-vocab.js` / `questions-part6.js` / `questions-part7.js` に分割

## ファイル構成
| ファイル | 役割 |
|---|---|
| `index.html` | 画面シェル（#app）＋スクリプト読み込み |
| `style.css` | スタイル（スマホ優先・清潔感のある配色） |
| `script.js` | アプリ本体（画面・出題ロジック・localStorage） |
| `questions-part5-grammar.js` | Part 5 Grammar 問題配列 |
| `questions-part5-vocab.js` | Part 5 Vocabulary 問題配列 |
| `questions-part6.js` | Part 6 問題配列 |
| `questions-part7.js` | Part 7 問題配列 |
| `verify-questions.ps1` | 問題データ検証スクリプト |
| `README.md` | 本ファイル |

## localStorage
- キー：`toeic_reading_hub_v1`
- 保存内容：解答履歴・誤答数・付箋・連続学習日数など（端末内のみ）

## 検証
```powershell
powershell -ExecutionPolicy Bypass -File verify-questions.ps1
```
検証項目：総問題数 / ID重複 / options4つ / correctが0〜3 / explanation有無 / translation有無 / part有効性 / Part7のpassage有無。
**エラー0・警告0** を目標とする。

## ステータス
- v0.1：骨組み＋空の問題配列（0問）。verify はエラー0で通る状態。
- 次フェーズ：オリジナル問題を投入し 100問β を目指す。
