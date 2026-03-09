# Application Shell Specification

## Overview
PeopleOS uses a left sidebar navigation pattern optimized for desktop-first admin workflows. The sidebar contains all primary navigation items, settings at the bottom, and a user menu pinned to the bottom. The layout is dense and operational — minimal chrome, maximum content area.

## Navigation Structure
- Dashboard → Home / landing view
- Training Builder → Admin training editor
- Training Player → Employee training flow
- Question Bank → Question management and import
- Analytics → Training performance dashboards
- Settings → App and account configuration (bottom section)

## User Menu
Pinned to the bottom of the sidebar. Shows user avatar (initials fallback), display name, and a dropdown with profile and logout options.

## Layout Pattern
Fixed-width left sidebar (256px expanded, 64px collapsed) with a fluid content area. No top header bar — the sidebar owns all navigation chrome. Content area fills remaining viewport width and scrolls independently.

## Responsive Behavior
- **Desktop (≥1024px):** Full sidebar with icons and labels, 256px wide
- **Tablet (768px–1023px):** Collapsed sidebar showing icons only, 64px wide, with tooltips on hover
- **Mobile (<768px):** Sidebar hidden, hamburger icon in top-left opens a slide-over drawer overlay

## Design Notes
- Sidebar background uses slate-900 in dark mode, white with slate-100 border in light mode
- Active nav item highlighted with indigo-500 accent (left border or background tint)
- Icons from lucide-react for all nav items
- Smooth transition between expanded and collapsed states
- Content area has a subtle top bar on mobile only (hamburger + page title)
