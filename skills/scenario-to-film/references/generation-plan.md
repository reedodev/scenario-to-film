# Generation plan (step 5)

The plan is a data file the user approves at gate 2. It is separate from the shot list: the shot
list is the story, the plan is what will actually be sent to the video model. Fill
`assets/plan-template.json`, then run `node scripts/validate-plan.mjs plan.json`. The validator
checks the file's structure only; it cannot tell whether a clip will look right.

## Structure

- `settings`: model, resolution, aspect, seed policy, shared prompt. Keep the user's approved
  values exactly; never overwrite them with recommendations.
- `scenes[]`: `id`, `name`, `prompt` (static things only: place, light, mood), `continue_previous`
  (does the first clip inherit the end of the previous scene), `references`.
- `clips[]` in run order: `scene_id`, `prompt`, `seconds`, `mode` (I2V first-frame, R2V reference,
  T2V text), `seed`, `first_image`, `last_image`, `references`, `refiner`.

## When to start a new scene

A new place, time, camera setup or main action starts a new scene. A continuous action stays in
one scene. A new scene starts fresh (`continue_previous: false`) unless it truly continues the
previous clip's pose and light; a fresh start does not remember faces, so reconnect the cast
references. Do not split a scene only because it has many clips. Do not return to an earlier
scene; plan a flashback as its own scene.

## Prompt layers (stop leaks)

Final text is shared prompt + scene prompt + clip prompt.

- Shared: a short, static look (grain, color temperature). Leave empty if the user has none.
- Scene: static space, light, mood. Never put events in order, a cast list, dialogue, the next
  clip's action or one clip's camera move here; they leak into every clip.
- Clip: who appears, which references, action, eye line, camera move, dialogue, sound, start and
  end state. Name only the people needed in this clip.
- Keep the full cast table (names, wardrobe, speaker numbers) in your own notes, not in the prompt.

## Reference mapping

Reference tags (`@picture_1` style) belong in the clip that needs them. Map by scene + tag + real
file, because the same number can mean a different file in another scene. Look at every reference
image yourself; never infer who is in it from the filename. Mark unseen files as unverified.
Limits to respect: about nine images, three videos, three audio files per generation (check the
current model). State each video reference's role (camera path, background, or person).

## Fresh start and continuing clips

- Fresh clip: re-establish people, place, framing and light. An image-to-video fresh clip needs
  its own first image. Do not say it continues from the last frame of the previous scene.
- Continuing clip: connect the previous clip's end pose, position, eye line, prop, camera and
  light to this clip's start. If the incoming frame already shows the right face and clothes, say
  "the same person already visible" instead of redescribing them at every boundary.
- Never write the next clip's reveal or turn into the current clip.

## Length

`seconds` is the target length to add. Many models trim an overlap or snap to a frame grid, so
the delivered length can differ. Record target, generated length and final length separately in
the cost log. Prompt times are local to each clip and start at 0. Put essential dialogue after
the first overlap moment of a continuing clip. Starting points when unspecified: about 8 s for a
fresh clip, about 7 s for a continuing one, adjusted to dialogue and action. Keep the user's
approved lengths.

## Dialogue and sound

One speaker at a time with a short gap before the reply; the listener does not move their mouth.
A clip with no dialogue states that no one speaks (humming or laughs only if wanted). A prompt
cannot guarantee a model will not speak. A voice LoRA or reference voice applies only if loaded.

## Refiner or quality pass

Per clip, explicit `on` or `off`, default `off`. Use `off` for a fresh scene start, big framing or
light change, fast action, face close-ups and unverified results. If `on`, reference an already
generated earlier clip in the same scene, weak strength first. It is a texture correction, not
face repair or dialogue repair.

## Regenerating one clip

Regenerate only the selected clip; keep the old result in history so versions can be compared.
Clips that depend on it may be stale; they are not regenerated automatically. Whether the new
clip still matches the next one must be checked by eye at the join. A scene change stops the
dependency only if the next scene starts fresh.

## Checks before gate 2 (text only)

1. File parses; scene ids unique; every clip points to an existing scene; scenes in order.
2. Approved scene count, clip count, order, dialogue, lengths and settings unchanged.
3. References in prompts exist in that scene's list; no unregistered numbers; no cast leak.
4. Fresh clips have first images when the mode needs them.
5. Refiner set per clip.
6. Say clearly that this check is about the document. Faces, lip sync and continuity are only
   checked after generation, on the actual clips.

## Assembly

Join clips inside a scene as generated, then join finished scenes with a stream-copy edit (ffmpeg).
No automatic cross-fade is generated at scene boundaries; add transitions in the edit, following
[film-look-and-transitions](film-look-and-transitions.md). Audio may need re-encoding to align.

## Plan file fields (assets/plan-template.json)

| Field | Meaning |
|---|---|
| `settings.model`, `resolution`, `aspect` | What the user approved at gate 2. |
| `settings.shared_prompt` | Short, static look shared by every clip. Empty is fine. |
| `settings.seed_policy` | How seeds are chosen; the actual seed goes in the cost log. |
| `sequence_mode` | `true` when clips are generated one after another in scene order. |
| `scenes[].continue_previous` | `true` only if this scene continues the previous clip's pose and light. |
| `scenes[].references.images/videos/audios` | Files for this scene. The order is the numbering: `@picture_1` is the first image in this list, `@picture_2` the second. Numbering restarts in every scene. |
| `clips[].mode` | `I2V` (first image), `R2V` (references) or `T2V` (text only). |
| `clips[].seconds` | Target length, 3-15. Plan a 2 s shot as a 3 s clip and trim it in the edit; then the plan total is longer than the shot list. |
| `clips[].first_image`, `last_image` | Start and optional end frame. A fresh `I2V` clip needs a first image. |
| `clips[].use_common_references` | `true` to inherit the scene's reference list. |
| `clips[].refiner` | `mode: off` by default. `reference_clip` is the 1-based index of an earlier clip to refine from; use `0` when mode is `off`. |

One shot is normally one clip. If the same framing returns at the end (the first and last shot
are the same close-up), split the scene in two, because the plan may not return to an earlier
scene.

## Writing gen-plan.md (gate 2)

Use `assets/gen-plan-template.md`: one row per clip with model, resolution, seconds, takes and
credits. Mark every price as "measured from the account" or "estimated"; unknown stays unknown.
The user approves this table before anything paid runs.
