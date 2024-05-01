import prisma from "../prismaClient.js";
import { Request, Response } from "express";

const getChores = async (req: Request, res: Response) => {
  try {
    const chores = await prisma.chores.findMany({
      include: {
        assignedTo: true,
        assignedBy: true
      }
    });
    res.json(chores);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chores", error: error.message });
  }
};

const createChore = async (req: Request, res: Response) => {
  try {
    const { title, amount, dueDate, childUserId, parentUserId } = req.body;
    const newChore = await prisma.chores.create({
      data: {
        title,
        amount,
        dueDate,
        status: "NOT_ACCEPTED", // default status
        childUserId,
        parentUserId
      }
    });
    res.status(201).json(newChore);
  } catch (error) {
    res.status(500).json({ message: "Failed to create chore", error: error.message });
  }
};

const updateChoreStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedChore = await prisma.chores.update({
      where: { choreId: id },
      data: { status }
    });
    res.json(updatedChore);
  } catch (error) {
    res.status(500).json({ message: "Failed to update chore status", error: error.message });
  }
};

export { getChores, createChore, updateChoreStatus };