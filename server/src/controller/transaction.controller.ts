import { Request, Response } from "express";
import Transaction from "../models/transaction.model.js";
import Refund from "../models/refund.model.js";
import { TransactionStatus } from "../interfaces/transaction.interface.js";

interface TransactionQuery {
  merchantId?: string;
  page?: string;
  limit?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      status,
      startDate,
      endDate,
    }: TransactionQuery = req.query;

    // Get merchantId from authenticated user or query parameter
    const merchantId = req.user?.userId || req.query.merchantId;

    if (!merchantId) {
      return res.status(400).json({
        success: false,
        message: "Merchant ID is required",
      });
    }

    // Build filter object
    const filter: any = {
      merchantId: merchantId,
    };

    // Add status filter if provided
    if (
      status &&
      Object.values(TransactionStatus).includes(status as TransactionStatus)
    ) {
      filter.status = status;
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      filter.transactionDate = {};

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0); // Start of day
        filter.transactionDate.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of day
        filter.transactionDate.$lte = end;
      }
    }

    // Pagination setup
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Ensure pagination limits (max 500 transactions, 10 per page default)
    const maxLimit = Math.min(pageSize, 50); // Max 50 per page
    const maxSkip = Math.min(skip, 490); // Max skip to stay within 500 total

    // Execute queries
    const [transactions, totalCount] = await Promise.all([
      Transaction.find(filter)
        .sort({ transactionDate: -1, createdAt: -1 }) // Latest first
        .skip(maxSkip)
        .limit(maxLimit)
        .lean(), // Better performance for read-only data
      Transaction.countDocuments(filter),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(Math.min(totalCount, 500) / maxLimit);
    const hasNextPage = pageNumber < totalPages && maxSkip + maxLimit < 500;
    const hasPrevPage = pageNumber > 1;

    // Response
    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalCount: Math.min(totalCount, 500), // Cap at 500
          pageSize: maxLimit,
          hasNextPage,
          hasPrevPage,
        },
        filters: {
          merchantId,
          status: status || null,
          startDate: startDate || null,
          endDate: endDate || null,
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const merchantId = req.user?.userId || req.query.merchantId;

    if (!merchantId) {
      return res.status(400).json({
        success: false,
        message: "Merchant ID is required",
      });
    }

    const transaction = await Transaction.findOne({
      _id: id,
      merchantId: merchantId,
    }).lean();

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error: any) {
    console.error("Error fetching transaction by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const refundTransaction = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const { amount, reason } = req.body;
    const merchantId = req.user?.userId;

    console.log("Refund request received for transactionId:", transactionId);
    console.log("Refund amount:", amount);
    console.log("Refund reason:", reason);
    console.log("Merchant ID:", merchantId);

    //     Refund request received for transactionId: 25b1f54f-b212-4663-b869-8ea1e776a958
    // Refund amount: 35000
    // Refund reason: yese hi
    // Merchant ID: 69aefa96dd6aa1314f24db85

    if (!merchantId) {
      return res.status(400).json({
        success: false,
        message: "Merchant ID is required",
      });
    }

    const transaction = await Transaction.findOne({
      transactionId: transactionId,
      merchantId: merchantId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Rule 1: Only Successful transactions are eligible for refund
    if (transaction.status !== TransactionStatus.SUCCESS) {
      return res.status(400).json({
        success: false,
        message: "Only successful transactions are eligible for refund",
      });
    }

    // Rule 2: A transaction can only be refunded once
    const existingRefund = await Refund.findOne({
      transactionId: transaction._id.toString(),
    });
    if (existingRefund) {
      return res.status(400).json({
        success: false,
        message: "Transaction has already been refunded",
      });
    }

    // Rule 3: Refund must be raised within 30 days of the transaction date
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (transaction.transactionDate < thirtyDaysAgo) {
      return res.status(400).json({
        success: false,
        message:
          "Refund period has expired. Refunds must be raised within 30 days of the transaction date",
      });
    }

    // Rule 4 & 5: Refund amount must be valid and cannot exceed original amount (partial refunds allowed)
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid refund amount is required",
      });
    }

    if (amount > transaction.amount) {
      return res.status(400).json({
        success: false,
        message: "Refund amount cannot exceed the original transaction amount",
      });
    }

    // Create refund record
    const refund = await Refund.create({
      transactionId: transaction._id.toString(),
      merchantId,
      amount,
      reason,
    });

    // Update transaction status and timeline
    transaction.status = TransactionStatus.REFUNDED;
    transaction.statusTimeline.push({
      status: TransactionStatus.REFUNDED,
      refundedAmount: amount,
      note: reason,
      updatedAt: new Date(),
    });

    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Transaction refunded successfully",
      data: { transaction, refund },
    });
  } catch (error: any) {
    console.error("Error refunding transaction:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
