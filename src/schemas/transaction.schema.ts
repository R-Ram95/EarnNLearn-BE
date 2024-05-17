import { z } from "zod";
import { TRANSACTION_STATUS } from "@prisma/client";

const transactionStatusSchema = z.enum([
  TRANSACTION_STATUS.DEPOSIT,
  TRANSACTION_STATUS.WITHDRAWAL,
  TRANSACTION_STATUS.PENDING,
  TRANSACTION_STATUS.DENIED,
]);

const createTransactionSchema = z.object({
  amount: z.number(),
  status: transactionStatusSchema,
  description: z.string(),
  childId: z.string(),
});

const updateTransactionSchema = createTransactionSchema.extend({
  transactionId: z.string(),
});

export { createTransactionSchema, updateTransactionSchema };
