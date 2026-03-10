import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import type { NotificationPayload, AlertState } from "../../types";

// Initial state
const initialState: AlertState = {
  alerts: [],
};

// Create the alert slice
const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    // Show notification with type and message
    showNotification: (state, action: PayloadAction<NotificationPayload>) => {
      const { type, message } = action.payload;
      const alert = {
        id: Date.now().toString(),
        message,
        type,
        timestamp: Date.now(),
      };
      state.alerts.push(alert);

      // Trigger react-hot-toast based on type
      switch (type) {
        case "success":
          toast.success(message, {
            duration: 4000,
            position: "top-right",
          });
          break;
        case "fail":
          toast.error(message, {
            duration: 6000,
            position: "top-right",
          });
          break;
        case "warning":
          toast(message, {
            duration: 5000,
            position: "top-right",
            icon: "⚠️",
            style: {
              background: "#ff9800",
              color: "#fff",
            },
          });
          break;
        default:
          toast(message, {
            duration: 4000,
            position: "top-right",
          });
      }
    },

    // Clear a specific alert
    clearAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload,
      );
    },

    // Clear all alerts
    clearAllAlerts: (state) => {
      state.alerts = [];
      toast.dismiss(); // Dismiss all toast notifications
    },
  },
});

// Export actions
export const { showNotification, clearAlert, clearAllAlerts } =
  alertSlice.actions;

// Export reducer
export default alertSlice.reducer;
