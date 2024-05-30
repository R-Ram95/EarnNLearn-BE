import express from "express";
import userRoutes from "./routes/user.routes.js";
import choresRoutes from "./routes/chores.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import transactionRoutes from "./routes/transactions.routes.js";

const app = express();

const allowedOrigins = [
  "https://earnnlearn.onrender.com",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/chores", choresRoutes);
app.use("/api/transactions/", transactionRoutes);

export default app;
