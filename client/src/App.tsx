import { Box } from "@mui/material";
import { Toaster } from "react-hot-toast";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        component="main"
        sx={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <AppRoutes />
      </Box>
      <Footer />

      {/* React Hot Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "#4caf50",
            },
          },
          error: {
            style: {
              background: "#f44336",
            },
          },
          loading: {
            style: {
              background: "#ff9800",
            },
          },
        }}
      />
    </Box>
  );
}

export default App;
