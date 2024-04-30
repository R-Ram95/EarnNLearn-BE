import { Prisma } from "@prisma/client";

const isQueryNotFound = (error: any) => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
};

export { isQueryNotFound };
