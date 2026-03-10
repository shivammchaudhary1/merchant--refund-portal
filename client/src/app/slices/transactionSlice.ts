import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import config from "../../config/config";
import type {
  Transaction,
  TransactionResponse,
  TransactionDetailResponse,
  TransactionQuery,
  TransactionState,
  AsyncThunkConfig,
} from "../../types";

const initialState: TransactionState = {
  transactions: [],
  currentTransaction: null,
  pagination: null,
  filters: null,
  loading: false,
  error: null,
};

// Fetch transactions with filters and pagination
export const fetchTransactions = createAsyncThunk<
  TransactionResponse,
  TransactionQuery,
  AsyncThunkConfig
>(
  "transaction/fetchTransactions",
  async (query: TransactionQuery, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("mrptoken");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      // Build query string
      const queryParams = new URLSearchParams();

      if (query.page) queryParams.append("page", query.page.toString());
      if (query.limit) queryParams.append("limit", query.limit.toString());
      if (query.status) queryParams.append("status", query.status);
      if (query.startDate) queryParams.append("startDate", query.startDate);
      if (query.endDate) queryParams.append("endDate", query.endDate);
      if (query.merchantId) queryParams.append("merchantId", query.merchantId);

      const response = await fetch(
        `${config.BACKEND_API}/api/transactions?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data: TransactionResponse = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch transactions");
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  },
);

// Fetch single transaction by ID
export const fetchTransactionById = createAsyncThunk<
  TransactionDetailResponse,
  string,
  AsyncThunkConfig
>(
  "transaction/fetchTransactionById",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("mrptoken");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(
        `${config.BACKEND_API}/api/transactions/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data: TransactionDetailResponse = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch transaction");
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  },
);

export const initiateRefund = createAsyncThunk<
  TransactionDetailResponse,
  { transactionId: string; amount: number; reason: string },
  AsyncThunkConfig
>(
  "transaction/initiateRefund",
  async ({ transactionId, amount, reason }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("mrptoken");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(
        `${config.BACKEND_API}/api/transactions/${transactionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount, reason }),
        },
      );

      const data: TransactionDetailResponse = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to initiate refund");
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  },
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTransaction: (
      state,
      action: PayloadAction<Transaction | null>,
    ) => {
      state.currentTransaction = action.payload;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch transactions cases
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<TransactionResponse>) => {
          state.loading = false;
          state.transactions = action.payload.data.transactions;
          state.pagination = action.payload.data.pagination;
          state.filters = action.payload.data.filters;
          state.error = null;
        },
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch transactions";
      })
      // Fetch single transaction cases
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTransactionById.fulfilled,
        (state, action: PayloadAction<TransactionDetailResponse>) => {
          state.loading = false;
          state.currentTransaction = action.payload.data;
          state.error = null;
        },
      )
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch transaction";
      });

    // Initiate refund cases
    builder
      .addCase(initiateRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        initiateRefund.fulfilled,
        (state, action: PayloadAction<TransactionDetailResponse>) => {
          state.loading = false;
          state.currentTransaction = action.payload.data;
          state.error = null;
        },
      )
      .addCase(initiateRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to initiate refund";
      });
  },
});

// Export actions
export const {
  clearError,
  setCurrentTransaction,
  clearCurrentTransaction,
  setLoading,
} = transactionSlice.actions;

// Export reducer
export default transactionSlice.reducer;
