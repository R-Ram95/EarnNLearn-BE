import prisma from "../prismaClient.js";
import * as bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { getUserByEmail, isQueryNotFound } from "../helpers/user.helpers.js";
import jwt from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { STATUS_CODES } from "../constants/enums.js";
import { MAX_TOKEN_AGE } from "../constants/constants.js";

const registerParent = async (req: Request, res: Response, _: NextFunction) => {
  try {
    let { firstName, lastName, email, password } = req.body;

    const existingUser = await prisma.parentUser.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
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

    res.status(STATUS_CODES.CREATED).json(userData);
  } catch (error: any) {
    console.log(error.message);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};

const loginUser = async (req: Request, res: Response, _: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (user) {
      const isCredentialValid = await bcrypt.compare(password, user.password);

      if (!isCredentialValid) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: "Invalid credentials" });
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

      return res
        .status(STATUS_CODES.OK)
        .json({ message: "Login successful", user });
    } else {
      throw new PrismaClientKnownRequestError("User not found", {
        code: "P2025",
        clientVersion: "",
      });
    }
  } catch (error) {
    if (isQueryNotFound(error)) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "User not found" });
    }

    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// EXAMPLE FOR GETTING USER DATA - TODO DELETE THIS
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = res.locals.user;
  // don't want to send the claim in the jwt -> not sure if we need this??
  res.locals.user = "";

  try {
    const user = await prisma.childUser.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).send("User not found");
    }

    const { password, ...userData } = user;

    return res.status(STATUS_CODES.OK).json(userData);
  } catch (error) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send("Internal server error");
  }
};

export { registerParent, loginUser, getUser };
