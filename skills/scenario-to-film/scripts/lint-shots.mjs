#!/usr/bin/env node
// Lint a shot-list markdown table: | # | length | camera | scene | sound |
// Usage: node lint-shots.mjs shots.md [--max-seconds N]
// Reads only the table whose header has a length column (length or 길이) and a sound column
// (sound or 소리). Other tables in the file (notes, transitions) are ignored.
// Checks the document only. It cannot judge the video.
import { readFileSync } from 'node:fs';

const file = process.argv[2];
const maxIdx = process.argv.indexOf('--max-seconds');
const maxSeconds = maxIdx > 0 ? Number(process.argv[maxIdx + 1]) : null;
if (!file) {
  console.error('usage: node lint-shots.mjs shots.md [--max-seconds N]');
  process.exit(2);
}

const lines = readFileSync(file, 'utf8').split(/\r?\n/);
const tables = [];
let cur = null;
for (const l of lines) {
  if (l.trim().startsWith('|')) {
    if (!cur) { cur = []; tables.push(cur); }
    cur.push(l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
  } else {
    cur = null;
  }
}

const isShotTable = (t) => {
  const h = (t[0] ?? []).join(' ').toLowerCase();
  return /length|길이/.test(h) && /sound|소리/.test(h);
};
const table = tables.find(isShotTable);
const problems = [];
if (!table) problems.push('no shot table found (header needs a length and a sound column)');

const shots = (table ?? []).filter((r) => /^\d+$/.test(r[0] ?? ''));
if (table && shots.length === 0) problems.push('shot table has no numbered rows');

let total = 0;
for (const r of shots) {
  const n = r[0];
  const secs = parseFloat((r[1] ?? '').replace(/[^\d.]/g, ''));
  if (!Number.isFinite(secs) || secs <= 0) problems.push(`shot ${n}: length missing or not a number`);
  else {
    total += secs;
    if (secs > 10) problems.push(`shot ${n}: ${secs}s is longer than 10s`);
  }
  if (!r[2]) problems.push(`shot ${n}: camera empty`);
  if (!r[3]) problems.push(`shot ${n}: scene empty`);
  if (!r[4]) problems.push(`shot ${n}: sound empty`);
}

if (maxSeconds !== null && total > maxSeconds + 0.001) {
  problems.push(`total ${total}s exceeds limit ${maxSeconds}s`);
}

console.log(JSON.stringify({ shots: shots.length, total_seconds: total, problems }, null, 2));
process.exit(problems.length ? 1 : 0);
