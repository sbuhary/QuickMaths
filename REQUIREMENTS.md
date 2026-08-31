# QuickMaths Requirements

## Product Goal
- [x] Build a simple mobile-first web app for children to practice arithmetic on a colorful whiteboard-style screen.
- [x] Keep the app static and suitable for GitHub Pages hosting.
- [x] Make the main practice experience feel like an old-school whiteboard.
- [x] Keep the app usable on modern mobile browsers, including Safari.

## Implemented Features

### Practice Flow
- [x] App name: QuickMaths.
- [x] Brief QuickMaths greeting splash appears on app load before restoring the last screen.
- [x] Require and save a child name for personalized messages.
- [x] Prompt older saved users for a name before practice when no name exists.
- [x] Practice screen header removes the app name and uses compact game-style score icons.
- [x] Separate level/options start screen with a Candy Crush-style vertical scrolling stage path.
- [x] Remember the last screen and restore it after refresh.
- [x] Full-screen scrollable level picker with floating Start, Retry, and Reset controls.
- [x] Start action stays as an overlay while the currently active level remains visible.
- [x] Show a session summary with right and missed counts.
- [x] Show full session details with practice time and stars earned.
- [x] Mobile-first layout with touch and pen support.
- [x] Writing works with one finger or pen only; two-finger gestures do not draw and remain available for browser zoom.
- [x] Practice modes: addition, subtraction, multiplication, and division.
- [x] Planned stages start with tiny one-digit addition before introducing subtraction, within-20 facts, two-digit practice, multiplication, and division.
- [x] Easy, Medium, and Difficult choices start children at stages 1, 5, and 9.
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
- [x] Pencil button opens pen colors and thickness instead of keeping colors always visible.
- [x] Color controls moved above the writing space.
- [x] Eraser.
- [x] Clear writing with confirmation.
- [x] Undo.
- [x] Circular tool buttons.
- [x] Lucide icon buttons for back, eraser, undo, clear, and feedback.
- [x] Local icon renderer avoids CDN/CORS issues in Safari and file URLs.
- [x] Tool buttons moved away from the primary Check/Next action stack.
- [x] Whiteboard tools are grouped in a top floating toolbar in a logical order.
- [x] Remove duplicate-looking answer clear; keep one confirmed whole-board clear.
- [x] Add pen thickness controls.
- [x] Remove left/right handed layout toggle to reduce toolbar clutter.

### Feedback And Timer
- [x] Visible timer for the current question.
- [x] Countdown timer with style cycling: digital, analog, and hourglass.
- [x] Feedback appears below the answer area so the written answer remains visible.
- [x] Low-confidence recognition shows tappable answer choices, including the correct answer and nearby values.
- [x] Feedback is inline on the board instead of a popup/overlay.
- [x] Correct answers trigger animated celebration.
- [x] Correct feedback explains remaining time in child-friendly words on a separate line.
- [x] Star milestone popups celebrate when children reach set star totals.
- [x] Newly unlocked stages are announced with a celebration popup.
- [x] Wrong answer and timeout feedback ask the child to retry without showing Next.
- [x] Bottom action area shows only the needed full-width action for the current state.

### Recognition
- [x] No typed answer field; final answers are read from the answer box.
- [x] Local canvas-based digit recognition reads only ink inside the final-answer box.
- [x] Recognition uses canvas pixels so erased/corrected ink is reflected.
- [x] Recognition works without browser handwriting APIs, including Safari.
- [x] Browser handwriting recognition remains optional when available.
- [x] Multiple template styles exist for each digit.
- [x] Expected-answer scoring is conservative so wrong handwriting is not accepted as correct too easily.
- [x] Recognition now tries to split wide joined digits using low-ink valleys and merge over-split strokes before scoring.
- [x] Ambiguous digit reads lower confidence and route to answer choices instead of marking too quickly.
- [x] Recognition routes close expected/read disagreements to review instead of confidently marking them wrong.
- [x] Recognition combines template matching with structural digit features before accepting an answer.
- [x] Recognition uses stroke-geometry evidence for clear handwritten digit shapes.

### Gamification
- [x] Stars and score displayed with game-style icons.
- [x] Streak reward.
- [x] Locked level progression saved on the device.
- [x] Selected difficulty is remembered on the device.
- [x] Stage unlocks require stars earned in the current stage: 50 for Starter, 75 for Explorer, and 100 for Builder/Wizard.
- [x] Children are told immediately when the next stage unlocks.
- [x] Disabled levels show a lock icon.
- [x] Cheerful colors for children.
- [x] Four-stage-band level plan: Starter, Explorer, Builder, Wizard.

### Accessibility And Compatibility
- [x] Large tap targets.
- [x] Clear labels for controls.
- [x] Help buttons on the level screen and practice screen explain how to play.
- [x] Works with touch, mouse, or stylus.
- [x] Static files only: HTML, CSS, and JavaScript.
- [x] No backend and no build step required.
- [x] Persist local progress and last screen in `localStorage`.
- [x] Runs by opening `index.html` locally and when hosted on GitHub Pages.
- [x] Uses local recognition fallback for Safari and browsers without handwriting APIs.
- [x] Version JavaScript and CSS file references to avoid browser cache issues after updates.
- [x] Version the local icon JavaScript file too.
- [x] Include MIT license.
- [x] Add PWA manifest, service worker, and app icon metadata.
- [x] Add release version constant checked against CSS/JS cache versions.

