import { Request, Response, NextFunction } from "express";
import prisma from "../prismaClient.js";
import { TRANSACTION_STATUS } from "@prisma/client";
import { STATUS_CODES } from "../constants/enums.js";
import { isQueryNotFound } from "../helpers/user.helpers.js";

const getTransactions = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { id } = req.params;

  try {
    const transactions = await prisma.transactions.findMany({
      where: {
        childUserId: id,
      },
    });

    // all depositis
    const totalEarnings = transactions
      .filter(
        (transaction) => transaction.status === TRANSACTION_STATUS.DEPOSIT
      )
      .reduce((accumulator, current) => accumulator + current.amount, 0);

    // all deposits, exclude pending and approved
    const totalSaved = transactions
      .filter(
        (transaction) =>
          transaction.status === TRANSACTION_STATUS.DEPOSIT ||
          transaction.status === TRANSACTION_STATUS.WITHDRAWAL
      )
      .reduce((accumulator, current) => accumulator + current.amount, 0);

    res.json({
      transactionList: transactions,
      totalSaved: totalSaved,
      totalEarnings: totalEarnings,
    });
  } catch (error) {
    if (isQueryNotFound(error)) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .send(`Transaction for child ${id} not found.`);
    }

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

  let transactionAmount = amount;
  if (status === TRANSACTION_STATUS.WITHDRAWAL) {
    transactionAmount = -amount;
  }

  // TODO for improvements - check if child exists, if not return 404

  try {
    const newTransaction = await prisma.transactions.create({
      data: {
        amount: transactionAmount,
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

const updateTransaction = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { transactionId, childId, amount, status, description } = req.body;

  try {
    const updatedTransaction = await prisma.transactions.update({
      where: {
        id: transactionId,
      },
      data: {
        amount: amount,
        childUserId: childId,
        status: status,
        description: description,
      },
    });

    res.json(updatedTransaction);
  } catch (error) {
    if (isQueryNotFound(error)) {
      return res.status(STATUS_CODES.NOT_FOUND).send("Transaction not found.");
    }

    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send("Internal server error");
  }
};

export { getTransactions, createTransaction, updateTransaction };
