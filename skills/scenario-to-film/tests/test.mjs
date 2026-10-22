// Runs the three checkers on small fixtures. Exit 77 = skipped (optional tool missing).
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const scripts = path.join(here, '..', 'scripts');
const fx = (f) => path.join(here, 'fixtures', f);
const run = (cmd, args) => spawnSync(cmd, args, { encoding: 'utf8' });
let failed = 0;
const check = (name, ok, detail = '') => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok ? '' : '  ' + detail)); if (!ok) failed++; };

let r = run('node', [path.join(scripts, 'lint-shots.mjs'), fx('shots-ok.md'), '--max-seconds', '12']);
check('shots: good list passes', r.status === 0, r.stdout + r.stderr);
r = run('node', [path.join(scripts, 'lint-shots.mjs'), fx('shots-ok.md'), '--max-seconds', '8']);
check('shots: total above the limit fails', r.status !== 0);
r = run('node', [path.join(scripts, 'lint-shots.mjs'), fx('shots-bad.md')]);
check('shots: 14 s shot and empty camera fail', r.status !== 0 && /longer than 10s/.test(r.stdout) && /camera empty/.test(r.stdout), r.stdout);

r = run('node', [path.join(scripts, 'validate-plan.mjs'), fx('plan-ok.json')]);
check('plan: good plan passes', r.status === 0 && /"ok": true/.test(r.stdout), r.stdout);
r = run('node', [path.join(scripts, 'validate-plan.mjs'), fx('plan-bad.json')]);
check('plan: placeholder, 2 s clip and wrong @picture number fail',
  r.status !== 0 && /placeholder left/.test(r.stdout) && /between 3 and 15/.test(r.stdout) && /@picture_4/.test(r.stdout), r.stdout);
const tpl = path.join(here, '..', 'assets', 'plan-template.json');
r = run('node', [path.join(scripts, 'validate-plan.mjs'), tpl]);
check('plan: template alone does not pass', r.status !== 0);
r = run('node', [path.join(scripts, 'validate-plan.mjs'), tpl, '--allow-placeholders']);
check('plan: template passes with --allow-placeholders', r.status === 0, r.stdout);

// best-match-cut needs ffmpeg, Python, Pillow and numpy
const py = process.env.PYTHON || 'python3';
const have = (cmd, args) => { const x = run(cmd, args); return x.status === 0; };
if (!have('ffmpeg', ['-version']) || !have(py, ['-c', 'import PIL, numpy'])) {
  console.log('skip best-match-cut (ffmpeg, Pillow or numpy missing)');
  process.exit(failed ? 1 : 77);
}
const tmp = path.join(here, 'tmp-clips'); import('node:fs').then(async (fs) => {
  fs.mkdirSync(tmp, { recursive: true });
  const mk = (name, src) => run('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', src, '-t', '3', '-pix_fmt', 'yuv420p', path.join(tmp, name)]);
  mk('a.mp4', 'testsrc=size=320x180:rate=24');
  mk('b.mp4', 'testsrc=size=320x180:rate=24');
  mk('c.mp4', 'smptebars=size=320x180:rate=24');
  r = run(py, [path.join(scripts, 'best-match-cut.py'), path.join(tmp, 'a.mp4'), path.join(tmp, 'c.mp4'), '--a-from', '1']);
  check('cut: unrelated clips are called different shots', /different shots/.test(r.stdout), r.stdout + r.stderr);
  r = run(py, [path.join(scripts, 'best-match-cut.py'), path.join(tmp, 'a.mp4'), path.join(tmp, 'b.mp4'), '--a-from', '1']);
  check('cut: script runs and prints a verdict for similar clips', /ratio .*x ->/.test(r.stdout), r.stdout + r.stderr);
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(failed ? 1 : 0);
});
