import { Router } from "express";
import {
  registerParent,
  loginUser,
  getUser,
  getChildren
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { validateData } from "../middleware/validation.middleware.js";
import {
  userRegistrationSchema,
  userLoginSchema,
} from "../schemas/user.schemas.js";

const router = Router();

// THIS IS A SAMPLE ROUTE, WE DON'T NEED IT
router.route("/").get(verifyJwt, getUser);
router.route("/login").post(validateData(userLoginSchema), loginUser);
router
  .route("/register-parent")
  .post(validateData(userRegistrationSchema), registerParent);
router.route("/children").get(verifyJwt, getChildren);

export default router;
