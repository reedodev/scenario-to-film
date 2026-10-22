# Shot list, generability and previs critique

## Shot row

`| # | length | camera | scene | sound |` One row per shot. Camera states size, angle, lens or move.
Each shot also carries a one-line intent (what the viewer must feel or learn); a camera choice
without an intent is a defect. One thing to look at after every cut.

For each row also write, below the table: framing intent (extreme close, close, medium, wide), color
role, transition in and out, and whether it is an insert. Pick camera moves and transitions from
[camera-movements](camera-movements.md) and [film-look-and-transitions](film-look-and-transitions.md).
Write exit and entry poses in adjacent rows when a whip pan, match cut or cut on action is used.
The lint script reads only the five table columns; this extra information stays in notes.

Run `node scripts/lint-shots.mjs shots.md --max-seconds <limit>` after writing. It checks the table
format, that every row has camera and sound, that the lengths do not add up to more than the limit (a shorter total passes;
the limit is for the whole film) and that no shot is longer than 10 s. It checks the document only, not the video.

## Beats

Number every beat, one fact per line, and mark each added beat with why it was added. Every beat
must be visible in some shot or thumbnail; a beat that exists only in the intent text is missing.
Check logistics: the distance a character covers must fit the time the cut gives them. For a first
cut budget about 1.6 to 1.9 seconds per beat (a rule of thumb, adjust after seeing the animatic).

## Generability check (AI video)

Prefer common, whole-body, single-limb actions: walk in, sit, stand, turn, nod, hand over, take,
hug, push a door, put something down, turn a page, reach. If you cannot mime the action to a
stranger without explaining it first, the model will probably fail it.

Rewrite these four high-risk patterns:

| Risk | Example | Rewrite |
|---|---|---|
| Precise interception | blocking a closing book with the palm | close the book, hand rests on the lid |
| Invisible inner state | "seems to hear something" | brow tightens, head turns to the door |
| Negated action | "does not answer" | looks away and keeps walking |
| Fine choreography | three or more hand steps, left and right hands | split into adjacent shots |

Rewrite in this order and take the first that works: let an object or the environment carry the
change; split into "before" and "result" shots; replace with a hold; give it to sound; if nothing
works, mark the shot high risk and write a fallback. Never change the drama to fit the model.

## Only meaningful moves

Animate only camera moves that carry meaning; every other shot is a locked frame. Keep the hero
unblocked, keep extremes (tallest pose, widest travel) inside a locked frame, and check that a pose
built from the front still reads from a high angle.

## Report what could not be judged

Write down what a previs cannot show (comic timing with sound, mood with an audience) instead of
calling the whole shot list passed.


## When two people must meet in one picture

One person per shot is the default because two people in one generated shot fail more often.
When the story needs them together, try in this order: an over-the-shoulder frame (one face
visible, the other as a shoulder and back), a shared object in the foreground with one person
behind it, a reflection, or a two-shot kept very short with a locked camera. Plan a spare take
and say in the notes that this shot is the risky one.
