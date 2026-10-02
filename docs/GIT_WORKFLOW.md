# Git Workflow & Phase-on-Phase Merge Policy

This document establishes the official branching strategy and release gate criteria for the Lumen CRM platform.

---

## 1. Branch Hierarchy

```
main (v1.0.0 Phase 1 Release) ───────●───────────────────────────● (v1.1.0 Phase 2 Release)
                                    ▲                           ▲
                                    │ (Phase 1 Gate Passed)     │ (Phase 2 Gate Passed)
develop ────────────────────●───────┴────────●──────●───────────┴─ (Ongoing Development)
                            ▲                ▲      ▲
                            │                │      │
feat/*                      ●────────────────┘      │
                                                    ● (feat/lead-details)
```

| Branch | Classification | Push Permission | Purpose |
| :--- | :--- | :--- | :--- |
| **`main`** | Production | Protected | Houses release-ready, fully tested milestone versions. |
| **`develop`** | Active Integration | Team / Developer | The default working branch for daily feature commits. |
| **`feat/*`** | Short-Lived Feature | Developer | Isolated sandbox for building a specific feature. |
| **`fix/*`** | Bug Fix | Developer | Fast-turnaround patch merged into `develop`. |

---

## 2. Phase-on-Phase Release Gates

To maintain strict stability on `main`, daily commits remain on `develop`. A merge from `develop` into `main` is authorized **only** when a designated Phase is complete and meets all **4 Release Gates**:

### Gate 1: Milestone Completeness
* All user stories and planned features for the current Phase are 100% complete.
* No partial or stubbed out UI in active navigation paths.

### Gate 2: Build Verification
* Frontend compiles cleanly: `npm run build` exits with code `0`.
* Backend initializes with zero route or controller syntax exceptions.

### Gate 3: Core Flow Smoke Testing
* Dashboard renders across all time horizons (`1M`, `3M`, `6M`, `1Y`, `ALL`).
* Adaptive Cadence adjusts correctly between Weekly, Monthly, Quarterly, and Annual bars.
* Kanban drag-and-drop state transitions function without console errors.
* AI Copilot and Insights handlers respond correctly.

### Gate 4: Release Tagging
* Merges to `main` are always tagged with a semantic release version (e.g. `v1.0.0`, `v1.1.0`).

---

## 3. Project Release Roadmap

### Phase 1: Core Dashboard & AI Architecture (Completed - v1.0.0 on `main`)
* 8:4 Executive Dashboard Architecture.
* Adaptive Cadence Time-Horizon Engine (`1M`, `3M`, `6M`, `1Y`, `ALL`).
* AI Sales Copilot, Deal Health Scoring & Opportunity Briefings.
* Pipeline Kanban & Unified Conversion Funnel.

### Phase 2: Lead Intelligence & Relationship Hub (Active on `develop` - v1.1.0)
* Lead detail overview tabs, communication logs, and activity timeline.
* Contact indexing, tag management, and relationship notes.
* Task management with overdue deadline notifications.

### Phase 3: Automation & Integration Suite (Planned - v1.2.0)
* Gemini AI automated cold/follow-up email drafting engine.
* CSV bulk lead import, export, and batch stage updating.

### Phase 4: Production Hardening & Cloud Infrastructure (Planned - v2.0.0)
* Database persistence (MongoDB / PostgreSQL).
* JWT authentication hardening with refresh token rotation.
* Production cloud deployment on Vercel / Render.

---

## 4. Standard Developer Commands

### Daily Feature Work:
```bash
# 1. Switch to develop
git checkout develop

# 2. Pull latest updates
git pull origin develop

# 3. Create feature branch
git checkout -b feat/lead-timeline

# 4. Commit and push feature branch
git add .
git commit -m "feat: implement lead activity timeline"
git push -u origin feat/lead-timeline

# 5. Merge feature back into develop
git checkout develop
git merge feat/lead-timeline
git push origin develop
```

### Phase Release to `main` (Only when all 4 Gates are satisfied):
```bash
# 1. Verify on develop
git checkout develop
npm run build

# 2. Switch to main and merge
git checkout main
git merge develop -m "release: Phase 2 Lead Intelligence & Relationship Hub (v1.1.0)"

# 3. Tag the release
git tag -a v1.1.0 -m "Release v1.1.0: Phase 2 Complete"

# 4. Push release and tags to GitHub
git push origin main --tags
```
