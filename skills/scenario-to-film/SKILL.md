---
name: "scenario-to-film"
description: "Use when a script or story idea must become a finished ad or short film with planned camera moves, cuts and sound: reviews the script for a fair paradox and an emotional turn, builds a shot list and a cheap 3D previs (CozyClay or Blender) for the user to approve, only then generates video shot by shot, designs sound, assembles and QA-checks the cut. Skip for a single still image, editing an already finished video, or music-only videos."
---

# Scenario to film

One script in, a checked ad or short film out. The user approves two gates; the rest runs by
itself. This skill grants no new permission to spend credits, pay, publish or contact anyone:
every paid generation, upload and post still needs the user's existing approval.

## Do not use it for

A single still, a small edit to a finished video, a music-only video, or a video with no story.
Do not install previs tools until step 4 needs them; check whether they already run first.

## Pipeline

| Step | What | Output | Gate |
|---|---|---|---|
| 1. Script | Length, ratio, cast (max 2-3 people), setting, one-line story, result-first opening | `script.md` | |
| 1b. Script doctor | Fair paradox, emotional turn, light beat, cuts ([script-doctor](references/script-doctor.md)) | `script-review.md`, `script-v2.md` | Cheap gate: user reads v2 |
| 2. Shot list | One row per shot: length, camera move ([camera-movements](references/camera-movements.md)), framing, color role, transition in and out ([film-look](references/film-look-and-transitions.md)), action, sound ([shot-list](references/shot-list.md)) | `shots.md`, lint report | |
| 3. Reference stills | Human cast, film or ad look, composition and color script ([reference-images](references/reference-images.md), [film-look](references/film-look-and-transitions.md)) | `refs/` | |
| 4. Previs | Rough 3D with real camera moves and cut timing, one animatic ([previs-tools](references/previs-tools.md)) | `previs.mp4`, hand-off sheet | **Gate 1: user watches and approves** |
| 5. Generation plan | Scenes and clips with references, prompts layered without leaks, lengths, model, expected cost ([generation-plan](references/generation-plan.md), table in `assets/gen-plan-template.md`) | `plan.json`, `gen-plan.md` | **Gate 2: user approves cost** |
| 6. Generate | Shot by shot, check each clip first ([generation-and-cost](references/generation-and-cost.md)) | `clips/`, cost log | |
| 7. Sound | Sound dramaturgy, effects, music, voice ([sound](references/sound.md)) | `audio/` | |
| 8. Assemble + QA | Cut, mix, subtitles, check the encoded file ([qa-and-evidence](references/qa-and-evidence.md), [assemble-and-polish](references/assemble-and-polish.md)) | `final.mp4`, QA table, `unknowns.md` | |

Never spend paid generation credits before gate 2. If a step fails, read
[recovery](references/recovery.md) for the observed symptom instead of repeating the whole setup.

## Core rules

- Open with the best finished frame in the first 3 seconds, then explain.
- One idea and one camera move per shot. Two people in one shot doubles the failure rate.
- Shot length comes from the sound event, not the other way around.
- Fix identity in the reference still and previs geometry first, in prompt text second.
- A shot that fails twice is simplified or cut, not retried a third time.
- Limits the checkers enforce: a shot is at most 10 s, a plan clip is 3-15 s (plan a 2 s shot as a 3 s clip and trim it in the edit), the total may not exceed the film length you set.
- A prop the story turns on gets its own reference still, like each character and place.
- Beginners: the README glossary explains the terms used here (previs, gate, I2V/R2V/T2V, LUFS, cut junctions). When the user is new, explain a term in one plain sentence the first time you use it.
- Previs is judged for story and rhythm. Look (material, light, faces) is left to the video model.
- Passing a check is not the same as having checked everything. Report what was seen, measured
  and not checked in separate columns.
- Record the tool versions a result was tested with. Follow the installed tool's real UI and
  schema when it differs from this document.

## Before you start (준비물)

| Need | Level | Notes |
|---|---|---|
| An agent that reads `SKILL.md` and a story idea | required | Length, aspect ratio, 2-3 people |
| Node.js 18 or newer (tested with 22) | required for the checkers | `lint-shots.mjs`, `validate-plan.mjs` |
| Python 3 with Pillow and numpy, ffmpeg on PATH | recommended | `best-match-cut.py` finds the best frame pair for a cut |
| Blender 5.x | recommended | Previs; CozyClay (AGPL, separate program) is the alternative |
| A video model account the user pays for | optional until step 6 | Nothing paid runs before gate 2 |

## Say it this way to change it (바꿔 쓰기)

| You say | The skill does |
|---|---|
| "Only the script and shot list" | Stops after step 2 and runs the shot-list check |
| "Show me the cost table first" | Builds `gen-plan.md` from `assets/gen-plan-template.md` and waits at gate 2 |
| "Make it vertical 9:16" | Sets `aspect` in the plan and frames for vertical |
| "Two clips look wrong together" | Runs `scripts/best-match-cut.py`, then picks a hard cut or a dip to black |
| "Less narration" | Applies the narration rules in `references/assemble-and-polish.md` |
| "Compare the better model on one shot first" | Makes one shot on two models and compares frames and cost |

## References

- [script-doctor](references/script-doctor.md): paradox, fair reveal, emotion, coverage choices
- [shot-list](references/shot-list.md): shot rows, generability check, previs critique, lint script
- [film-look-and-transitions](references/film-look-and-transitions.md): composition, color script, still prompt anatomy, scene transitions
- [camera-movements](references/camera-movements.md): 44-move library, prompt pattern, choosing a move
- [sources](references/sources.md): saved reference sites with what each is good for
- [reference-images](references/reference-images.md): human cast, film and ad looks
- [previs-tools](references/previs-tools.md): CozyClay, Blender, hand-off sheet, prompt grammar
- [generation-plan](references/generation-plan.md): plan structure, scene splitting, prompt layers, reference mapping, length, regeneration, checks
- [generation-and-cost](references/generation-and-cost.md): job safety, cost log, reuse, comparison
- [sound](references/sound.md): sound design questions, mix rules
- [qa-and-evidence](references/qa-and-evidence.md): final check, unknowns, versions
- [recovery](references/recovery.md): symptom, meaning, next action
- [assemble-and-polish](references/assemble-and-polish.md): cut junctions (match cut script), narration, subtitles, model choice, one color grade, pre-publish checks

## Credits

Method ideas drawn from Scenario Agent Skills (MIT), Drama Skills by zenstory-ai (MIT), REA by
morluto (MIT, skill structure only), CozyClay by NomaDamas (AGPL-3.0-or-later, used only as an
external program) and Flagship Scene UI (AGPL-3.0, plan ideas only, tool not used). "Scenario Agent
Skills" is scenario-labs/skills on GitHub. No code or text was copied.





