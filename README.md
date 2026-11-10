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