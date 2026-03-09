# Training Builder Specification

## Overview
The Training Builder is the admin-facing editor for creating and managing training programs. It consists of two views: a Training List page (table of all trainings with key stats and actions) and a three-panel Builder editor for authoring slides, configuring quizzes, setting rules pages, and managing training settings. The list view renders inside the app shell; the builder itself is a standalone full-viewport experience.

## User Flows
- View all trainings in a sortable, filterable table showing title, status, assigned count, completion rate, recurrence type, and last updated
- Create a new training from the list view, which opens the builder
- Edit an existing training by clicking into it from the list
- Archive, duplicate, or view analytics for a training from the list view
- Add, reorder (drag-and-drop), duplicate, and delete slides in the left panel
- Edit a video slide: upload video or paste embed URL, set optional title, body text, and required-watch toggle
- Edit a text slide: set title, write rich text body with image support
- Edit a question slide: write question text, define 2–6 answer options, select correct answer, add optional explanation and point value
- Configure the Rules Page: set title, description, custom instructions, toggles (allow pause, must complete in one sitting, lock quiz until slides complete, require minimum video watch), exit behavior (abandon/fail/flag), and display options (show duration, passing score, question count)
- Manage the Quiz section: add, edit, reorder, and delete quiz questions; import questions via CSV upload with downloadable template
- Configure Training Settings: title, description, category, department, estimated duration, thumbnail, status (draft/published/archived), passing score, allow retakes, max attempts, time limit, recurrence settings, password protection, shareable link, show/hide results
- Edit training title inline from the top bar
- Preview the training as an employee would see it
- Publish a training (changes status from draft to published)
- Navigate back to the training list from the builder top bar
- See auto-save status indicator in the top bar

## UI Requirements
- Training List: dense data table with sortable columns, status badges, action menu per row, "Create Training" button in page header
- Builder: three-panel layout — left (~240px), center (flex), right (~320px)
- Left panel: slide list with compact rows showing type icon, slide number, and short title; tabs or toggles for Slides, Rules Page, and Quiz sections; "Add Slide" button at the bottom of the slides list
- Center panel: active slide editor, changes based on selected slide type (video/text/question)
- Right panel: contextual slide settings when a slide is selected; collapsed or tabbed Training Settings section
- Top bar (inside builder): inline-editable training title, status badge, last saved indicator, Preview button, Publish button, Back button
- Sticky top bar inside the builder
- Left panel has subtle background differentiation from center
- Right panel always visible on desktop
- Compact, dense UI with no large empty states or oversized padding
- Slide list items are compact rows, not large cards
- Quiz section shows question list below slides in left panel with Import Questions button
- CSV import modal with file upload area and downloadable template link
- Icons throughout for slide types, actions, and status indicators

## Configuration
- shell: false
