import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
const port = 3000;

app.post("/user", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    // games is an array of string | string[]

    const newUser = await prisma.user.create({
      data: {
        name, // name is provided by the request body
      },
    });

    res.json(newUser);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
