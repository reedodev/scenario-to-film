#!/usr/bin/env node
// Validate the structure of a generation plan (see references/generation-plan.md).
// Usage: node validate-plan.mjs plan.json [--allow-placeholders]
// Clip length must be 3-15 s. @picture_N counts the images of that clip's scene, starting at 1.
// Checks the document only. It cannot judge faces, lip sync or continuity of generated clips.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const file = process.argv[2];
if (!file) { console.error('usage: node validate-plan.mjs plan.json'); process.exit(2); }

const problems = [];
const warnings = [];
let plan;
try { plan = JSON.parse(readFileSync(file, 'utf8')); }
catch (e) { console.log(JSON.stringify({ ok: false, problems: [`JSON parse error: ${e.message}`] }, null, 2)); process.exit(1); }

const MODES = new Set(['I2V', 'R2V', 'T2V']);
const scenes = Array.isArray(plan.scenes) ? plan.scenes : [];
const clips = Array.isArray(plan.clips) ? plan.clips : [];
if (!plan.settings || typeof plan.settings !== 'object') problems.push('settings missing');
if (!scenes.length) problems.push('scenes missing or empty');
if (!clips.length) problems.push('clips missing or empty');

const ids = new Set();
scenes.forEach((s, i) => {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(s.id ?? '')) problems.push(`scene ${i + 1}: id must be 1-64 letters, digits, _ or -`);
  if (ids.has(s.id)) problems.push(`scene ${i + 1}: duplicate id ${s.id}`);
  ids.add(s.id);
  const sp = String(s.prompt ?? '');
  if (/\b(dialogue|says|said)\b|<d>|\[Shot/i.test(sp)) warnings.push(`scene ${s.id}: scene prompt looks like it holds events or dialogue (keep it static)`);
  if (i === 0 && s.continue_previous === true) problems.push('first scene cannot continue a previous scene');
  const imgs = s.references?.images ?? [];
  if (imgs.length > 9) problems.push(`scene ${s.id}: more than 9 reference images`);
  if ((s.references?.videos ?? []).length > 3) problems.push(`scene ${s.id}: more than 3 reference videos`);
  if ((s.references?.audios ?? []).length > 3) problems.push(`scene ${s.id}: more than 3 reference audios`);
});

const order = scenes.map((s) => s.id);
let lastIdx = -1;
const finished = new Set();
let prevScene = null;
clips.forEach((c, i) => {
  const n = i + 1;
  if (!ids.has(c.scene_id)) { problems.push(`clip ${n}: scene_id ${c.scene_id} not found`); return; }
  const idx = order.indexOf(c.scene_id);
  if (idx < lastIdx) problems.push(`clip ${n}: goes back to an earlier scene (${c.scene_id})`);
  if (prevScene && c.scene_id !== prevScene) finished.add(prevScene);
  if (finished.has(c.scene_id)) problems.push(`clip ${n}: returns to scene ${c.scene_id} after leaving it`);
  lastIdx = Math.max(lastIdx, idx);
  prevScene = c.scene_id;

  if (!MODES.has(c.mode)) problems.push(`clip ${n}: mode must be I2V, R2V or T2V`);
  const sec = Number(c.seconds);
  if (!Number.isFinite(sec) || sec < 3 || sec > 15) problems.push(`clip ${n}: seconds must be between 3 and 15`);
  if (!String(c.prompt ?? '').trim()) problems.push(`clip ${n}: prompt empty`);
  const isFresh = i === 0 || scenes.find((s) => s.id === c.scene_id)?.id !== clips[i - 1]?.scene_id; // first clip of a scene
  if (c.mode === 'I2V' && isFresh && !String(c.first_image ?? '').trim()) problems.push(`clip ${n}: fresh I2V clip needs first_image`);
  if (!c.refiner || !['on', 'off'].includes(c.refiner.mode)) warnings.push(`clip ${n}: refiner not set (use off by default)`);
  const tags = [...String(c.prompt ?? '').matchAll(/@picture_(\d+)/g)].map((m) => Number(m[1]));
  const sceneImgs = scenes.find((s) => s.id === c.scene_id)?.references?.images ?? [];
  for (const t of tags) if (t < 1 || t > sceneImgs.length) problems.push(`clip ${n}: @picture_${t} is not in scene ${c.scene_id}'s image list (${sceneImgs.length} images)`);
});

// Placeholders and missing files. A template or a plan with made-up names must not pass as finished.
const allowPlaceholders = process.argv.includes('--allow-placeholders');
const planDir = dirname(resolve(file));
const walk = (v, path) => {
  if (typeof v === 'string') {
    if (!allowPlaceholders && (/^<.*>$/.test(v.trim()) || /placeholder/i.test(v))) problems.push(`placeholder left in ${path}: "${v.slice(0, 40)}" (use --allow-placeholders only for the template)`);
    return;
  }
  if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k);
};
walk(plan, '');
const fileFields = [];
scenes.forEach((s) => ['images', 'videos', 'audios'].forEach((k) => (s.references?.[k] ?? []).forEach((f) => fileFields.push([`scene ${s.id} ${k}`, f]))));
clips.forEach((c, i) => ['first_image', 'last_image'].forEach((k) => { if (c[k]) fileFields.push([`clip ${i + 1} ${k}`, c[k]]); }));
for (const [where, f] of fileFields) {
  if (typeof f === 'string' && !/^<.*>$/.test(f) && !existsSync(resolve(planDir, f))) warnings.push(`${where}: file not found next to the plan: ${f}`);
}
const total = clips.reduce((a, c) => a + (Number(c.seconds) || 0), 0);
console.log(JSON.stringify({ ok: problems.length === 0, scenes: scenes.length, clips: clips.length, total_target_seconds: total, problems, warnings }, null, 2));
process.exit(problems.length ? 1 : 0);



