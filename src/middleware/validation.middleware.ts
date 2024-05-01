import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { STATUS_CODES } from "../constants/enums.js";

export const validateData = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // check if the body is valid based on schema
      schema.parse(req.body);
      next();
    } catch (error) {
      // request body is incorrect
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join} is ${issue.message}`,
        }));

        res.status(STATUS_CODES.BAD_REQUEST).send({
          error: "Invalid data",
          details: errorMessages,
        });
      }
      // server issues
      else {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
          error: "Internal Server Error",
        });
      }
    }
  };
};
