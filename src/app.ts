import express from "express";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

// /api/user/register
// /api/user/login
// /api/user/logout
app.use("/api/user", userRoutes);

export default app;
