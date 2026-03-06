import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import {
  Security,
  Speed,
  Support,
  Analytics,
  Payment,
  Monitor,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: <Security sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Secure Transactions",
      description:
        "Enterprise-grade security with end-to-end encryption for all your payment transactions.",
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Lightning Fast",
      description:
        "Process payments in milliseconds with our optimized infrastructure and global network.",
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Advanced Analytics",
      description:
        "Get detailed insights and analytics to understand your business performance better.",
    },
    {
      icon: <Payment sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Multiple Payment Methods",
      description:
        "Support for credit cards, digital wallets, and cryptocurrency payments.",
    },
    {
      icon: <Monitor sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Real-time Monitoring",
      description:
        "Monitor all transactions in real-time with our comprehensive dashboard.",
    },
    {
      icon: <Support sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support to help you whenever you need assistance.",
    },
  ];

  const stats = [
    { number: "10M+", label: "Transactions Processed" },
    { number: "50K+", label: "Active Merchants" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "150+", label: "Countries Supported" },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "common.white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 20% 80%, rgba(74,111,165,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(53,88,114,0.3) 0%, transparent 60%)",
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Stack alignItems="center" textAlign="center" spacing={3}>
            <Chip
              label="Trusted by 50K+ Merchants"
              sx={{
                bgcolor: "rgba(255,255,255,0.12)",
                color: "common.white",
                fontWeight: 500,
                fontSize: "0.8rem",
                px: 1,
              }}
            />
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.25rem" },
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              Modern Payment Solutions
              <br />
              for Your Business
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.85,
                maxWidth: 540,
                fontWeight: 400,
                fontSize: { xs: "1rem", md: "1.15rem" },
                lineHeight: 1.6,
              }}
            >
              Streamline your payment processing with our secure, fast, and
              reliable platform. Manage refunds effortlessly.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ pt: 1 }}
            >
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "common.white",
                  color: "primary.main",
                  fontWeight: 600,
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
                }}
              >
                Get Started
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "rgba(255,255,255,0.5)",
                  color: "common.white",
                  fontWeight: 600,
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "common.white",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4} textAlign="center">
          {stats.map((stat, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  fontSize: { xs: "1.8rem", md: "2.4rem" },
                  mb: 0.5,
                }}
              >
                {stat.number}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.9rem" }}
              >
                {stat.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* Features Section */}
      <Box sx={{ bgcolor: "grey.50", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip
              label="Features"
              color="primary"
              size="small"
              sx={{ mb: 2, fontWeight: 600 }}
            />
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 1.5,
                color: "text.primary",
                fontSize: { xs: "1.6rem", md: "2rem" },
              }}
            >
              Why Choose Our Platform
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 520, mx: "auto", lineHeight: 1.7 }}
            >
              Discover the features that make our payment platform the preferred
              choice for businesses worldwide.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    transition: "all 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(16,55,102,0.1)",
                      borderColor: "primary.light",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.5, textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: "rgba(16,55,102,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ mb: 1, fontWeight: 600, fontSize: "1rem" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "text.primary",
              fontSize: { xs: "1.5rem", md: "1.85rem" },
            }}
          >
            Ready to Transform Your Business?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.7 }}
          >
            Join thousands of merchants who trust our platform for their payment
            processing needs. Start accepting payments today.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              Contact Sales
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