## Known Limitations
- [ ] Local digit recognition is heuristic and cannot guarantee every handwriting style.
- [ ] Multi-digit segmentation can still fail when digits touch or overlap heavily.
- [x] Static smoke test covers layout breakpoints and app wiring.
- [x] Automated Playwright visual regression test covers the mobile board UI.
- [x] Dedicated mobile Playwright command covers Mobile Chrome and Mobile Safari.
- [x] PWA install/offline app-shell behavior is available after first hosted load.
- [ ] Progress is device-local only and does not sync across browsers or devices.

## Next Priority Features

### P0: Recognition Upgrade
- [x] Add client-side TensorFlow.js placeholder recognizer using `tf.loadLayersModel('./model/model.json')` with local fallback.
- [x] Add a real browser-loaded TensorFlow.js MNIST digit model for client-side recognition.
- [ ] Add a labeled in-app handwriting sample set for digits 0-9 from real child/parent writing styles.
- [x] Use model confidence plus the current rule-based guard before awarding stars, so wrong answers are not accepted only because the model guessed.


### P0: Production Stability
- [x] Add deterministic Playwright visual regression coverage for the mobile board.
- [x] Improve joined multi-digit answer splitting before recognition scoring.
- [x] Reduce false correct/wrong recognition by tightening expected-answer bias and confidence thresholds.
- [x] Add a recognition confidence review state: if the app is unsure, show answer-choice boxes with the correct answer and nearby values.
- [x] Add a small on-device recognition test harness with saved synthetic digit samples for regression checks.
- [x] Add a low-height mobile layout smoke test for 320px, 375px, and 430px wide screens.
- [x] Add static smoke-test script for syntax, layout hooks, drawing policy, asset versions, and level progression.
- [x] Add optional browser smoke-test script for interactive drawing, checking, timer cycling, and level navigation.

### P1: Better Learning Experience
- [x] Add Candy Crush-style vertical scrolling stage path with progressive unlocks.
- [x] Add stage-star unlock requirements and remembered Easy/Medium/Difficult entry points.
- [x] Add operation-specific stage tuning for first addition, subtraction, multiplication, and division progressions.
- [x] Add a session summary with correct count and missed questions.
- [x] Add full session summary with time and stars earned.
- [x] Add retry missed question flow.
- [x] Add optional sound effects with mute control.
- [x] Add optional parent reset for local progress.

### P2: Whiteboard Improvements
- [x] Add pen thickness control.
- [x] Simplify clearing to one confirmed whole-board clear button.
- [x] Add full-board clear button with confirmation.
- [x] Add visual answer-box highlight while writing inside it.
- [x] Add deterministic Playwright mobile UI coverage with visual screenshots.
- [x] Add level-picker visual coverage for the floating-button layout.
- [x] Replace external icon CDN with local icon rendering for Safari/local-file compatibility.
- [x] Improve joined multi-digit recognition with valley-based splitting.
- [x] Remove the side-switch control after toolbar simplification.
- [x] Pencil options panel uses an opaque surface so board content does not show through.
- [x] Selected pencil icon reflects the active pen color.
- [x] Drawing cursor changes between pencil and eraser.

### P3: Install And Share
- [x] Add PWA manifest and service worker for offline install.
- [x] Add app icons for home-screen install.
- [x] Add GitHub Pages deployment instructions with official screenshot references.
- [x] Add simple release version constant so CSS/JS cache versions are updated from one place.

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
- [x] Add retry missed flow, pen thickness, one confirmed whole-board clear.
- [x] Add muteable sounds, PWA shell, app icon, version checks, and optional browser smoke test.
- [x] Add GitHub Pages deployment guide and `.nojekyll`.
- [x] Add visual answer-box highlight while writing inside it.
- [x] Add deterministic Playwright mobile UI coverage with visual screenshots.
- [x] Add level-picker visual coverage for the floating-button layout.
- [x] Replace external icon CDN with local icon rendering for Safari/local-file compatibility.
- [x] Improve joined multi-digit recognition with valley-based splitting.
- [x] Add splash/refresh restore, separate level background, inline feedback, compact score icons, and state-only bottom actions.
- [x] Add child-name personalization, fallback congratulations, correct-answer celebration, and opaque pencil overlay.
- [x] Add star milestone and stage-unlock achievement popups.
- [x] Add per-stage star-gated unlocks and remembered difficulty selection.
- [x] Present stages on a vertical scrolling path layout.
- [x] Active stage is larger and animated, with extra spacing between stage circles.
- [x] Require missing names before practice, add lock icons, brighter level nodes, kid-friendly time-left wording, and pencil/eraser cursors.
- [x] Add low-confidence answer-choice boxes and help overlays.
