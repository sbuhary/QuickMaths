# QuickMaths

QuickMaths is a mobile-first arithmetic practice app for children. It runs as a static website and can be hosted directly on GitHub Pages.

## Features
- Lucide-style icons for whiteboard controls. Icons are rendered from a local script so Safari and file URLs do not depend on a CDN.
- Addition, subtraction, multiplication, and division.
- Easy, Medium, and Difficult entry choices. The selected difficulty is remembered on the device.
- Research-informed stage plan that starts with very small one-digit addition before moving into subtraction, within-20 facts, two-digit practice, multiplication, and division.
- Writable whiteboard with pen colors, pen thickness, eraser, undo, pencil/eraser cursors, and one confirmed whole-board clear. Writing uses one finger or pen; two-finger gestures stay available for browser zoom.
- A dedicated final-answer box, while the rest of the board remains open for working. The box highlights while writing inside it.
- Countdown timer per question. Tap the timer to cycle between digital, analog, and hourglass styles. Correct feedback explains remaining time in child-friendly words.
- Optional sound effects with a mute toggle.
- State-aware bottom actions: Check while answering, Try again after a wrong answer or timeout, and Next after a correct answer.
- Required `Your name` field for personalized greetings and feedback, with a prompt for older saved users who do not have a name yet.
- Animated celebration when an answer is correct, with achievement popups for star milestones and newly unlocked stages.
- Streak-freeze points are earned from continuous correct answers, capped at 3, and automatically protect the current streak after a miss.
- Low-confidence handwriting review shows tappable answer choices, including the correct answer and nearby values, so the child can choose what they meant.
- Full session summary with practice time and stars earned, retry missed questions, and parent reset for local progress.
- Written-answer checking from per-digit answer boxes using a browser-only ONNX Runtime MNIST model, conservative local stroke/canvas checks, and browser handwriting recognition as an optional fallback. Ambiguous reads ask the child to choose.
- Brighter Candy Crush-style vertical stage path with stars, streaks, visible lock icons, last-screen restore, and help buttons on the main screens. Stages unlock after earning enough stars in the current stage.
- Brief QuickMaths splash on app load, plus PWA metadata, app icon, and service worker for installable/offline-friendly use after first hosted load.


## Project Structure
- `index.html`, `manifest.webmanifest`, and `sw.js` stay at the repository root for GitHub Pages and service-worker scope.
- `assets/js/` contains app scripts, icon rendering, and the release version constant.
- `assets/css/` contains the app stylesheet.
- `assets/icons/` and `assets/backgrounds/` contain visual assets.
- `assets/models/` contains the browser ONNX digit model used for handwritten answer recognition.
- `tests/` contains smoke tests, Playwright coverage, fixtures, support helpers, and snapshots.
## Level Plan
1. Tiny sums: addition with totals up to 5.
2. Facts to 10: one-digit addition with totals up to 10.
3. Take away: simple subtraction within 10.
4. Add or subtract: mixed addition and subtraction within 10.
5. Teen sums: addition with totals up to 20.
6. Teen subtraction: subtraction within 20.
7. Two-digit plus ones: place-value friendly addition.
8. Two-digit take away: place-value friendly subtraction.
9. Times 2, 5, 10: first multiplication facts.
10. Small times tables: multiplication up to 6 x 6.
11. Exact sharing: division from known small facts.
12. Mixed challenge: multiplication and division review.

## Run Locally
Open `index.html` in a browser.

## Test
- `npm test` runs static smoke checks.
- `npm run test:browser` runs interactive browser smoke checks.
- `npm run test:e2e:mobile` runs the Mobile Chrome and Mobile Safari Playwright checks used for mobile-first changes.

## Host On GitHub Pages
1. Push this repository to GitHub.
2. In the repository settings, open Pages.
3. Set the source to the default branch and root folder.
4. Save and open the published Pages URL.

See `docs/GITHUB_PAGES.md` for the deployment guide and `docs/REQUIREMENTS.md` for the feature checklist.
