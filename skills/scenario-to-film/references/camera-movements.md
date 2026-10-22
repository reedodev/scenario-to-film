# Camera movements (library and prompt wording)

A move must be motivated: it should express a feeling or reveal information. If you cannot say
why the camera moves, lock it off. Test one move per clip in AI video; stacking several moves
in one short clip produces conflicting instructions.

## Prompt pattern (works across Kling, Seedance, Higgsfield, Runway and similar)

`<move name>. Movement: <what the camera physically does>. Speed: <pace>. Framing: <what stays
consistent, what enters>. End: <the final composition>.`

Add: subject, setting, lens feeling, light, and a constraint such as "stable geometry, no warping,
consistent face, no text artifacts". Keep the camera instruction separate from the scene so the
block can be reused when the first frame changes. A long take is hard for AI video: split a
complex move into short motivated segments and cut them together.

## Library (44 moves, grouped; condensed from a 46-move source list)

| Group | Moves | Story use | AI risk |
|---|---|---|---|
| Still | static / locked-off | calm, product clarity, isolation | lowest |
| Pan, tilt | pan left/right, tilt up/down | show geography, scale, power | low |
| Whip | whip pan left/right | fast change of attention, transition | blur hides cut; match direction |
| Zoom | slow zoom in/out, fast zoom, crash zoom, infinite zoom, earth zoom out | focus, shock, scale gag | zoom changes lens, not position; can warp |
| Dolly / truck | dolly in/out, truck left/right, pedestal up/down, slider left/right | intimacy (in), reveal (out), small parallax | low-medium |
| Pass-by | push past a foreground object, pass through objects | depth, entering a space | warping at the object |
| Arc / orbit | arc left/right, orbit clockwise/counter | show a subject's shape, tension | face drift on long orbit |
| Tracking | tracking, follow/over-the-shoulder, reverse tracking, side tracking, low tracking, vehicle tracking, chase | energy, journey, follow a person | legs and feet glitches |
| Human | handheld, body-mounted (Snorricam) | realism, panic, subjectivity | medium |
| Air | crane up/down, drone push in/pull back, helicopter | reveal environment, ending lift | low |
| POV and specials | first-person view, tilt-shift, time-lapse | subjectivity, scale, time passing | medium |

## Choosing a move

| Feeling | Move |
|---|---|
| intimacy, importance | slow dolly in |
| reveal, loneliness | dolly out, crane up |
| energy, travel | tracking, side tracking, low tracking |
| panic, realism | handheld, chase |
| surprise, comedy | crash zoom, whip pan |
| elegance, product | locked-off, slider, orbit |
| time passing | time-lapse, crane up into dawn |

## Example vocabulary (a short film about a student on a late train)

Locked wide (isolation), trailing track behind the student (urgency), wide from platform end
with the train arriving (tension), close-up on doors (comic beat), medium in the cab with a slow
hold (decision), slow dolly through the car (relief), slow push-in (emotion), crane or light
change to dawn (release). Use the same vocabulary in the previs and in the video prompts.

## Sources

- aicameramovements.com: 46-move library with a prompt for each (the site's links to a partner
  generator are affiliate links; do not use them).
- aeliavision.com/camera-movement-guide: 15 cinematic moves with motivation and prompt formula.
- seedance.tv blog (35 Seedance camera prompts), seeddance.io blog, seedance-2.app camera guide.
- MasterClass guide to camera moves (13 types).
See [sources](sources.md) for addresses and when each was read.


