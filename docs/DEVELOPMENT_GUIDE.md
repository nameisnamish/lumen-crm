# 🛠️ Development Guide & Engineering Standards

## 1. Feature-Driven Folder Structure
Code is organized into feature domain modules inside `src/features/`. Each feature encapsulates its components, hooks, services, and validation rules:

```
AI CRM Dashboard/
├── frontend/                   # React 19 Single Page App
│   ├── src/
│   │   ├── features/           # Feature domain modules (auth, leads, pipeline, contacts, notes, tasks, ai)
│   │   ├── components/         # Reusable UI primitives, cards, dialogs, layouts
│   │   ├── context/            # AuthContext & global session state
│   │   ├── lib/                # Axios API client, interceptors, formatters
│   │   └── App.jsx             # Main Application Route Controller
│   └── tests/                  # Vitest unit & integration tests
│
└── backend/                    # Node.js + Express REST API Server
    ├── src/
    │   ├── routes/             # Express REST API routes
    │   ├── controllers/        # Business logic & CRUD controllers
    │   ├── middleware/         # JWT auth protection & error handling
    │   └── services/           # Gemini AI integration service
    └── server.js               # Express server entry point (Port 8000)
```

---

## 2. Feature Implementation Workflow

When building or modifying a feature:
1. **Define Feature Contract**: Specify UI state, validation schema, and API inputs.
2. **Implement Business Logic**: Place domain calculations in reusable hooks or services.
3. **Build Feature UI**: Build feature components using shared primitives (`src/shared/ui/`).
4. **Validate & Test**: Test form inputs, loading states, empty states, and errors.
5. **Update Docs & Status**: Keep `PROJECT_STATUS.md` and feature docs updated.
