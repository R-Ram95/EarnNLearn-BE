import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../constants/enums.js";

export const verifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, process.env.TOKEN_SECRET!);

    if (!claims) {
      return res.send(STATUS_CODES.UNAUTHORIZED).send("Unauthorized request");
    }

    // pass claims to the next route
    res.locals.user = claims;
    next();
  } catch (error) {
    res.status(STATUS_CODES.UNAUTHORIZED).send("Unauthorized request");
  }
};
