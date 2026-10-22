# QA and evidence

Check the delivered file, not the project. Separate what was seen or heard, what was measured and
what was not checked.

## QA table (item, how checked, then three evidence columns)

| Item | How checked | Seen / heard | Measured | Not checked |
|---|---|---|---|---|

Rows: length and cut points; coverage of the shot list; dialogue (every line, against the
script); boundary frames before and after each cut (flash, break, drift); sound seams and dialogue
clarity; loudness of the encoded file; subtitles (exact words, timing, size, line breaks); text
inside the picture; ratio and frame rate (probe the file); color across cuts; identity and eye-line
across cuts.

Before a video exists, write "not yet (no video)" in the Seen / heard column instead of leaving
it empty or filling it from the plan.

A clean decode, a successful render, a transcript or a loudness number does not prove the cut
looks good or the voice is clear. Do not claim a listen or a view that did not happen.

## Measuring the delivered file

Run these on the final encoded file and paste the numbers into the Measured column:

```
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of default=nw=1 final.mp4
ffmpeg -hide_banner -nostats -i final.mp4 -af ebur128=peak=true -f null -
ffmpeg -hide_banner -i final.mp4 -vf blackdetect=d=0.05:pix_th=0.10 -an -f null -
ffmpeg -ss 12.0 -i final.mp4 -frames:v 1 frame_at_cut.png
```

The first gives length, size and frame rate; the second the integrated loudness and true peak;
the third lists black stretches (a short black tail may be reported one frame shorter than you
made it); the fourth saves one frame so you can look at a cut. Look at frames just before and
after every cut, not only at the cut itself. A measurement shows the tool works on this file, it
does not show the story works.

## Subtitles

Burned-in subtitles stay out of the platform's caption and button zones: bottom of the text at
least about 24 percent above the bottom edge on landscape (a default; check the platform you
publish on). Vertical safe zones differ by platform: find the platform's current rule and write
it in the QA table. Check sampled frames of the actual output.

## Color

One color pass over all clips is the default. If the story needs one deliberately different shot
(a single cold shot in a warm film), keep that one shot as a recorded exception.

## Unknowns

Keep `unknowns.md` next to the QA table. Format: one row per question: `question | evidence that would
settle it | who or what holds it | status (open / resolved + what was observed)`. Each unresolved question gets: the question, what evidence would settle it,
who or what holds that evidence. Mark it resolved only from something observed (a rule text, a
test result), never from assumption. Examples: whether a contest accepts an externally made first
frame; whether the video model's audio is usable.

## Versions

Write the tool versions a result was tested with (CozyClay, Blender, video model name) in the QA
table. The installed tool's real schema and UI win over this document.

## Delivery

Deliver the final video, the shot list, the previs, the cost log, the QA table and `unknowns.md`.
State which requirements are met, which gaps remain and why anything could not be measured.
Keep the platform's AI label and any contest disclosure.





