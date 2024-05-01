import express from "express";
import userRoutes from "./routes/user.routes.js";
import choresRoutes from "./routes/chores.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000', // or wherever your frontend is hosted
    credentials: true, // This is important to allow sending cookies across origins
  };
  
  app.use(cors(corsOptions));


// /api/user/logout
app.use("/api/user", userRoutes);
app.use("/api/chores", choresRoutes);

export default app;
