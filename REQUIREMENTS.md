# MathSprout Requirements

## Goal
- [x] Build a simple mobile-first web app for children to practice arithmetic on a colorful whiteboard-style screen.
- [x] Keep the app static and suitable for GitHub Pages hosting.

## Core Features
- [x] App name: MathSprout.
- [x] Mobile-first layout with touch and pen support.
- [x] Practice modes: addition, subtraction, multiplication, and division.
- [x] Difficulty levels: Starter, Explorer, and Wizard.
- [x] One random question shown at a time.
- [x] Old-school stacked question layout with one large question on the whiteboard.
- [x] Whiteboard workspace where children can write the answer and intermediate steps.
- [x] Printed question is separate from the drawing layer, so erase and clear do not remove it.
- [x] Pen colors.
- [x] Eraser.
- [x] Clear writing.
- [x] Undo.
- [x] Visible timer for the current question.
- [x] Next question button.
- [x] Check answer button.
- [x] Browser handwriting recognition reads only strokes inside the final-answer box when supported.
- [x] No typed answer field; final answers are read from the answer box when handwriting recognition is available.
- [x] Feedback after checking: correct/incorrect, correct answer, and time taken.
- [x] Gamified level map.
- [x] Stars and score.
- [x] Streak reward.
- [x] Unlock levels by completing questions.
- [x] Cheerful colors for children.
- [x] Large tap targets.
- [x] Clear labels.
- [x] Works with touch, mouse, or stylus.

## Technical Requirements
- [x] Static files only: HTML, CSS, and JavaScript.
- [x] No backend and no build step required.
- [x] Persist local progress in `localStorage`.
- [x] Must run by opening `index.html` locally and when hosted on GitHub Pages.
- [x] Avoid external dependencies for reliability.
- [x] Version JavaScript and CSS file references to avoid browser cache issues after updates.
- [x] Include a project license.

## Implementation Plan
- [x] Create requirements document and commit it.
- [x] Scaffold the static app files and commit them.
- [x] Implement arithmetic generation, levels, whiteboard drawing, timer, checking, and progress.
- [x] Polish mobile styling and gamification.
- [x] Simplify to one main whiteboard with a large stacked question.
- [x] Add license, checklist requirements, and JavaScript cache versioning.
- [x] Run local verification and commit the final implementation.

