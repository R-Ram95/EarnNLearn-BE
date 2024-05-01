import { z } from "zod";

const userRegistrationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export { userRegistrationSchema, userLoginSchema };
