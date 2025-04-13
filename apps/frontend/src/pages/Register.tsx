import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Link,
} from "@mui/material";
import { useAuth } from "../provider/AuthProvider";
import {api} from "../helpers/api";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { data } = await api.post(`api/auth/register`, {
        email,
        password,
      });
      
      const token = data.access;
      localStorage.setItem("token", token);
      localStorage.setItem("email", data.email);
      setToken(token);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      setError("Registration failed. Email may already be in use.");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem",
          borderRadius: 1,
          boxShadow: 3,
          width: "100%",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>

        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            sx={{ marginTop: "1rem" }}
          >
            Register
          </Button>
        </form>
        <Typography variant="body2" sx={{ marginTop: "1rem" }}>
          Already have an account?{" "}
          <Link component={RouterLink} to="/login">
            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
