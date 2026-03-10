export type AlertType = "success" | "fail" | "warning";

export interface NotificationPayload {
  type: AlertType;
  message: string;
}

export interface AlertState {
  alerts: Array<{
    id: string;
    message: string;
    type: AlertType;
    timestamp: number;
  }>;
}
