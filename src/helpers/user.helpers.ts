import { Prisma } from "@prisma/client";
import prisma from "../prismaClient.js";

const isQueryNotFound = (error: any) => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
};

async function getUserByEmail(email: string) {
  let user = await prisma.parentUser.findFirst({ where: { email } });
  if (!user) {
    user = await prisma.childUser.findFirst({ where: { email } });
  }
  return user;
}

export { isQueryNotFound, getUserByEmail };
