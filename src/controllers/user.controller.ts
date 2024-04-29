import prisma from "../prismaClient.js";
import { Request, Response, NextFunction } from "express";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email } = req.body;

    // games is an array of string | string[]

    const newUser = await prisma.user.create({
      data: {
        name, // name is provided by the request body
        email,
      },
    });

    res.json(newUser);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export { registerUser };
