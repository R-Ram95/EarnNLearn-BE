import { Router } from "express";
import {
  registerParent,
  registerChild,
  login,
  logout,
  getChild,
  getChildren,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { validateData } from "../middleware/validation.middleware.js";
import {
  userRegistrationSchema,
  userLoginSchema,
} from "../schemas/user.schemas.js";

const router = Router();

router.route("/login").post(validateData(userLoginSchema), login);
router.route("/logout").post(logout);
router.route("/child/:id").get(verifyJwt, getChild);
router
  .route("/register-parent")
  .post(validateData(userRegistrationSchema), registerParent);
router
  .route("/register-child")
  .post(verifyJwt, validateData(userRegistrationSchema), registerChild);
router.route("/children").get(verifyJwt, getChildren);

export default router;
