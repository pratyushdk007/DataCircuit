import express from "express";
import eventsRouter from "./routes/events.routes.js";

const app = express();

// Allows Express to understand JSON requests.
app.use(express.json({ limit: "100kb" }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "DataCircuit API"
  });
});

// Event APIs
app.use("/api/v1", eventsRouter);

// Unknown endpoint
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found"
  });
});

// Central error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      error: "Invalid JSON request"
    });
  }

  console.error(err);

  res.status(500).json({
    error: "Internal server error"
  });
});

export default app;