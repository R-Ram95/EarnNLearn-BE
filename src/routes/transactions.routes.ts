import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { validateData } from "../middleware/validation.middleware.js";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../schemas/transaction.schema.js";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
} from "../controllers/transaction.controller.js";

const router = Router();

router.route("/transaction/:childId").get(verifyJwt, getTransactions);

router
  .route("/transaction")
  .post(verifyJwt, validateData(createTransactionSchema), createTransaction);

router.route("/update/:transactionId").put(verifyJwt, updateTransaction);

export default router;
