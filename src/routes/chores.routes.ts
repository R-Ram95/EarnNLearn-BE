import { Router } from "express";
import {
  getChores,
  createChore,
  updateChoreStatus,
  deleteChore,
} from "../controllers/chores.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { validateData } from "../middleware/validation.middleware.js";
import { choreSchema } from "../schemas/chore.schemas.js";

const router = Router();

router.route("/child/:childId").get(verifyJwt, getChores);
router.route("/create").post(verifyJwt, validateData(choreSchema), createChore);
router.route("/update/:id").put(verifyJwt, updateChoreStatus);
//delete id is the chore's id
router.route("/delete/:id").delete(verifyJwt, deleteChore);
export default router;
