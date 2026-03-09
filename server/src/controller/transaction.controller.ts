import { Request, Response } from "express";
import Transaction from "../models/transaction.model.js";
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
