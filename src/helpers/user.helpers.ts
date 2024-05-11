import { Prisma } from "@prisma/client";
import prisma from "../prismaClient.js";
import { ROLE } from "../constants/enums.js";

const isQueryNotFound = (error: any) => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
};

async function getUserByEmail(email: string) {
  let user = await prisma.parentUser.findFirst({ where: { email } });
  let role = ROLE.PARENT;
  if (!user) {
    user = await prisma.childUser.findFirst({ where: { email } });
    role = ROLE.CHILD;
  }
  return { ...user, role: role };
}

export { isQueryNotFound, getUserByEmail };
