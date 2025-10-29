import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/api";
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
  CircularProgress,
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

const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
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
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setDialog({
        open: true,
        type: "success",
        title: "Registration Successful!",
        message:
          "Your account has been created successfully. You can now login.",
      });
    },
    onError: (error: Error) => {
      setDialog({
        open: true,
        type: "error",
        title: "Registration Failed",
        message: error.message || "An error occurred during registration.",
      });
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    mutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  const handleDialogClose = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };

  const handleSuccessConfirm = () => {
    setDialog((prev) => ({ ...prev, open: false }));
    navigate("/login");
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
                Create an account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter your details to sign up
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
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={mutation.isPending}
                    sx={{ py: 1.5 }}
                  >
                    {mutation.isPending ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                  <Typography variant="body2" textAlign="center">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      style={{ color: "#1976d2", textDecoration: "none" }}
                    >
                      Login
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

export default SignUp;
