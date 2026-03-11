# Training Player Specification

## Overview
The Training Player is the employee-facing experience for completing assigned trainings. It provides a mobile-first, immersive learning flow — from viewing assigned trainings on a dashboard, through reading and acknowledging rules, progressing through slides, completing a quiz, and reviewing results. The player enforces admin-configured rules around timing, pausing, and completion behavior.

## User Flows
- Employee views their dashboard showing assigned trainings (pending, overdue, in progress) with due dates, a completed archive section, and a profile summary
- Employee opens a training and lands on the Training Rules page showing title, description, estimated duration, question count, passing score, and all configured rules
- Employee checks the "I understand the rules" acknowledgement checkbox and clicks Start Training to begin the timer
- Employee progresses through slides one at a time — video slides autoplay, text slides scroll, inline question slides require an answer and show immediate correct/incorrect feedback before proceeding
- Progress indicator at the top tracks slide completion throughout the player
- After all slides are complete, the quiz becomes available — displayed one question at a time or all at once (admin-configurable)
- Employee submits the quiz and sees a results screen showing pass/fail, score, and optionally correct answers (admin-configurable whether to show detailed results or just pass/fail)
- On failure, employee can retry based on admin-controlled settings: max attempts and whether retries are immediate or after a cooldown period
- Completed training moves to the archive, viewable with title, completion date, score, pass/fail status, and number of attempts
- If the employee leaves mid-training, progress is saved and they can resume from the last slide (unless must-complete-in-one-sitting is enabled, which warns on navigation away)
- If pause is not allowed by admin, pausing is disabled in the player
- Timer runs from Start Training click to quiz submission

## UI Requirements
- Mobile-first, clean, focused design — feels like a learning experience, not a management tool
- Employee Dashboard: card-based layout showing assigned trainings with status badges, due dates, and a completed archive list; displayed inside the app shell
- Training Rules Page: standalone full-screen page with training metadata, rules summary, acknowledgement checkbox, and Start Training button
- Slide Player: immersive full-screen standalone view with no distracting chrome; subtle progress bar at top; minimal navigation (Next button and progress indicator only); no sidebar
- Video slides autoplay where possible; text slides are scrollable; inline question slides show the question, capture the answer, and display immediate feedback
- Quiz Screen: standalone full-screen view showing question number and total, supports one-at-a-time or all-on-one-page layout, Submit button at the end
- Results Screen: standalone full-screen view showing pass/fail, score, and optionally correct answers; button to return to dashboard
- Archive Screen: list view of completed trainings with title, completion date, score, pass/fail badge, and attempt count; displayed inside the app shell
- Navigation-away warning modal when must-complete-in-one-sitting is enabled

## Configuration
- shell: false
