# Previs tools

Previs is a rough, cheap version of the film that the user can judge before any paid generation.
Install nothing until this step; first check whether the tool already runs.

## Choose

- **CozyClay** (browser previs, AGPL-3.0-or-later; run it as a separate program, never copy
  its code): fast, visual, undo on every edit.
- **Blender 5.2 + scenario-labs/skills** (MIT): `scenario-blender-previs-storyboard` for a
  director-readable animatic, `scenario-blender-blockout` for a grey reference clip a video model
  follows, `scenario-blender-expert` as background. Use when exact framing or crowds matter.

## CozyClay: notes from one Windows machine (tested 3.0.3)

1. `npx cozyclay` is the documented install. It failed on the test machine because the npm config in `.npmrc` set a prefix. If it fails for you too, clone the repo,
   run `npm install --no-audit --no-fund`, then install the missing package with
   `npm install jpeg-js --no-save`, then `npm run dev` (serves http://127.0.0.1:5180/app/).
2. Open the URL in a Chromium browser. The browser tab is the editor.
3. Control it from a shell with `cclay live` or from Claude Code through MCP. One live hub per
   port: studio and MCP both default to 5184; give the second a different `COZYCLAY_LIVE_PORT`
   or it works silently in memory only.
4. Look at results with the tool's `capture` command, not a window screenshot.
5. If a command returns `UNCERTAIN_APPLY`, inspect the scene before trying again. Do not repeat
   the edit blindly; each edit has a receipt that `undo` can revert.
6. Motion is compiled, then QA checks collisions, foot slide, reach and hand contact before you
   look. Read the QA report; a clean report is not the same as a good shot.
7. Drive CozyClay from your own agent through its terminal commands or MCP server. In the test
   the studio's built-in agent panel with one particular model gave poor results; if yours does,
   use your agent instead.

## Check what is already installed

Look for Blender (`blender --version`, or the install folder), for the previs skills (the
`scenario-blender-*` skill folders of [scenario-labs/skills](https://github.com/scenario-labs/skills)
in your agent's skills folder) and for an existing CozyClay clone or the `cclay` command. Install
only what is missing and only with the user's approval.

## Rendering a Blender previs

With a finished scene file, render frames and join them (adjust frame range and fps to the scene):

```
blender -b scene.blend -o //frames/f_#### -F PNG -s 1 -e 480 -a
ffmpeg -framerate 24 -i frames/f_%04d.png -c:v libx264 -pix_fmt yuv420p previs.mp4
```

(This is the standard Blender command line; it was not run against a real scene while writing this document, so adjust it to yours.)

If the shot list ends with black frames, decide whether they are inside the planned length or
extra, and write it in the hand-off sheet so nobody inherits them by accident.

## Hand-off sheet (ships with the previs clip)

Every number is read off the built scene, never retyped from the brief. Before the scene is
built, the sheet can only hold planned values: use two columns, **planned** and **measured**, and
fill the measured column from the scene once it exists. Include:

- format: fps, width x height, frame range, seconds, clip file and stills;
- color legend: color, element, what it becomes;
- cut list: shot, camera, frames, start, end, duration, lens, move (exact times, not rounded);
- cast table: figure, style, color, height, signature feature, what it becomes;
- entities: what each proxy mass stands for; what exists only in text (extras, crowds, with a
  counting rule such as "no more than four pedestrians");
- artifacts with timecodes (black gap frames, floor grid) that must not be inherited;
- motion states in words (a slow proxy move reads as either rolling or standing still).

Tie-breaks: the clip defines the whole camera path; if text and clip disagree about motion or
position the clip wins; every placeholder becomes the real object its position and size imply.

## Prompt grammar for the video model

Describe the finished shot as if it already existed, motion first. Start with a rehearsal header:
the reference video is rehearsal footage; take only the camera path and framing, action timing and
each element's screen position, path, ground contact and scale; no shape or surface from the clip
belongs in the final frame. List the cast by role and motion. Allow real proportions where a
stand-in differs. After the header use no geometry words (box, cone, capsule, proxy, dummy).

## Previs checks

Judge identity from data (the cast table), not from a low-resolution screenshot. Check frame math
(integer fps, expected length), that the camera switches exactly on each cut frame without a lens
pop, that the subject stays in frame, that nothing blocks the head, and that no cheat (hovering
feet, giant furniture) shows. Judge the finished video against the previs side by side on the same
timeline, not the previs viewport alone.





