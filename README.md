# DataCircuit

DataCircuit is a lightweight, modular backend service designed to ingest, validate, and manage business event streams (such as payment logs) before they hit core data pipelines. It isolates malformed payloads into a quarantine store and prevents duplicate ingestion.

## 🚀 Week 1 Architecture
- **Framework:** Node.js + Express.js
- **Storage:** In-memory (Map and Array storage for prototype phase)
- **Validation:** Custom event schema validator

## 📋 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Check server health status |
| `POST` | `/api/v1/events` | Ingest and validate a payment event |
| `GET` | `/api/v1/events` | List all successfully accepted events |
| `GET` | `/api/v1/events/:eventId` | Retrieve a specific accepted event by ID |
| `GET` | `/api/v1/quarantine` | View all quarantined events and failure reasons |

## 🛠️ Installation & Running

1. Clone the repository:
   ```bash
   git clone [https://github.com/pratyushdk007/DataCircuit.git](https://github.com/pratyushdk007/DataCircuit.git)
   cd DataCircuit

   # DataCircuit

Autonomous Data Failure Containment Engine.

## Week 2 Features

- PostgreSQL event storage
- Prisma ORM integration
- Persistent accepted events
- Persistent quarantined events
- Database-level duplicate protection
- QuickBite payment event simulator
- Event retrieval APIs
- Basic pagination

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JavaScript

## Run Locally

Install dependencies:

npm install

Configure DATABASE_URL in .env.

Run database migration:

npx prisma@7 migrate dev

Generate Prisma Client:

npx prisma@7 generate

Start server:

npm run dev

Generate 1000 events:

npm run events:generate -- 1000

Run tests:

npm test