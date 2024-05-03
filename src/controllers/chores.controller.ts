import prisma from "../prismaClient.js";
import { Request, Response } from "express";
import { STATUS_CODES } from "../constants/enums.js";

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
        status: "NOT_ACCEPTED", // default status
        childUserId,
        parentId,
      },
    });
    res.status(201).json(newChore);
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
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send("Internal server error");
  }
};

export { getChores, createChore, updateChoreStatus };
