# 🔒 Security Architecture & Rules

## 1. Authentication & Session Security
- **JWT (JSON Web Token)**: Statetess authentication mechanism.
- **LocalStorage Token Management**: Auth token stored under key `lumen_crm_token`.
- **Axios Bearer Token Interceptor**: Injects `Authorization: Bearer <token>` into HTTP headers.
- **401 Auto-Logout**: Automatic session termination and redirection to `/login` when tokens expire.

## 2. Authorization & Data Isolation (Multi-Tenancy)
- All records (`Leads`, `Contacts`, `Notes`, `Tasks`) are scoped to the authenticated `owner` ID.
- Users can never view or modify records belonging to another tenant.

## 3. Input Validation & Protection
- Sanitized form inputs.
- Prevention of SQL Injection / NoSQL Injection via parameterized queries.
