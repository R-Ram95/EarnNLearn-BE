import { z } from "zod";

const transactionStatusSchema = z.enum(["REWARD", "WITHDRAWAL"]);

const transactionSchema = z.object({
  amount: z.number(),
  status: transactionStatusSchema,
  description: z.string(),
  childId: z.string(),
});

export { transactionSchema };
