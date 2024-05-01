import { Router } from "express";
import { getChores, createChore, updateChoreStatus } from "../controllers/chores.controller.js";

const router = Router();

router.route("/").get(getChores);
router.route("/create").post(createChore);
router.route("/update/:id").put(updateChoreStatus);

export default router;