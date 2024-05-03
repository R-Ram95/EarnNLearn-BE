import { Router } from "express";
import {
  getChores,
  createChore,
  updateChoreStatus,
} from "../controllers/chores.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { validateData } from "../middleware/validation.middleware.js";

const router = Router();

router.route("/child/:childId").get(verifyJwt, getChores);
router.route("/create").post(verifyJwt, createChore);
router.route("/update/:id").put(verifyJwt, updateChoreStatus);

export default router;
