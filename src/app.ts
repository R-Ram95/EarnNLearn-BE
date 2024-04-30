import express from "express";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// /api/user/register
// /api/user/login
// /api/user/logout
app.use("/api/user", userRoutes);

export default app;
