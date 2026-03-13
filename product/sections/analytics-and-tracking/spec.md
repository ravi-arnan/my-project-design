# Analytics & Tracking Specification

## Overview
Admin-facing reporting layer that surfaces training performance, employee progress, and compliance status across the organization. Provides three levels of analytics — training-level, user-level, and attempt-level — with drill-down navigation, date range filtering, and CSV export. Read-only; no reminder or assignment actions.

## User Flows
- View the Analytics Overview Dashboard showing key metric cards (active trainings, overall completion rate, pass rate, overdue users), a completion trend chart, a score distribution chart, a recent activity feed, and a top-level training performance table
- Apply a date range filter (presets: 7d, 30d, 90d, YTD, All time, custom) to scope overview and training-level data; defaults to last 30 days
- Drill down from the overview to an Individual Training Analytics Page showing: user completion table (assigned/started/completed/failed), score distribution, completion time distribution, per-question performance breakdown (most missed questions), attempt logs, and overdue users for that training
- Drill down further to a User Analytics Drawer showing: full training history table, compliance summary, scores over time, average completion time, time-to-start, attempt counts per training, recurring training compliance rate
- Drill down to an Attempt Detail Drawer showing: exact start/end time, duration, pause/exit/resume events, each answer submitted with correct/incorrect breakdown, final score and pass/fail, attempt number
- View the Overdue / At-Risk list showing employees who are past their due date, how many days overdue, which training, and current status — read-only, no reminder actions
- Export any table to CSV

## UI Requirements
- Overview dashboard: metric cards row at top, 1-2 small charts (completion trend line, score distribution), then a sortable training performance table below
- Training analytics page: full page with metric cards, charts (score distribution, completion time distribution), user completion table with sortable columns, question performance breakdown table, and attempt log table
- User detail: slide-out drawer with training history table, compliance summary cards, and scores-over-time sparkline or small chart
- Attempt detail: slide-out drawer with timeline of events (start, pause, resume, submit), answer breakdown table, and score summary
- All tables support sorting by any column and CSV export via a download button
- Date range picker with preset buttons and custom range option on overview and training-level views
- Breadcrumb navigation for drill-down context (Analytics → Training Name → User Name)
- Data-dense, utilitarian design — tables are primary, charts are secondary and compact
- Overdue/at-risk view: filterable table with days-overdue column, training name, employee name, department, status badge

## Configuration
- shell: true
