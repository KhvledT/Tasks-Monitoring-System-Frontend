# Frontend User Guide — Seafarer Application (UI/UX)

This guide defines the UI/UX specifications, responsive layouts, page flow, and interaction patterns for the Seafarer client interface. This document is intended for frontend developers and user-interface building agents.

---

## 1. Design Philosophy

- **Premium & Modern**: Dark-mode primary layout using sleek, high-contrast typography, soft gradients, and subtle borders. Avoid default styling. Use custom components with rounded borders and responsive margins.
- **Micro-Animations**: Add transition states (fade-in, transform-shifts on card hover, scale-down on button press) to make the interface feel responsive and interactive.
- **High Glanceability**: Ship deck operations are stressful and time-constrained. Crucial information (overdue tasks, compliance metrics, active vessel name) must be prominently displayed.

---

## 2. Authentication Flow

### Landing / Authentication Screen
- **Visuals**: Centered modal structure with two tabs: **Log In** and **Sign Up**. Backed by an image showing marine navigation/bridge.
- **Controls**:
  - Email and password text fields.
  - Sign-up includes Full Name, Rank selector (dropdown), Sign-On Date picker, and confirm password fields.
  - Google OAuth single-sign-on (SSO) button.
- **Behavior**:
  - Submitting validation highlights fields immediately on error.
  - Redirects to **OTP Verification Screen** if the account is unverified.
  - Redirects to **Vessel Selection Screen** on successful verification.

---

## 3. Navigation & Screen Flow

The application uses a persistent side navigation bar on desktop, collapsing to a bottom navigation bar on mobile devices.

```txt
[Log In / Sign Up]
        │
        ▼
[Vessel Selection Screen] ──── (If no active vessel) ───► [Create Vessel Modal]
        │
        ▼ (Vessel Activated)
┌────────────────────────────────────────────────────────┐
│                   Main Dashboard                       │
└────────────────────────────────────────────────────────┘
  ├── Checklists (Daily, Weekly, Monthly, Signing-On)
  ├── Reported Issues Log
  ├── Paginated History & Exports
  └── Profile & Settings Drawer
```

---

## 4. Screen-by-Screen Specifications

### Screen 1: Vessel Selection & Setup
- **Purpose**: Forces context selection before access to checklist logs.
- **Layout**: Centered card collection displaying all registered vessels (Name, Type, GRT/DWT parameters) with status badges (`Active` or `Inactive`).
- **Interactions**:
  - Clicking any vessel launches the activation sequence, closing this view and navigating to the Main Dashboard.
  - Primary button: **Register New Vessel**. Clicking this displays a slide-down modal form requesting Vessel Name, Type (dropdown), GRT, and DWT.

---

### Screen 2: Seafarer Dashboard
- **Purpose**: Displays high-level analytics and quick actions.
- **KPI Metrics Cards**:
  - **Compliance Score**: Large circular gauge showing percentage.
  - **Today's Completion**: Progress bar showing `Completed Count / Total Count`.
  - **Active Issues Count**: High-contrast badge linking to Issues screen.
- **Recent Logs Section**: Scrollable feed showing the last 5 task completions.

---

### Screen 3: Checklists (Task Execution)
- **Purpose**: The core workspace for logging checks.
- **Layout**:
  - **Top Control Bar**: Filter tabs between **Daily**, **Weekly (Thursday Renewals)**, **Monthly**, and **Signing-On (14-Day Onboarding)**.
  - **Main Area**: Accordion-style categories (e.g. "GMDSS Radio Controls", "Bridge Equipment Inspections"). Accordion headers display category name and task completion count (e.g., `3/4 Completed`).
- **Task Cards (Inside Category)**:
  - Displays Title, description, and status indicator (color-coded: Green = Complete, Amber = Postponed, Blue = Pending).
  - Hovering a task card reveals action overlay buttons: **Complete** (Checkmark icon) and **Postpone** (Clock icon).
- **Interactions**:
  - **Complete Action**: Displays a small dialog modal requesting optional verification notes and measurement reading inputs.
  - **Postpone Action**: Displays a modal requesting a written reason for postponement.
  - **Report Issue link**: Tapping "Log Issue" on the task card opens the Log Issue Drawer, auto-populating task details.

---

### Screen 4: Issues Log
- **Purpose**: Records vessel defects.
- **Layout**: Three-column grid layout dividing issues by severity tags (`Critical`, `Warning`, `Information`).
- **Card Elements**: Issue description, linked task name, date logged, and photo thumbnail.
- **Interactions**:
  - **Thumbnail click**: Opens full-screen photo viewer lightbox.
  - **New Issue button**: Launches Log Issue Drawer requesting:
    - Task link search field.
    - Description area.
    - Camera/File upload section for photo attachments.
    - Action buttons: Submit, Cancel.

---

### Screen 5: Logbook History & Exports
- **Purpose**: Audits past entries and handles handover reports.
- **Layout**:
  - **Filters Area**: Date range picker (Start Date, End Date), Status filter (Complete, Postponed), Search field.
  - **Log Table**: High-glanceability grid listing Date, Category, Task Title, Status, Completed By, Notes.
  - **Download Panel**: Two prominent buttons: **Export PDF Logbook** and **Download Excel Sheet**. Clicking these shows an overlay loading spinner until download starts.

---

## 5. UI Elements & Design Specifications

### Modals, Drawers & Dialogs
- **Modals**: Centered overlays with dark semi-transparent backdrops. Used for forms and confirmation messages.
- **Drawers**: Slide-out panels from the right edge. Best suited for "Log Issue" and "User Profile/Settings".
- **Confirmation Dialogs**: Required before destructive operations (e.g. deleting a custom vessel).

### Empty, Loading & Error States
- **Empty States**: Display illustration (e.g. outline vessel helm icon) with helpful texts (e.g., *"No tasks recorded for this date. Enjoy your watch!"*).
- **Loading Skeleton**: Shimmering card outlines instead of simple spinners.
- **Error States**: Display floating notification banners (toast messages) in red/amber with retry options.
