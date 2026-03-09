import React from "react";
import { Button, Stack } from "@mui/material";
import { useNotifications } from "../../utils/notifications";
// Alternative import approach:
// import { useAppDispatch } from "../../app/store";
// import { showNotification } from "../../app/slices/alertSlice";

const ExampleNotifications = () => {
  const { success, fail, warning, notify } = useNotifications();

  // Alternative approach without custom hook:
  // const dispatch = useAppDispatch();

  const handleSuccess = () => {
    success("Operation completed successfully!");
    // Or without hook: dispatch(showNotification({ type: "success", message: "Operation completed successfully!" }));
  };

  const handleFail = () => {
    fail("Something went wrong. Please try again.");
    // Or without hook: dispatch(showNotification({ type: "fail", message: "Something went wrong. Please try again." }));
  };

  const handleWarning = () => {
    warning("This action requires your attention.");
    // Or without hook: dispatch(showNotification({ type: "warning", message: "This action requires your attention." }));
  };

  const handleGeneric = () => {
    // Using the generic notify function
    notify("success", "Custom notification using generic function!");
  };

  return (
    <Stack direction="row" spacing={2} sx={{ p: 2 }}>
      <Button variant="contained" color="success" onClick={handleSuccess}>
        Show Success
      </Button>
      <Button variant="contained" color="error" onClick={handleFail}>
        Show Fail
      </Button>
      <Button variant="contained" color="warning" onClick={handleWarning}>
        Show Warning
      </Button>
      <Button variant="outlined" onClick={handleGeneric}>
        Generic Notify
      </Button>
    </Stack>
  );
};

export default ExampleNotifications;
