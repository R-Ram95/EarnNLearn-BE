import prisma from "../prismaClient.js";
import * as bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { isQueryNotFound } from "../helpers/user.helpers.js";
import jwt from "jsonwebtoken";

const MAX_TOKEN_AGE = 24 * 60 * 60 * 24;

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { firstName, lastName, email, password } = req.body;

    const existingUser = await prisma.user.findFirst({
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

    const newUser = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
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
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email,
      },
    });

    const isCredentialValid = await bcrypt.compare(password, user.password);

    if (!isCredentialValid) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const { first_name, last_name } = user;

    const token = jwt.sign(
      {
        firstName: first_name,
        lastName: last_name,
        email: email,
      },
      process.env.TOKEN_SECRET!,
      {
        expiresIn: MAX_TOKEN_AGE,
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: MAX_TOKEN_AGE,
    });

    res.status(200).send({
      message: "Login successful",
    });
  } catch (error: any) {
    if (isQueryNotFound(error)) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export { registerUser, loginUser };
