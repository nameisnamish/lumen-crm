# 📡 API Endpoints & Contract Specification

## Base URL: `http://localhost:8000/api`

### 1. Authentication Endpoints
- `POST /auth/register`: Register new user (`email`, `password`, `name`).
- `POST /auth/login`: Authenticate user and return JWT (`token`, `user`).
- `GET /auth/me`: Get current authenticated user profile.

### 2. Leads Endpoints
- `GET /leads`: List leads with filter/search query parameters.
- `POST /leads`: Create new lead.
- `GET /leads/:id`: Fetch single lead details.
- `PUT /leads/:id`: Update existing lead.
- `DELETE /leads/:id`: Remove lead.
- `PATCH /leads/reorder`: Update pipeline stage and order positions.

### 3. AI Endpoints (Google Gemini Integration)
- `POST /ai/lead-summary`: Generate lead risk score & summary.
- `POST /ai/generate-email`: Compose email subject & body.
- `POST /ai/sales-insights`: Generate pipeline health insights & recommendations.
