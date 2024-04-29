import prisma from "../prismaClient.js";
import * as bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { firstName, lastName, email, password } = req.body;

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
    const { password: removedPassword, ...data } = newUser;

    res.json(data);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// const loginUser = async (req: Request, res: Response, next: NextFunction) => {
//   const { userEmail, password } = req.body;

//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         email: userEmail as string,
//       },
//     });

//     if (!user) {
//       return res.status(404).send({
//         message: "User not found",
//       });
//     }

//     // check the password hashes
//     const isCredentialValid = await bcrypt.compare(password, user.password);

//     if (!isCredentialValid) {
//       return res.status(400).json({
//         message: "Invalid Credentials.",
//       });
//     }

//     res.send(user);
//   } catch (error: any) {
//     console.log(error.message);
//     return res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// };

export { registerUser };
