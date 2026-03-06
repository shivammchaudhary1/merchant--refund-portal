import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  Divider,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const Footer = () => {
  const navigationLinks = [
    { label: "About", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact", href: "#" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.dark",
        color: "common.white",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={3}
        >
          {/* Brand */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "common.white",
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 24, mr: 1 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.05rem",
                letterSpacing: "-0.02em",
              }}
            >
              Merchant Refund Portal
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Stack direction="row" flexWrap="wrap" spacing={{ xs: 2, md: 3 }}>
            {navigationLinks.map((link, index) => (
              <MuiLink
                key={index}
                href={link.href}
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "common.white",
                  },
                }}
              >
                {link.label}
              </MuiLink>
            ))}
          </Stack>
        </Stack>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}
        >
          &copy; {new Date().getFullYear()} Merchant Refund Portal. All Rights
          Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
