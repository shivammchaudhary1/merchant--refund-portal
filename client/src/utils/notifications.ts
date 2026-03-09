import { useAppDispatch } from "../app/store";
import { showNotification } from "../app/slices/alertSlice";
import type { AlertType } from "../app/slices/alertSlice";

// Custom hook for easy notification usage
export const useNotifications = () => {
  const dispatch = useAppDispatch();

  const notify = (type: AlertType, message: string) => {
    dispatch(showNotification({ type, message }));
  };

  return {
    success: (message: string) => notify("success", message),
    fail: (message: string) => notify("fail", message),
    warning: (message: string) => notify("warning", message),
    // Generic notify function for direct usage
    notify,
  };
};

// Alternative: Direct utility functions (if you prefer not to use hooks)
export const notifications = {
  notify: (dispatch: any) => (type: AlertType, message: string) =>
    dispatch(showNotification({ type, message })),
  success: (dispatch: any) => (message: string) =>
    dispatch(showNotification({ type: "success", message })),
  fail: (dispatch: any) => (message: string) =>
    dispatch(showNotification({ type: "fail", message })),
  warning: (dispatch: any) => (message: string) =>
    dispatch(showNotification({ type: "warning", message })),
};
