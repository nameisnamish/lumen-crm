# ⚙️ Feature Mechanics & Business Rules

## 1. Sales Pipeline Kanban State Machine

The deal pipeline follows a strict state transition flow across 5 stages:

```text
[ New ] ──► [ Qualified ] ──► [ Proposal ] ──► [ Won ]
   │               │                │
   └───► [ Lost ] ◄┴────────────────┴───► [ Lost ]
```

### Business Rules:
- **Total Value Calculation**: Each stage recalculates its total deal value sum dynamically (`sum(deal.value)`).
- **Position Persistence**: Dragging a deal updates its `status` and `order` index in state.
- **Conversion Rate Formula**: `Conversion Rate (%) = (Won Deals / (Won Deals + Lost Deals)) * 100`.

---

## 2. AI Lead Scoring Algorithm & Structured Output

Google Gemini AI evaluates lead attributes to generate a structured output JSON object:

```json
{
  "summary": "High-intent enterprise lead with confirmed Q4 budget.",
  "riskScore": 25,
  "priority": "High",
  "nextAction": "Schedule technical demo with CTO by Friday."
}
```

### Risk Score Categories:
- **0 - 30**: Low Risk / High Probability (Green Badge).
- **31 - 60**: Moderate Risk (Yellow Badge).
- **61 - 100**: High Risk / Urgent Attention Required (Red Badge).

---

## 3. Form Input Validation & Edge Case Rules

To prevent data corruption, bad database entries, and bad user input:

### A. Name / Character Data Validation (`NAME_VALIDATION_RULE`)
- **Allowed Pattern**: `/^[a-zA-Z\s'-]{2,50}$/` (Uppercase/lowercase letters, spaces, hyphens `-`, and apostrophes `'`).
- **Forbidden Input**: Digits (`0-9`), special symbols (`#`, `@`, `!`, `$`, `_`), and strings shorter than 2 characters or longer than 50 characters.
- **Single Point of Truth**: Defined in `frontend/src/lib/validation.js` and imported across all form components (`Register.jsx`, `LeadFormDialog.jsx`, `Contacts.jsx`, `Settings.jsx`).

### B. Edge Case Handling
1. **Entering Digits in Name Field**: React Hook Form catches digits instantly during `onChange` validation and displays real-time inline error: *"Name can only contain letters, spaces, hyphens, and apostrophes"*.
2. **Backend API Boundary Guard**: `authController` and `leadsController` validate `NAME_REGEX` on incoming JSON payloads, returning `400 Bad Request` if invalid data bypasses frontend guards.
3. **Automated Test Coverage**: Tested in `frontend/tests/unit/validation.test.js`.
