import express from "express";
import cors from "cors";
import { AppReq, AppRes } from "./types/http.js";
import { Expense } from "./types/expense.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req: AppReq, res: AppRes) => {
  res.json({ status: "working" });
});

app.get("/sync", (req: AppReq<Expense[]>, res: AppRes) => {
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
