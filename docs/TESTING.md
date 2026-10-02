# 🧪 Testing Strategy & Test Automation

## 1. Testing Hierarchy

| Level | Scope | Technology | Location |
| :--- | :--- | :--- | :--- |
| **Unit Tests** | Utility functions, calculations, formatters | Vitest | `tests/unit/` |
| **Component Tests** | UI rendering, form validation, user events | `@testing-library/react` | `src/features/**/__tests__/` |
| **Integration Tests** | API services, state context transitions | Vitest + Axios Mock | `tests/integration/` |

---

## 2. Test Commands
```bash
# Run all unit and integration tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run test coverage report
npm run test:coverage
```
