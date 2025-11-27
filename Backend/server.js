import dotenv from "dotenv";
dotenv.config();

import connectDB from "./Config/ConnectDB.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); 
  });
