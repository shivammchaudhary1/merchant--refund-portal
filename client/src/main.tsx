import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { store } from "./app/store.ts";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./styles/theme.ts";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>,
);
