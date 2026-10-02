# 🏗️ Project Context & Architecture Overview

## 1. System Vision
The **AI CRM Dashboard** is a high-performance Customer Relationship Management platform built to assist sales teams with lead acquisition, sales pipeline tracking, contact management, task follow-ups, and automated AI outreach.

---

## 2. Technology Stack & Boundaries

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 19, Vite 8 | Declarative single-page application framework. |
| **Styling** | Tailwind CSS v4, Lucide Icons | Responsive utility-first CSS design system. |
| **Routing** | React Router v7 | Client-side route management and route guards. |
| **State & Drag/Drop** | React Context API, `@dnd-kit` | Global auth state & drag-and-drop Kanban board. |
| **Charts & Analytics** | Recharts | Interactive SVG revenue & pipeline charts. |
| **HTTP & API Layer** | Axios | Request/Response interceptors & JWT handling. |
| **AI Integration** | Google Gemini AI | JSON-schema structured output for lead scoring & email generation. |

---

## 3. System Architecture & Component Boundaries

```
                  +-----------------------------------+
                  |         React 19 Frontend         |
                  +-----------------------------------+
                                    |
           +------------------------+------------------------+
           |                        |                        |
+--------------------+   +--------------------+   +--------------------+
|  Feature Modules   |   |   Context API      |   | Axios API Client   |
| (Leads, Pipeline,  |   | (AuthContext,      |   | (Request/Response  |
| Contacts, AI, etc) |   |  ThemeContext)     |   |   Interceptors)    |
+--------------------+   +--------------------+   +--------------------+
                                                             |
                                                   +-------------------+
                                                   | Express / Mock API|
                                                   | & Gemini AI API   |
                                                   +-------------------+
```
