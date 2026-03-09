export type TransactionStatus =
  | "Successful"
  | "Failed"
  | "Pending"
  | "Refunded"
  | "Initiated"
  | "Processing";

export interface StatusHistory {
  status: TransactionStatus;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  merchantId: string;
  transactionId: string;
  amount: number;
  status: TransactionStatus;
  transactionDate: string;
  statusTimeline: StatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TransactionFilters {
  merchantId: string;
  status: TransactionStatus | null;
  startDate: string | null;
  endDate: string | null;
}

export interface TransactionResponse {
  success: boolean;
  message?: string;
  data: {
    transactions: Transaction[];
    pagination: TransactionPagination;
    filters: TransactionFilters;
  };
}

export interface TransactionDetailResponse {
  success: boolean;
  message?: string;
  data: Transaction;
}

export interface TransactionQuery {
  page?: number;
  limit?: number;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  merchantId?: string;
}

export interface TransactionState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  pagination: TransactionPagination | null;
  filters: TransactionFilters | null;
  loading: boolean;
  error: string | null;
}
