import { Router } from "express";
import {
  registerParent,
  loginUser,
  getUser,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { validateData } from "../middleware/validation.middleware.js";
import { userRegistrationSchema } from "../schemas/user.schemas.js";

const router = Router();

// THIS IS A SAMPLE ROUTE, WE DON'T NEED IT
router.route("/").get(verifyJwt, getUser);
router.route("/login").post(loginUser);
router
  .route("/register-parent")
  .post(validateData(userRegistrationSchema), registerParent);

export default router;
