import prisma from "../prismaClient.js";
import { CHORE_STATUS, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { STATUS_CODES } from "../constants/enums.js";
import { isQueryNotFound } from "../helpers/user.helpers.js";

const getChores = async (req: Request, res: Response) => {
  const { childId } = req.params;

  try {
    const chores = await prisma.chores.findMany({
      where: {
        childUserId: childId,
      },
      include: {
        assignedTo: true,
        assignedBy: true,
      },
    });
    res.json(chores);
  } catch (error) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send("Internal server error");
  }
};

const createChore = async (req: Request, res: Response) => {
  //get parent ID from JWT
  const parentId = res.locals.user.id;

  try {
    const { title, amount, dueDate, childUserId } = req.body;
    const newChore = await prisma.chores.create({
      data: {
        title,
        amount,
        dueDate,
        status: CHORE_STATUS.NOT_ACCEPTED, // default status
        childUserId,
        parentUserId: parentId,
      },
    });
    res.json(newChore);
  } catch (error) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send("Internal server error");
  }
};

const updateChoreStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedChore = await prisma.chores.update({
      where: { choreId: id },
      data: { status },
    });
    res.json(updatedChore);
  } catch (error) {
    if (isQueryNotFound(error)) {
      return res.status(STATUS_CODES.NOT_FOUND).send("Chore not found");
    }

    console.error("Failed to update chore:", error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send("Internal server error");
  }
};

const deleteChore = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  try {
    const deletedChore = await prisma.chores.delete({
      where: { choreId: id },
    });
    res.json({ message: "Chore successfully deleted", deletedChore });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // If no chore is found with the ID, Prisma returns error code P2025
      return res.status(STATUS_CODES.NOT_FOUND).send("Chore not found");
    }

    console.error("Failed to delete chore:", error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send("Internal server error");
  }
};

export { getChores, createChore, updateChoreStatus, deleteChore };
