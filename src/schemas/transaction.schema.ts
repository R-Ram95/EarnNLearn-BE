import { z } from "zod";
import { TRANSACTION_STATUS } from "@prisma/client";

const transactionStatusSchema = z.enum([
  TRANSACTION_STATUS.DEPOSIT,
  TRANSACTION_STATUS.WITHDRAWAL,
]);

const transactionSchema = z.object({
  amount: z.number(),
  status: transactionStatusSchema,
  description: z.string(),
  childId: z.string(),
});

export { transactionSchema };
