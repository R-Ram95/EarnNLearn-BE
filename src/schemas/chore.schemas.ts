import { z } from "zod";

const choreStatusSchema = z.enum([
  "NOT_ACCEPTED",
  "IN_PROGRESS",
  "AWAITING_APPROVAL",
  "COMPLETED",
]);

const choreSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  amount: z
    .number()
    .int()
    .nonnegative({ message: "Amount must be a non-negative integer" }),
  // dueDate: z.date(), disable for now
  status: choreStatusSchema,
  childUserId: z.string(),
});

export { choreSchema };
