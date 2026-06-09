# TOEIC Reading Hub - question data verifier
# Checks: total / duplicate id / options=4 / correct 0-3 / explanation / translation / part / Part7 passage
# Usage: powershell -ExecutionPolicy Bypass -File verify-questions.ps1

$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$node = @'
const fs = require('fs');
const cats = ['Part 5 Grammar','Part 5 Vocabulary','Part 6 Text Completion','Part 7 Reading'];
const files = [
  'questions-part5-grammar.js',
  'questions-part5-vocab.js',
  'questions-part6.js',
  'questions-part7.js'
];

function stripBom(s){ return (s.charCodeAt(0) === 0xFEFF) ? s.slice(1) : s; }

let all = [];
for (const f of files) {
  if (!fs.existsSync(f)) { console.log('FILE NOT FOUND: ' + f); process.exit(2); }
  let code = stripBom(fs.readFileSync(f, 'utf8'));
  // "const NAME = [ ... ];"  ->  "return [ ... ];"
  const body = code.replace(/^[\s\S]*?const\s+\w+\s*=\s*/, 'return ');
  let arr;
  try { arr = new Function(body)(); }
  catch (e) { console.log('PARSE ERROR in ' + f + ': ' + e.message); process.exit(2); }
  if (!Array.isArray(arr)) { console.log('NOT AN ARRAY in ' + f); process.exit(2); }
  for (const q of arr) all.push({ q, f });
}

const errors = [];
const warns = [];
const seen = new Map();

for (const { q, f } of all) {
  const id = (q && q.id) ? q.id : '(no id)';
  if (!q || typeof q !== 'object') { errors.push(f + ': item is not an object'); continue; }
  if (!q.id) errors.push(f + ': missing id');
  else {
    if (seen.has(q.id)) errors.push('duplicate id: ' + q.id);
    seen.set(q.id, true);
  }
  if (!cats.includes(q.part)) errors.push(id + ': invalid part (' + q.part + ')');
  if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(id + ': options is not 4');
  if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) errors.push(id + ': correct not in 0-3');
  if (!q.explanation) errors.push(id + ': missing explanation');
  if (!q.translation) warns.push(id + ': missing translation');
  if (q.part === 'Part 7 Reading' && !q.passage) errors.push(id + ': Part 7 missing passage');
}

const byPart = {};
for (const c of cats) byPart[c] = 0;
for (const { q } of all) if (cats.includes(q.part)) byPart[q.part]++;

console.log('================================================================');
console.log(' TOEIC Reading Hub - question data verify');
console.log('================================================================');
console.log('[ counts ]');
console.log('  total                 : ' + all.length);
for (const c of cats) console.log('  ' + c.padEnd(22) + ': ' + byPart[c]);
console.log('');
console.log('[ result ]');
console.log('  duplicate id          : ' + (([...seen.keys()].length === all.length) ? 'none' : 'FOUND'));
console.log('  errors                : ' + errors.length);
console.log('  warnings              : ' + warns.length);
errors.forEach(e => console.log('    [ERROR] ' + e));
warns.forEach(w => console.log('    [WARN]  ' + w));
console.log('');
if (errors.length === 0) {
  console.log('================================================================');
  console.log(' OK : verify passed - no errors');
  console.log('================================================================');
  process.exit(0);
} else {
  console.log('================================================================');
  console.log(' NG : errors found');
  console.log('================================================================');
  process.exit(1);
}
'@

Push-Location $PSScriptRoot
try {
  $node | node -
  $code = $LASTEXITCODE
} finally {
  Pop-Location
}
exit $code
