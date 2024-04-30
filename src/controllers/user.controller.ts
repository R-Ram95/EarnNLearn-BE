import prisma from "../prismaClient.js";
import * as bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { getUserByEmail, isQueryNotFound } from "../helpers/user.helpers.js";
import jwt from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const MAX_TOKEN_AGE = 24 * 60 * 60 * 1000;

const registerParent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { firstName, lastName, email, password } = req.body;

    const existingUser = await prisma.parentUser.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User Already registered, please login",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.parentUser.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    // don't want to send hashed password to client
    const { password: _, ...userData } = newUser;

    res.json(userData);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (user) {
      const isCredentialValid = await bcrypt.compare(password, user.password);

      if (!isCredentialValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const { firstName, lastName, id } = user;

      const token = jwt.sign(
        {
          firstName,
          lastName,
          email,
          id,
        },
        process.env.TOKEN_SECRET!,
        { expiresIn: MAX_TOKEN_AGE }
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: MAX_TOKEN_AGE,
      });

      return res.status(200).json({ message: "Login successful", user });
    } else {
      throw new PrismaClientKnownRequestError("User not found", {
        code: "P2025",
        clientVersion: "",
      });
    }
  } catch (error) {
    if (isQueryNotFound(error)) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { registerParent, loginUser };
