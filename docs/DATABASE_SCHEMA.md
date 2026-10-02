# 🗄️ Database Schema & Data Models

## 1. User Model (`User`)
- `_id`: ObjectId (Primary Key)
- `name`: String (Required)
- `email`: String (Required, Unique)
- `password`: String (Hashed via bcrypt)
- `createdAt`: Timestamp

## 2. Lead Model (`Lead`)
- `_id`: ObjectId
- `owner`: Ref -> User (Multi-tenant data isolation)
- `name`: String
- `company`: String
- `email`: String
- `phone`: String
- `value`: Number
- `status`: Enum (`"New"`, `"Qualified"`, `"Proposal"`, `"Won"`, `"Lost"`)
- `priority`: Enum (`"Low"`, `"Medium"`, `"High"`)
- `source`: String
- `tags`: Array of Strings
- `aiSummary`: String
- `aiRiskScore`: Number (0 - 100)
- `order`: Number
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
