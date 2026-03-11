# Application Shell Specification

## Overview
PeopleOS uses a standalone page pattern with back-button navigation for all primary sections. Each major view (Training Builder, Training Player, Question Bank, Analytics, Settings) is a full-screen standalone page with its own top header bar containing a back button, breadcrumb, and contextual actions. There is no persistent sidebar for page-level navigation.

## Navigation Structure
All primary sections use standalone top-bar navigation with back buttons:
- Training Builder → Admin training editor (standalone, back button)
- Training Player / Employee Dashboard → Employee training flow (standalone, back button)
- Question Bank → Question management and import (standalone, back button)
- Analytics → Training performance dashboards (standalone, back button)
- Settings → App and account configuration (standalone, back button)

## Top Bar Pattern
Each standalone page has a thin top header bar (48px height) containing:
- Back button (left) → Returns to previous view or home
- Breadcrumb → Section icon + section name + page name
- Contextual actions (right) → Preview, Publish, Fullscreen, etc.

## User Menu
User information is shown contextually within each standalone page rather than in a persistent sidebar.

## Layout Pattern
Full-screen standalone pages with a top header bar. Content area fills the entire viewport below the header and scrolls independently. No persistent sidebar.

## Responsive Behavior
- **Desktop (≥1024px):** Full-width content with generous horizontal padding
- **Tablet (768px–1023px):** Full-width content with moderate padding
- **Mobile (<768px):** Full-width content with compact padding, hamburger menu for mobile navigation if needed

## Design Notes
- Top bar background uses slate-900 in dark mode with slate-800 border
- Back button uses slate-400 icons with hover state
- Breadcrumb text uses slate-400 for section, slate-200 for current page
- Content area uses slate-950 background in dark mode
- DM Sans font family throughout
