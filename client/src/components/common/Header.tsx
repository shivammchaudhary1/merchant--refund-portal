import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Stack,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Register", to: "/register" },
    { label: "Login", to: "/login" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "primary.dark",
        borderBottom: "1px solid",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 0.5 }}>
          {/* Brand */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "common.white",
              mr: 4,
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 28, mr: 1 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                fontSize: "1.15rem",
                whiteSpace: "nowrap",
              }}
            >
              Merchant Refund Portal
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation */}
          <Stack direction="row" spacing={0.5}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Button
                  key={item.to}
                  component={Link}
                  to={item.to}
                  sx={{
                    color: "common.white",
                    textTransform: "none",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "0.9rem",
                    px: 2,
                    py: 0.75,
                    borderRadius: 1.5,
                    position: "relative",
                    bgcolor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.12)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
