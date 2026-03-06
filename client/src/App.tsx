import { Box } from "@mui/material";
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
    </Box>
  );
}

export default App;
