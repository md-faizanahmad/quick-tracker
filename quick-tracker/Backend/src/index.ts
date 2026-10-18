import express from "express";
import cors from "cors";
import { AppReq, AppRes } from "./types/http.js";
import { Expense } from "./types/expense.js";

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: [
      "https://offline-expense-tracker.vercel.app", // frontend domain
      "http://localhost:5173", // local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (req: AppReq, res: AppRes) => {
  res.json({ status: "working" });
});

app.post("/sync", (req: AppReq<Expense[]>, res: AppRes) => {
  const expenses = req.body;

  if (!Array.isArray(expenses)) {
    return res.status(400).json({ error: "Invalid Payload" });
  }

  if (Math.random() < 0.2) {
    return res.status(500).json({ error: "Random sync Failure" });
  }

  res.json({
    success: true,
    syncedCount: expenses.length,
  });
});

app.listen(PORT, () => {
  console.info(`Server Running on http://localhost:${PORT}`);
});
