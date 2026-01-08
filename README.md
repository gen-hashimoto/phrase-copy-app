# App Title (Working Title)

> Working title will be decided together with the designer.

> Repository name is temporary and can be renamed later if needed.

## Overview

This app is a lightweight tool for managing and copying predefined phrases.
The primary goal of Phase 1 is **quick access, easy copying, and simple backup/restore** for personal use.

This document is meant for **early concept alignment and feedback**, not final UI or visual polish.

## Phase 1 Scope

### Included

- Display a list of predefined phrases
- Copy a single phrase to the clipboard
- Copy all phrases at once (newline-separated)
- Backup phrases as plain text
- Restore phrases by pasting plain text (one phrase per line)

### Out of Scope

- User authentication
- Database persistence
- Editing or deleting phrases
- Visual design optimization
- Responsive fine-tuning

## UI Concept (Rough)

### 1. Interaction Flow

![Interaction Flow](docs/images/interaction_flow.png)

### 2. Screen Rough (Phase 1)

![Screen Rough](docs/images/screen_rough_phase1.png)

> This image is a functional mock for discussion purposes only.

Main elements:

- Phrase list with a **Copy** button per item
- A **Copy All** button for bulk copying
- A **Backup** action that outputs all phrases as text
- An **Import** area where users can paste text to restore phrases

## Notes

- “Copy All” copies all phrases as newline-separated text.
- Backup and import are text-based to allow easy use on mobile devices
  (e.g., saving to a notes app).
- This phase prioritizes **behavior and user flow**, not styling.

## Open Question

- App title: I’d like to leave this to the designer and decide together.

## Next Steps

- Collect feedback from the designer
- Refine interactions if needed
- Decide whether to proceed to Phase 2 (editing, persistence, etc.)
