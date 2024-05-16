import { Request, Response, NextFunction } from "express";
import prisma from "../prismaClient.js";
import { TRANSACTION_STATUS } from "@prisma/client";
import { STATUS_CODES } from "../constants/enums.js";

const getTransactions = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { id } = req.params;
  // TODO for improvements - check if child exists, if not return 404

  try {
    const transactions = await prisma.transactions.findMany({
      where: {
        childUserId: id,
      },
    });

    const totalEarnings = transactions
      .filter(
        (transaction) => transaction.status === TRANSACTION_STATUS.DEPOSIT
      )
      .reduce((accumulator, current) => accumulator + current.amount, 0);

    const totalSaved = transactions.reduce(
      (accumulator, current) => accumulator + current.amount,
      0
    );

    res.json({
      transactionList: transactions,
      totalSaved: totalSaved,
      totalEearnings: totalEarnings,
    });
  } catch (error) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send("Internal server error");
  }
};

const createTransaction = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { childId, amount, status, description } = req.body;

  // TODO for improvements - check if child exists, if not return 404

  try {
    const newTransaction = await prisma.transactions.create({
      data: {
        amount: amount,
        description: description,
        childUserId: childId,
        status: status,
      },
    });

    res.json(newTransaction);
  } catch (error) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send("Internal server error");
  }
};

export { getTransactions, createTransaction };
