import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Pagination,
  Grid,
  TextField,
  MenuItem,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import {
  Search,
  FilterList,
  Receipt,
  TrendingUp,
  TrendingDown,
  PendingActions,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../app/store";
import { fetchTransactions, clearError } from "../app/slices/transactionSlice";
import { useNotifications } from "../utils/notifications";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import type { TransactionStatus, TransactionQuery } from "../types";
import dayjs from "dayjs";

const Transactions = () => {
  const dispatch = useAppDispatch();
  const { notify } = useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { transactions, pagination, loading, error } = useAppSelector(
    (state) => state.transaction,
  );

  // Derive filters directly from URL params
  const localFilters: TransactionQuery = {
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "10"),
    status: (searchParams.get("status") as TransactionStatus) || undefined,
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  };

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "Successful", label: "Successful" },
    { value: "Failed", label: "Failed" },
    { value: "Pending", label: "Pending" },
    { value: "Processing", label: "Processing" },
    { value: "Initiated", label: "Initiated" },
    { value: "Refunded", label: "Refunded" },
  ];

  // Update URL when filters change
  const updateURL = (newFilters: TransactionQuery) => {
    const params = new URLSearchParams();

    // Only add non-empty/non-default values to URL
    if (newFilters.page && newFilters.page !== 1) {
      params.set("page", newFilters.page.toString());
    }
    if (newFilters.limit && newFilters.limit !== 10) {
      params.set("limit", newFilters.limit.toString());
    }
    if (newFilters.status) {
      params.set("status", newFilters.status);
    }
    if (newFilters.startDate) {
      params.set("startDate", newFilters.startDate);
    }
    if (newFilters.endDate) {
      params.set("endDate", newFilters.endDate);
    }

    // Update URL without page reload
    setSearchParams(params);
  };

  // Fetch transactions when URL search params change
  useEffect(() => {
    dispatch(
      fetchTransactions({
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "10"),
        status: (searchParams.get("status") as TransactionStatus) || undefined,
        startDate: searchParams.get("startDate") || undefined,
        endDate: searchParams.get("endDate") || undefined,
      }),
    );
  }, [dispatch, searchParams]);

  // Handle errors
  useEffect(() => {
    if (error) {
      notify("fail", error);
      dispatch(clearError());
    }
  }, [error, notify, dispatch]);

  const handleFilterChange = (
    key: keyof TransactionQuery,
    value: TransactionQuery[keyof TransactionQuery],
  ) => {
    const newFilters: TransactionQuery = {
      ...localFilters,
      [key]: value,
      page: key !== "page" ? 1 : (value as number),
    };
    updateURL(newFilters);
  };

  const handleSearch = () => {
    updateURL({ ...localFilters, page: 1 });
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleViewTransaction = (transactionId: string) => {
    // Pass current URL with query parameters as state for back navigation
    navigate(`/transaction/${transactionId}`, {
      state: { from: location.pathname + location.search },
    });
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "Successful":
        return "success";
      case "Failed":
        return "error";
      case "Pending":
        return "warning";
      case "Processing":
        return "info";
      case "Initiated":
        return "default";
      case "Refunded":
        return "secondary";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM DD, YYYY HH:mm");
  };

  // Calculate summary stats
  const summaryStats = React.useMemo(() => {
    const successful = transactions.filter(
      (t) => t.status === "Successful",
    ).length;
    const failed = transactions.filter((t) => t.status === "Failed").length;
    const pending = transactions.filter((t) =>
      ["Pending", "Processing", "Initiated"].includes(t.status),
    ).length;

    const totalAmount = transactions
      .filter((t) => t.status === "Successful")
      .reduce((sum, t) => sum + t.amount, 0);

    return { successful, failed, pending, totalAmount };
  }, [transactions]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Transactions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage all your payment transactions
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "success.light",
                    color: "success.contrastText",
                  }}
                >
                  <TrendingUp />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {summaryStats.successful}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Successful
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "error.light",
                    color: "error.contrastText",
                  }}
                >
                  <TrendingDown />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {summaryStats.failed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Failed
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "warning.light",
                    color: "warning.contrastText",
                  }}
                >
                  <PendingActions />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {summaryStats.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  }}
                >
                  <Receipt />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {formatCurrency(summaryStats.totalAmount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Volume
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
        >
          <FilterList />
          Filters
        </Typography>

        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Status"
              value={localFilters.status || ""}
              onChange={(e) =>
                handleFilterChange("status", e.target.value || undefined)
              }
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={localFilters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={localFilters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<Search />}
                fullWidth
              >
                Search
              </Button>
              <Button variant="outlined" onClick={handleClearFilters}>
                Clear
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Transactions Table */}
      <Paper sx={{ mb: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No transactions found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow
                      key={transaction._id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleViewTransaction(transaction._id)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {transaction.transactionId.slice(0, 8)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {formatCurrency(transaction.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          color={getStatusColor(transaction.status)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(transaction.transactionDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTransaction(transaction._id);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={(_, page) => handleFilterChange("page", page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Pagination Info */}
      {pagination && (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Showing {transactions.length} of {pagination.totalCount} transactions
          (Page {pagination.currentPage} of {pagination.totalPages})
        </Typography>
      )}
    </Container>
  );
};

export default Transactions;
