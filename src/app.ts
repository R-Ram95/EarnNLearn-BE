import express from "express";
import userRoutes from "./routes/user.routes.js";
import choresRoutes from "./routes/chores.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import transactionRoutes from "./routes/transactions.routes.js";

const app = express();

const allowedOrigins = ["*"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin!) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/chores", choresRoutes);
app.use("/api/transactions/", transactionRoutes);

export default app;
