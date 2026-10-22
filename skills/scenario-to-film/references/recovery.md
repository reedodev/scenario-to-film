# Recovery

Read this only after an observed problem. Name the symptom, apply the matching action, then go
back to the step you were on. Do not rerun the whole setup for every problem.

| Observation | Meaning | Next action |
|---|---|---|
| `npx cozyclay` fails with a prefix error or path error | npm config (`.npmrc` prefix) blocks npx | Clone the source, `npm install`, then `npm run dev` |
| CozyClay reports live tools unavailable, `jpeg-js` missing | one dependency absent | `npm install jpeg-js --no-save`, restart |
| Second CozyClay program does nothing visible | port 5184 already owned by another hub | give it its own `COZYCLAY_LIVE_PORT` |
| `UNCERTAIN_APPLY` | the edit may or may not have landed | inspect the scene; do not repeat the edit; use the receipt to undo |
| Generation page shows nothing or times out | job state unknown | check the job list first; never resend unchanged |
| Characters differ between shots | identity not fixed | rebuild the reference still, reuse the same cast words, shorten the shot |
| A shot fails twice | the action is too hard | simplify or cut it (see generability) |
| Voice ends mid-syllable | cut-off ending | re-synthesize with a short trailing word and cut at the pause, or fade where the sound really ends; check the last word |
| The generated clip has no sound for an action (a door opens silently) or an effect is missing (no steam) | video models often leave small effects out | add the sound in the edit; simplify the prompt, add the effect as an overlay, or cut it |
| Music masks speech | mix balance | lower music, duck under speech, measure the encoded file |
| Contest rule is unclear | unknown | add to `unknowns.md`, ask the user, do not guess or contact the organizer |
| Credits run low | cost unknown | stop, report measured versus estimated, ask before spending more |

