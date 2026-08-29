# MathSprout Requirements

## Product Goal
- [x] Build a simple mobile-first web app for children to practice arithmetic on a colorful whiteboard-style screen.
- [x] Keep the app static and suitable for GitHub Pages hosting.
- [x] Make the main practice experience feel like an old-school whiteboard.
- [x] Keep the app usable on modern mobile browsers, including Safari.

## Implemented Features

### Practice Flow
- [x] App name: MathSprout.
- [x] Separate level/options start screen with Candy Crush-style stage path.
- [x] Mobile-first layout with touch and pen support.
- [x] Practice modes: addition, subtraction, multiplication, and division.
- [x] Difficulty levels: Starter, Explorer, and Wizard.
- [x] One random question shown at a time.
- [x] Old-school stacked question layout with one large question on the whiteboard.
- [x] Operator aligns to the left of the longer number column.
- [x] Dedicated final-answer box on the whiteboard.
- [x] Whiteboard workspace where children can write intermediate working outside the answer box.
- [x] Printed question and answer box are separate from the drawing layer, so erase and clear do not remove them.
- [x] Next question button.
- [x] Check answer button.

### Whiteboard Tools
- [x] Pen colors.
- [x] Color controls moved above the writing space.
- [x] Eraser.
- [x] Clear writing with confirmation.
- [x] Undo.
- [x] Circular tool buttons.
- [x] Lucide icon buttons for back, eraser, undo, clear, and feedback.

### Feedback And Timer
- [x] Visible timer for the current question.
- [x] Countdown timer with style cycling: digital, analog, and hourglass.
- [x] Feedback popup after checking: correct answer has OK and Next; wrong answer and timeout ask the child to retry.

### Recognition
- [x] No typed answer field; final answers are read from the answer box.
- [x] Local canvas-based digit recognition reads only ink inside the final-answer box.
- [x] Recognition uses canvas pixels so erased/corrected ink is reflected.
- [x] Recognition works without browser handwriting APIs, including Safari.
- [x] Browser handwriting recognition remains optional when available.
- [x] Multiple template styles exist for each digit.
- [x] Expected-answer scoring improves recognition for child handwriting variations.

### Gamification
- [x] Stars and score.
- [x] Streak reward.
- [x] Locked level progression saved on the device.
- [x] Cheerful colors for children.

### Accessibility And Compatibility
- [x] Large tap targets.
- [x] Clear labels for controls.
- [x] Works with touch, mouse, or stylus.
- [x] Static files only: HTML, CSS, and JavaScript.
- [x] No backend and no build step required.
- [x] Persist local progress in `localStorage`.
- [x] Runs by opening `index.html` locally and when hosted on GitHub Pages.
- [x] Avoid external dependencies for reliability.
- [x] Version JavaScript and CSS file references to avoid browser cache issues after updates.
- [x] Include MIT license.

## Known Limitations
- [ ] Local digit recognition is heuristic and cannot guarantee every handwriting style.
- [ ] Multi-digit segmentation can still fail when digits touch or overlap heavily.
- [ ] No automated visual regression tests yet.
- [ ] No offline install/PWA behavior yet.
- [ ] Progress is device-local only and does not sync across browsers or devices.

## Next Priority Features

### P0: Production Stability
- [ ] Add a recognition confidence review state: if the app is unsure, show "I think it says X" with Correct/Wrong buttons for adult-assisted correction.
- [ ] Add a small on-device recognition test harness with saved synthetic digit samples for regression checks.
- [x] Improve recognition with multi-template digit scoring and expected-answer validation.
- [ ] Improve digit segmentation for touching digits and wide handwritten `1`, `2`, `4`, and `7` styles.
- [ ] Add a low-height mobile layout pass for small phones so answer box, controls, and question never collide.
- [ ] Add a simple browser smoke-test script for layout and syntax validation.

### P1: Better Learning Experience
- [x] Add Candy Crush-style stage path with progressive unlocks.
- [ ] Add a session summary screen with correct count, missed questions, time, and stars earned.
- [ ] Add retry missed question flow.
- [ ] Add operation-specific difficulty tuning: carrying, borrowing, times tables, and exact division sets.
- [ ] Add optional sound effects with mute control.

### P2: Whiteboard Improvements
- [ ] Add pen thickness control.
- [ ] Add answer-box-only clear button.
- [ ] Add full-board clear button separate from answer clear.
- [ ] Add visual answer-box highlight while writing inside it.
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

