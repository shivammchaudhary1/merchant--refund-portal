import { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Stack,
  Alert,
  Divider,
} from "@mui/material";
import Loader from "../components/common/Loader";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import {
  ArrowBack,
  CheckCircle,
  Error,
  Schedule,
  Payment,
  Receipt,
} from "@mui/icons-material";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/store";
import {
  fetchTransactionById,
  clearError,
  initiateRefund,
} from "../app/slices/transactionSlice";
import { useNotifications } from "../utils/notifications";
import type { TransactionStatus } from "../types";
import dayjs from "dayjs";

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { notify } = useNotifications();

  const { currentTransaction, currentRefund, loading, error } = useAppSelector(
    (state) => state.transaction,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchTransactionById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      notify("fail", error);
      dispatch(clearError());
    }
  }, [error, notify, dispatch]);

  const handleBackToTransactions = () => {
    // Preserve query parameters when navigating back
    const state = location.state as { from?: string } | undefined;
    const backPath = state?.from || "/transactions";
    navigate(backPath);
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "Successful":
        return "success" as const;
      case "Failed":
        return "error" as const;
      case "Pending":
      case "Processing":
      case "Initiated":
        return "warning" as const;
      default:
        return "default" as const;
    }
  };

  const getTimelineDotColor = (status: TransactionStatus) => {
    switch (status) {
      case "Successful":
        return "success" as const;
      case "Failed":
        return "error" as const;
      case "Pending":
      case "Processing":
      case "Initiated":
        return "warning" as const;
      default:
        return "grey" as const;
    }
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case "Successful":
        return <CheckCircle color="success" />;
      case "Failed":
        return <Error color="error" />;
      case "Pending":
      case "Processing":
      case "Initiated":
        return <Schedule color="warning" />;
      default:
        return <Payment />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return dayjs(date).format("MMM DD, YYYY HH:mm");
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <Loader />
        </Box>
      </Container>
    );
  }

  if (!currentTransaction) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Transaction not found</Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={handleBackToTransactions}
          sx={{ mt: 2 }}
        >
          Back to Transactions
        </Button>
      </Container>
    );
  }

  const handleRefund = () => {
    console.log(
      "Refund initiated for transaction:",
      currentTransaction.transactionId,
    );

    try {
      dispatch(
        initiateRefund({
          transactionId: currentTransaction.transactionId,
          amount: currentTransaction.amount * 0.8,
          reason: "Customer requested refund",
        }),
      );
    } catch (error) {
      console.error("Error initiating refund:", error);
    }
  };

  const isRefundEligible = () => {
    return (
      currentTransaction.status === "Successful" &&
      dayjs().diff(dayjs(currentTransaction.transactionDate), "day") <= 30
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBackToTransactions}
          sx={{ mb: 2 }}
        >
          Back to Transactions
        </Button>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Transaction Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Transaction ID: {currentTransaction.transactionId}
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Transaction Information */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Transaction ID
                </Typography>
                <Typography variant="body1" fontFamily="monospace">
                  {currentTransaction.transactionId}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="h6" color="primary" fontWeight={600}>
                  {formatCurrency(currentTransaction.amount)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    icon={getStatusIcon(currentTransaction.status)}
                    label={currentTransaction.status}
                    color={getStatusColor(currentTransaction.status)}
                    variant="outlined"
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(currentTransaction.transactionDate)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Merchant ID
                </Typography>
                <Typography variant="body1" fontFamily="monospace">
                  {currentTransaction.merchantId}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Reference Number
                </Typography>
                <Typography variant="body1" fontFamily="monospace">
                  N/A
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Status Timeline */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Timeline
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Timeline position="left">
              {currentTransaction.statusTimeline.map((entry, index) => {
                const isLast =
                  index === currentTransaction.statusTimeline.length - 1;
                return (
                  <TimelineItem key={index}>
                    <TimelineOppositeContent color="text.secondary">
                      {formatDate(entry.updatedAt)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color={getTimelineDotColor(entry.status)}>
                        {getStatusIcon(entry.status)}
                      </TimelineDot>
                      {!isLast && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="h6" component="span">
                        {entry.status}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </Paper>
        </Grid>

        {/* Summary Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, position: "sticky", top: 24 }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="h5" color="primary" fontWeight={600}>
                  {formatCurrency(
                    currentTransaction.status === "Refunded" && currentRefund
                      ? currentRefund.originalAmount
                      : currentTransaction.amount,
                  )}
                </Typography>
              </Box>

              {currentTransaction.status === "Refunded" && currentRefund && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Refund Amount
                  </Typography>
                  <Typography variant="body1" color="error" fontWeight={500}>
                    − {formatCurrency(currentRefund.amount)}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Transaction Fee
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(0)}{" "}
                  {/* Placeholder - add fee field if available */}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Net Amount
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {formatCurrency(currentTransaction.amount)}
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Receipt />}
                  disabled={currentTransaction.status !== "Successful"}
                >
                  Download Receipt
                </Button>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Available for successful transactions
                </Typography>
              </Box>

              {/* refund  */}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CurrencyExchangeIcon />}
                  disabled={!isRefundEligible()}
                  onClick={handleRefund}
                >
                  Refund
                </Button>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Refunds can only be initiated for successful transactions
                  within 30 days of the transaction date. Partial refunds are
                  allowed.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TransactionDetail;
