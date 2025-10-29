import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Container,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const GradientBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 400,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[8],
}));

const Home = () => {
  return (
    <GradientBox>
      <Container maxWidth="sm">
        <StyledCard>
          <CardHeader sx={{ textAlign: "center", pb: 1 }}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Welcome to Auth System
            </Typography>
            <Typography variant="h6" color="text.secondary">
              A complete user registration and authentication system
            </Typography>
          </CardHeader>
          <CardContent>
            <Stack spacing={2}>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Sign Up
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Login
              </Button>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ mt: 3 }}
            >
              Built with Spring Boot, React, and Material-UI
            </Typography>
          </CardContent>
        </StyledCard>
      </Container>
    </GradientBox>
  );
};

export default Home;
