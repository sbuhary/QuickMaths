# QuickMaths

QuickMaths is a mobile-first arithmetic practice app for children. It runs as a static website and can be hosted directly on GitHub Pages.

## Features
- Lucide-style icons for whiteboard controls. Icons are rendered from a local script so Safari and file URLs do not depend on a CDN.
- Addition, subtraction, multiplication, and division.
- Research-informed stage plan that starts with very small one-digit addition before moving into subtraction, within-20 facts, two-digit practice, multiplication, and division.
- Writable whiteboard with pen colors, pen thickness, eraser, undo, and one confirmed whole-board clear. Writing uses one finger or pen; two-finger gestures stay available for browser zoom.
- A dedicated final-answer box, while the rest of the board remains open for working. The box highlights while writing inside it.
- Countdown timer per question. Tap the timer to cycle between digital, analog, and hourglass styles.
- Optional sound effects with a mute toggle.
- State-aware bottom actions: Check while answering, Try again after a wrong answer or timeout, and Next after a correct answer.
- Confidence review when handwriting recognition is unsure, so an adult can mark the read as correct or wrong.
- Full session summary with practice time and stars earned, retry missed questions, and parent reset for local progress.
- Written-answer checking from the answer box using local canvas-based digit recognition, with browser handwriting recognition as an optional fallback. Joined digits are split using low-ink valleys before scoring.
- Candy Crush-style level path with stars, streaks, locked progression, and last-screen restore saved on the device.
- Brief QuickMaths splash on app load, plus PWA metadata, app icon, and service worker for installable/offline-friendly use after first hosted load.

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

## Host On GitHub Pages
1. Push this repository to GitHub.
2. In the repository settings, open Pages.
3. Set the source to the default branch and root folder.
4. Save and open the published Pages URL.

See `docs/GITHUB_PAGES.md` for the deployment guide and official screenshot references.
