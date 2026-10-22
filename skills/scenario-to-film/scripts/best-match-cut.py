"""Find the most similar frame pair between the end of clip A and the start of clip B.

Usage: python best-match-cut.py A.mp4 B.mp4 [--a-from 3.5] [--b-len 2.0]
Needs: ffmpeg on PATH, Python with Pillow and numpy.
Prints the best (A time, B time) and compares it with A's own frame-to-frame difference.
"""
import argparse, glob, os, subprocess, tempfile
import numpy as np
from PIL import Image

def frames(path, start, length, outdir):
    cmd = ["ffmpeg", "-v", "error", "-y"]
    if start: cmd += ["-ss", str(start)]
    cmd += ["-i", path]
    if length: cmd += ["-t", str(length)]
    cmd += ["-vf", "fps=24,scale=160:90,format=gray", os.path.join(outdir, "%04d.png")]
    subprocess.run(cmd, check=True)
    return [np.asarray(Image.open(f), dtype=np.float32) for f in sorted(glob.glob(os.path.join(outdir, "*.png")))]

ap = argparse.ArgumentParser()
ap.add_argument("a"); ap.add_argument("b")
ap.add_argument("--a-from", type=float, default=0.0, help="start looking in A at this second")
ap.add_argument("--b-len", type=float, default=2.0, help="look at the first N seconds of B")
args = ap.parse_args()

with tempfile.TemporaryDirectory() as ta, tempfile.TemporaryDirectory() as tb:
    A = frames(args.a, args.a_from, None, ta)
    B = frames(args.b, 0, args.b_len, tb)

best = min(((float(np.mean(np.abs(a - b))), args.a_from + i / 24, j / 24)
            for i, a in enumerate(A) for j, b in enumerate(B)))
nat = [float(np.mean(np.abs(A[k + 1] - A[k]))) for k in range(len(A) - 1)]
print(f"best pair: A at {best[1]:.3f}s, B at {best[2]:.3f}s, mean difference {best[0]:.2f}")
print(f"A's own frame-to-frame difference: average {sum(nat)/len(nat):.2f}, max {max(nat):.2f}")
ratio = best[0] / max(sum(nat) / len(nat), 1e-6)
# Provisional thresholds from one film: a pair that cut cleanly measured about 6x, an unrelated pair about 50x.
if ratio < 10:
    verdict = "likely a clean match cut (still look at it once)"
elif ratio < 25:
    verdict = "borderline: check by eye, consider a dip to black"
else:
    verdict = "different shots: no invisible cut, use a dip to black or restage"
print(f"ratio {ratio:.1f}x ->", verdict)
