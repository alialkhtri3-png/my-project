const start = () => {
  console.log("🚀 My Project started successfully");
};

start();

import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "🚀 ali.cb.id API is running",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

