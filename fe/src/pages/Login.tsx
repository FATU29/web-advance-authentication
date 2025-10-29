import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Container,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AlertDialog from "../components/AlertDialog";

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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<{
    open: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    // Mock login - no backend logic required as per requirements
    console.log("Login data:", data);
    setDialog({
      open: true,
      type: "success",
      title: "Login Successful!",
      message: "You have successfully logged in. (Mock functionality)",
    });
  };

  const handleDialogClose = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };

  const handleSuccessConfirm = () => {
    setDialog((prev) => ({ ...prev, open: false }));
    navigate("/");
  };

  return (
    <>
      <AlertDialog
        open={dialog.open}
        onClose={handleDialogClose}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.type === "success" ? handleSuccessConfirm : undefined}
      />
      <GradientBox>
        <Container maxWidth="sm">
          <StyledCard>
            <CardHeader sx={{ textAlign: "center", pb: 1 }}>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
                Welcome back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter your credentials to login
              </Typography>
            </CardHeader>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Login
                  </Button>
                  <Typography variant="body2" textAlign="center">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      style={{ color: "#1976d2", textDecoration: "none" }}
                    >
                      Sign up
                    </Link>
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </StyledCard>
        </Container>
      </GradientBox>
    </>
  );
};

export default Login;
