import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// import routes
import UserRoutes from "./routers/userRouter.js";
// import CategoryRoutes from "./routers/categoryRouter.js";
  import TransactionRoutes from "./routers/transactionRouter.js";
// import BudgetRoutes from "./routers/budgetRouter.js";
// import GoalRoutes from "./routers/goalRouter.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
  app.use("/api/users", UserRoutes);
  // app.use("/api/categories", CategoryRoutes);
  app.use("/api/transactions", TransactionRoutes);
  // app.use("/api/budgets", BudgetRoutes);
  // app.use("/api/goals", GoalRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;
