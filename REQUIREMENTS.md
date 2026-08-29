# QuickMaths Requirements

## Product Goal
- [x] Build a simple mobile-first web app for children to practice arithmetic on a colorful whiteboard-style screen.
- [x] Keep the app static and suitable for GitHub Pages hosting.
- [x] Make the main practice experience feel like an old-school whiteboard.
- [x] Keep the app usable on modern mobile browsers, including Safari.

## Implemented Features

### Practice Flow
- [x] App name: QuickMaths.
- [x] Separate level/options start screen with Candy Crush-style stage path.
- [x] Start action stays as an overlay while the currently active level remains visible.
- [x] Show a session summary with right and missed counts.
- [x] Mobile-first layout with touch and pen support.
- [x] Writing works with one finger or pen only; two-finger gestures do not draw and remain available for browser zoom.
- [x] Practice modes: addition, subtraction, multiplication, and division.
- [x] Planned stages start with tiny one-digit addition before introducing subtraction, within-20 facts, two-digit practice, multiplication, and division.
- [x] One random question shown at a time.
- [x] Old-school stacked question layout with one large question on the whiteboard.
- [x] Operator aligns to the left of the longer number column.
- [x] Dedicated final-answer box on the whiteboard.
- [x] Whiteboard workspace where children can write intermediate working outside the answer box.
- [x] Printed question and answer box are separate from the drawing layer, so erase and clear do not remove them.
- [x] Main Next question button.
- [x] Check answer button.

### Whiteboard Tools
- [x] Pen colors.
- [x] Color controls moved above the writing space.
- [x] Eraser.
- [x] Clear writing with confirmation.
- [x] Undo.
- [x] Circular tool buttons.
- [x] Lucide icon buttons for back, eraser, undo, clear, and feedback.
- [x] Tool buttons moved away from the primary Check/Next action stack.

### Feedback And Timer
- [x] Visible timer for the current question.
- [x] Countdown timer with style cycling: digital, analog, and hourglass.
- [x] Feedback appears below the answer area so the written answer remains visible.
- [x] Confidence review appears when recognition is unsure, with Correct/Wrong buttons.
- [x] Correct feedback has OK and Next on the same row.
- [x] Wrong answer and timeout feedback ask the child to retry.

### Recognition
- [x] No typed answer field; final answers are read from the answer box.
- [x] Local canvas-based digit recognition reads only ink inside the final-answer box.
- [x] Recognition uses canvas pixels so erased/corrected ink is reflected.
- [x] Recognition works without browser handwriting APIs, including Safari.
- [x] Browser handwriting recognition remains optional when available.
- [x] Multiple template styles exist for each digit.
- [x] Expected-answer scoring improves recognition for child handwriting variations.
- [x] Recognition now tries to split wide joined digits and merge over-split strokes before scoring.

### Gamification
- [x] Stars and score.
- [x] Streak reward.
- [x] Locked level progression saved on the device.
- [x] Cheerful colors for children.
- [x] Four-stage-band level plan: Starter, Explorer, Builder, Wizard.

### Accessibility And Compatibility
- [x] Large tap targets.
- [x] Clear labels for controls.
- [x] Works with touch, mouse, or stylus.
- [x] Static files only: HTML, CSS, and JavaScript.
- [x] No backend and no build step required.
- [x] Persist local progress in `localStorage`.
- [x] Runs by opening `index.html` locally and when hosted on GitHub Pages.
- [x] Uses local recognition fallback for Safari and browsers without handwriting APIs.
- [x] Version JavaScript and CSS file references to avoid browser cache issues after updates.
- [x] Include MIT license.

## Known Limitations
- [ ] Local digit recognition is heuristic and cannot guarantee every handwriting style.
- [ ] Multi-digit segmentation can still fail when digits touch or overlap heavily.
- [x] Static smoke test covers layout breakpoints and app wiring.
- [ ] No automated visual regression tests with screenshots yet.
- [ ] No offline install/PWA behavior yet.
- [ ] Progress is device-local only and does not sync across browsers or devices.

## Next Priority Features

### P0: Production Stability
- [x] Add a recognition confidence review state: if the app is unsure, show "I think it says X" with Correct/Wrong buttons for adult-assisted correction.
- [x] Add a small on-device recognition test harness with saved synthetic digit samples for regression checks.
- [x] Add a low-height mobile layout smoke test for 320px, 375px, and 430px wide screens.
- [x] Add static smoke-test script for syntax, layout hooks, drawing policy, asset versions, and level progression.
- [ ] Add browser smoke-test script for interactive drawing, checking, timer cycling, and level navigation.

### P1: Better Learning Experience
- [x] Add Candy Crush-style stage path with progressive unlocks.
- [x] Add operation-specific stage tuning for first addition, subtraction, multiplication, and division progressions.
- [x] Add a session summary with correct count and missed questions.
- [ ] Add full session summary screen with time and stars earned.
- [ ] Add retry missed question flow.
- [ ] Add optional sound effects with mute control.
- [x] Add optional parent reset for local progress.

### P2: Whiteboard Improvements
- [ ] Add pen thickness control.
- [ ] Add answer-box-only clear button.
- [ ] Add full-board clear button separate from answer clear.
- [x] Add visual answer-box highlight while writing inside it.
- [ ] Add left/right handed layout option for controls.

### P3: Install And Share
- [ ] Add PWA manifest and service worker for offline install.
- [ ] Add app icons for home-screen install.
- [ ] Add GitHub Pages deployment instructions with screenshots.
- [ ] Add simple release version constant so CSS/JS cache versions are updated from one place.

## Implementation History
- [x] Create requirements document and commit it.
- [x] Scaffold the static app files and commit them.
- [x] Implement arithmetic generation, levels, whiteboard drawing, timer, checking, and progress.
- [x] Simplify to one main whiteboard with a large stacked question.
- [x] Add license, checklist requirements, and asset versioning.
- [x] Add cross-browser local answer recognition.
- [x] Move levels/options to a start screen.
- [x] Move colors above the writing space.
- [x] Add feedback popup.
- [x] Add timer style cycling.
- [x] Add countdown timer, timeout retry popup, and popup Next flow.
- [x] Rename app to QuickMaths.
- [x] Add planned child-friendly arithmetic stage progression.
- [x] Move feedback below the answer box and restore main Next.
- [x] Restrict drawing to one active touch pointer and allow two-finger browser zoom.
- [x] Add confidence review, session summary, parent reset, and smoke test harness.
- [x] Add visual answer-box highlight while writing inside it.
