import { Router } from "express";
import {
  registerParent,
  loginUser,
  getUser,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

// THIS IS A SAMPLE ROUTE, WE DON'T NEED IT
router.route("/").get(verifyJwt, getUser);
router.route("/login").post(loginUser);
router.route("/register-parent").post(registerParent);

export default router;
