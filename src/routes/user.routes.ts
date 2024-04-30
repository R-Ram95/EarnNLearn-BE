import { Router } from "express";
import { registerParent, loginUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register-parent").post(registerParent);
router.route("/login").post(loginUser);

export default router;
