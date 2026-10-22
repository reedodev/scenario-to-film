# Assemble and polish: lessons from the first finished film

Field notes from one 68-second film (11 clips). Each item says what went wrong, why (when
confirmed), and what to do. Treat them as defaults to check, not laws.

## 1. Cut junctions

| Situation | Symptom seen | Do this |
|---|---|---|
| Two clips show nearly the same person, pose and place (one was generated from a frame of the other) | A slow dissolve shows two faces half-overlapping ("ghosting") | Do not dissolve. Hard-cut at the most similar frame pair (`scripts/best-match-cut.py`). |
| End of clip A is frozen to make room for a dissolve | The held smile looks like a playback stall | Never hold a last frame longer than ~0.2 s. Overlap two moving clips instead, or cut. |
| Same place, different framing, a time skip is meant (asleep to awake) | Dissolve looks like a mistake | Short dip to black (about 0.8 s in all: a 0.375 s fade out of the last frames, then a 0.45 s fade in) reads as a blink. |
| A cut removes frames after a junction | Everything later shifts, subtitles and sound drift | Recompute every later clip start. Move sound that came from the clip by the same amount. |

Run the match-cut script before choosing a transition. It prints the ratio between the best
pair's difference and the clip's own frame-to-frame difference. Provisional thresholds from one
film: about 6x cut cleanly, about 50x was an unrelated shot. Under 10x, try the hard cut (the one real case that cut cleanly was 6x); 10-25x look by eye and
compare with a dip to black; over 25x use a dip to black or restage the shot.

## 2. Narration

- A script that tells what the picture already shows is too wordy. Eleven lines became six,
  then eight when the user asked for one missing story beat. Fewer lines, each one carrying
  something the picture cannot.
- Synthesize all lines of one voice in one pass, then split at silences. Separate takes per
  line change the voice from line to line.
- Check every line ends on a real sound ending (not chopped), and transcribe the finished mix
  to confirm the words. Transcription is not listening: say so in the report.
- A name or place can be misheard by the transcriber (Seoul as Soul). Mark it as "listen here".
- Do not use the user's own cloned voice unless they ask for it in this task.
- When one line changes late, re-synthesize that line **and its neighbour from the same pass** so the
  voice stays the same, then re-time subtitles and every sound placed after it. (In the first film one sentence
  changed after the mix was done, and the changed line and its neighbour were re-made together in
  one pass. Whether re-making only the one line would have changed the voice was not tested.)

## 3. Subtitles

Word-by-word reveal is busy for a quiet short film. A whole-line fade (about 0.6 s) with one
accent-colored key word is calmer. Show subtitles only where a line is spoken.

## 4. Picking the generation model

The default model of a platform can be its cheapest. Open the model list before generating.
Test one important shot with the better model first (same references, same prompt) and compare
frame sheets side by side. Report cost per second for both. The better model in one test kept
the face identical across frames and followed the place named in the prompt; the cheaper one
drifted the face and ignored the place three times. It also cost about six times more.

## 5. Reference image quirks (observed on one platform, check yours)

- Very tall reference images were rejected. Pad full-body sheets to a normal ratio.
- Anything visible in a reference leaks into the result (earphones, freckles, background).
  Name what must not appear in the prompt, and crop the reference to the face when the
  background keeps coming back.
- A prompt that says "open overpass" was ignored when the reference showed a platform. If the
  place matters, use a reference of that place.

## 6. Look: one grade over all clips

A single color pass makes separately generated clips read as one film.

- Teal in shadows, warm in highlights (colorbalance), medium-contrast curve, slight bloom,
  vignette and fine grain. Optional letterbox bars (2.39:1).
- Bloom blend must run in an RGB pixel format (for example `format=gbrp` before the split),
  otherwise the screen blend tints the picture magenta.
- Dark scenes get a limited shadow lift over their time range, or faces vanish.
- Apply grade first, subtitles and titles after, so text stays clean.
- Render three candidate stills (different looks) from the same frames and compare before
  grading the whole film.

## 7. Before publishing (only after the user approves publishing)

This skill never publishes. When the user has approved it, the checks that were missed or
needed once: required hashtags and platform account tags from the contest rules, a custom
thumbnail that does not cover the face, AI-generated label on, correct channel active in the
account switcher (switch back afterward), and a pinned comment verified after reload.

When you enter a contest or a creator program:

- Read the entry rules on the live page and write each requirement into `unknowns.md` or the QA
  table: minimum length, resolution, who must have generated the footage, required hashtag,
  which official account to tag on each platform, public visibility, deadline and its time zone.
- Many forms ask you to select the generated clips you used. Select every clip that is in the
  final film (the first film used 11 of them) and check the count on the confirmation screen.
- The submitted link must be a public post. Open it logged out, or from another browser, before
  you submit.
- Some programs ask you not to mention other AI services in the post. A requirement that is a
  recommendation, not a rule, is still worth following if it costs you nothing; if you choose not
  to, say so and accept that the post may not count.
- A bonus that needs contacting the organizers is the owner's decision. Do not contact anyone
  unless the owner asks you to.



