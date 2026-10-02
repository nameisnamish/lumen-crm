# Lumen CRM

Enterprise-grade AI-powered Customer Relationship Management and revenue intelligence platform designed for high-velocity sales teams.

---

## Executive Overview

Lumen CRM bridges tactical deal management with strategic AI-driven pipeline analytics. Built on a modern decoupled architecture, it provides revenue leaders with real-time forecasting, automated deal health scoring via Google Gemini AI, adaptive cadence performance tracking, and an interactive Kanban pipeline.

---

## Key Capabilities

### 1. Executive Intelligence & Analytics
* **Executive KPI Ribbon**: Real-time aggregation of total pipeline value, closed revenue, stage-adjusted weighted forecasting, and conversion win rates.
* **Adaptive Cadence Analytics**: Dynamic velocity tracking that automatically calibrates time horizons:
  * 30-Day Window: Weekly intake cadence (W1 - W4).
  * 90-Day & 180-Day Windows: Month-over-month trajectory.
  * 365-Day Window: Quarterly performance pacing (Q1 - Q4).
* **Lead Acquisition Breakdown**: Channel origin donut visualization with proportional share distribution.

### 2. Embedded AI Copilot & Predictive Insights
* **Gemini-Powered Copilot**: Context-aware natural language assistant for querying pipeline health, extracting deal blockers, and drafting high-conversion outreach emails.
* **Deal Health & Risk Scoring**: Automated risk assessments flagging stagnant opportunities, overdue touchpoints, and conversion probabilities.
* **Opportunity Briefings**: One-click deal synthesis generating executive summaries and recommended action items.

### 3. Pipeline & Relationship Management
* **Interactive Kanban Pipeline**: Drag-and-drop opportunity tracking across predefined lifecycle stages (New, Qualified, Proposal, Won, Lost).
* **Consolidated Funnel Analysis**: Multi-stage conversion velocity mapping stage progression drop-offs and monetary volume.
* **Task & Follow-up Automation**: Priority-based task tracking with overdue alerts and lead association.
* **Key Relationship Directory**: Contact indexing with engagement history and account metadata.

---

## Architecture & Technology Stack

```
lumen-crm/
├── frontend/                   # Client application (React + Vite)
│   ├── src/
│   │   ├── components/         # Modular UI design system & widgets
│   │   │   ├── ai/             # Copilot panel, insights & email generators
│   │   │   ├── dashboard/      # KPI ribbon, charts & activity tables
│   │   │   ├── leads/          # Kanban boards, tables & lead drawers
│   │   │   └── ui/             # Core design tokens, cards & dialogs
│   │   ├── context/            # Authentication & session providers
│   │   ├── lib/                # API clients, mock engines & formatters
│   │   └── pages/              # Application views and routing
│   └── package.json
│
├── backend/                    # Server application (Node.js + Express)
│   ├── src/
│   │   ├── controllers/        # REST route handlers (analytics, AI, leads)
│   │   ├── data/               # In-memory database & fixtures
│   │   ├── routes/             # Express API endpoint declarations
│   │   └── services/           # Gemini AI SDK integration
│   ├── server.js               # Application entry point
│   └── package.json
│
└── docs/                       # Architectural specifications & guides
```

### Technical Specifications

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite, React Router DOM |
| **Styling & Design System** | Tailwind CSS v4, Custom Design Tokens, CSS Variables |
| **Data Visualization** | Recharts, SVG Gradient Masking |
| **Icons & Typography** | Lucide React, Sora / Inter Typography |
| **Backend Runtime** | Node.js, Express.js |
| **AI & LLM Services** | Google Gemini API (`@google/genai`) |
| **Data Protocol** | RESTful JSON API, Axios, Dual Mode (Mock / Live) |

---

## Getting Started

### Prerequisites
* Node.js (v18.0.0 or higher)
* npm (v9.0.0 or higher)
* Git

---

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nameisnamish/lumen-crm.git
   cd lumen-crm
   ```

2. **Configure Environment Variables**:
   
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

   Create a `.env` file in the `frontend/` directory (optional for mock mode):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_USE_MOCK=false
   ```

3. **Install Dependencies**:

   Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

   Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the Development Environment**:

   Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

   In a separate terminal, start the frontend client:
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:5173`.

---

## Production Build

To generate an optimized static production build for the frontend:

```bash
cd frontend
npm run build
```

The output artifacts will be written to the `frontend/dist` directory.

---

## License

This project is licensed under the MIT License.
