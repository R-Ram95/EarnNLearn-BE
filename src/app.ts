import express from "express";
import userRoutes from "./routes/user.routes.js";
import choresRoutes from "./routes/chores.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(cookieParser());
// /api/user/logout
app.use("/api/user", userRoutes);
app.use("/api/chores", choresRoutes);


export default app;
