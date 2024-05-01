import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validateData = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // check if the body is valid based on our schema
      schema.parse(req.body);
      next();
    } catch (error) {
      // request body is incorrect
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join} is ${issue.message}`,
        }));

        res.status(400).send({
          error: "Invalid data",
          details: errorMessages,
        });
      }
      // server issues
      else {
        res.status(500).send({
          error: "Internal Server Error",
        });
      }
    }
  };
};
