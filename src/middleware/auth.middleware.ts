import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookie = req.cookies["jwt"];
    console.log(cookie);

    const claims = jwt.verify(cookie, process.env.TOKEN_SECRET!);

    if (!claims) {
      return res.send(400).send("Unauthorized request");
    }

    // pass claims to the next route
    res.locals.user = claims;
    next();
  } catch (error) {
    res.status(400).send("Unauthorized request");
  }
};
