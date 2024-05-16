import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { validateData } from "../middleware/validation.middleware.js";
import { transactionSchema } from "../schemas/transaction.schema.js";
import {
  getTransactions,
  createTransaction,
} from "../controllers/transaction.controller.js";

const router = Router();

router.route("/transaction/:childId").get(verifyJwt, getTransactions);
router
  .route("/transaction")
  .post(verifyJwt, validateData(transactionSchema), createTransaction);

export default router;
