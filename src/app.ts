import express from "express";
import userRoutes from "./routes/user.routes.js";
import choresRoutes from "./routes/chores.routes.js";
import cookieParser from "cookie-parser";
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
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// /api/user/logout
app.use("/api/user", userRoutes);

export default app;
