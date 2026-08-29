# MathSprout Requirements

## Goal
Build a simple mobile-first web app for children to practice arithmetic on a colorful whiteboard-style screen. The app must be static and suitable for GitHub Pages hosting.

## Core Features
- App name: MathSprout
- Mobile-first layout with touch and pen support.
- Practice modes:
  - Addition
  - Subtraction
  - Multiplication
  - Division
- Difficulty levels:
  - Starter: small numbers and simple facts.
  - Explorer: larger numbers and two-step carrying/borrowing opportunities.
  - Wizard: multi-digit problems and harder multiplication/division.
- One random question shown at a time.
- Whiteboard workspace where children can write the answer and intermediate steps.
- The printed question remains separate from the writable canvas and cannot be erased by the whiteboard eraser.
- Pen tools:
  - Multiple colors
  - Eraser
  - Clear writing
  - Undo
- Visible timer for the current question.
- Next question button.
- Check answer button.
- Intelligent answer detection:
  - Try browser handwriting recognition when supported.
  - Provide an answer field fallback so the app remains usable on all GitHub Pages browsers.
- Feedback after checking:
  - Correct or incorrect
  - Correct answer
  - Time taken
- Gamification:
  - Candy-path level map.
  - Stars and score.
  - Streak reward.
  - Unlock levels by completing questions.
  - Cheerful colors and playful animations.
- Accessibility:
  - Large tap targets.
  - Clear labels.
  - Works with touch, mouse, or stylus.

## Technical Requirements
- Static files only: HTML, CSS, and JavaScript.
- No backend and no build step required.
- Persist local progress in `localStorage`.
- Must run by opening `index.html` locally and when hosted on GitHub Pages.
- Avoid external dependencies for reliability.

## Implementation Plan
1. Create requirements document and commit it.
2. Scaffold the static app files and commit them.
3. Implement arithmetic generation, levels, whiteboard drawing, timer, checking, and progress.
4. Polish mobile styling and gamification.
5. Run local verification and commit the final implementation.
