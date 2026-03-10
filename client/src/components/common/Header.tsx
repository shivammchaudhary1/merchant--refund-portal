import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/store";
import { setLogout } from "../../app/slices/authSlice";
import { useNotifications } from "../../utils/notifications";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notify } = useNotifications();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(setLogout());
    setAnchorEl(null);
    navigate("/login");
    notify("success", "Logged out successfully!");
  };

  // Navigation items for unauthenticated users
  const publicNavItems = [
    { label: "Home", to: "/" },
    { label: "Register", to: "/register" },
    { label: "Login", to: "/login" },
  ];

  // Navigation items for authenticated users
  const protectedNavItems = [
    { label: "Home", to: "/" },
    { label: "Transactions", to: "/transactions" },
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

          {/* Navigation - Conditional based on authentication */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            {/* Always show navigation items based on auth state */}
            {(isAuthenticated ? protectedNavItems : publicNavItems).map(
              (item) => {
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
                      bgcolor: isActive
                        ? "rgba(255,255,255,0.1)"
                        : "transparent",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.12)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              },
            )}

            {/* User Menu for authenticated users */}
            {isAuthenticated && (
              <>
                <Button
                  onClick={handleUserMenuClick}
                  endIcon={<ExpandMoreIcon />}
                  startIcon={<PersonIcon />}
                  sx={{
                    color: "common.white",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    px: 2,
                    py: 0.75,
                    ml: 1,
                    borderRadius: 1.5,
                    bgcolor: open ? "rgba(255,255,255,0.1)" : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.12)",
                    },
                  }}
                >
                  {user?.businessName || user?.email || "User"}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  id="user-menu"
                  open={open}
                  onClose={handleUserMenuClose}
                  onClick={handleUserMenuClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleLogout} sx={{ minWidth: 150 }}>
                    <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
