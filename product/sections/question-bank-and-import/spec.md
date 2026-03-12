# Question Bank & Import Specification

## Overview
A centralized library of reusable quiz questions that admins can organize, search, and pull from when building trainings. Supports bulk CSV/Excel import with inline error correction, single-level categories with freeform tags, and usage tracking across trainings. Questions are added to trainings as snapshot copies — edits in the bank don't affect already-assigned questions.

## User Flows
- Browse and search the question library in a list/table view with filters for category, tags, question type, and keyword search
- Create a new question directly in the bank using the same question editor component from Training Builder
- Edit an existing bank question; if the question has been copied into active trainings, show a notice that existing copies won't be updated
- View usage tracking for each question — which trainings have a copy of it and when it was last copied
- Organize questions into single-level categories (e.g. "Fire Safety", "HR Policy") and attach freeform tags for additional filtering
- Bulk import questions via CSV/Excel through a stepped modal: upload file → review parsed questions in a table → fix validation errors inline or re-upload a corrected file → confirm import
- Delete a bank question — if the question has been copied into active trainings, show a confirmation dialog listing the affected trainings before proceeding; deletion removes the question from the bank only, existing snapshot copies in trainings are unaffected
- From the Training Builder's quiz section, "Add from Question Bank" opens a picker to browse/search bank questions and add snapshot copies to the training

## UI Requirements
- Main view is a searchable, filterable table/list showing: question title (truncated), type (multiple choice / true/false), category, tags, usage count, created date
- Table supports sorting by any column, bulk selection for delete/tag/categorize actions
- Question detail panel or modal for create/edit using the Training Builder's question editor pattern
- Category sidebar or filter dropdown for single-level categories; tag chips inline on each row
- Usage count is clickable — expands or navigates to show which trainings reference this question
- Import modal with 3 steps: Upload → Review & Fix → Confirm; review step shows a table of parsed rows with inline validation errors (red highlights, error tooltips) and inline editing; option to re-upload a corrected file instead of fixing inline
- "Add from Question Bank" picker in Training Builder: modal with search/filter, checkbox multi-select, preview of selected questions, "Add X Questions" confirmation button
- Empty state for new accounts with no questions — prompt to create first question or import via CSV
- Confirmation dialog when deleting questions that have been copied into trainings

## Configuration
- shell: true
