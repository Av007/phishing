import { useState, FormEvent, ChangeEvent } from 'react';
import { AxiosError } from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Link,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';
import { api } from '../helpers/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await api.post(`api/auth/login`, {
        email,
        password,
      });
      const token = data.access_token;

      localStorage.setItem('token', token);
      setToken(token);

      const { data: user } = await api.get('/api/auth/me');
      localStorage.setItem('email', user?.email);

      navigate('/', { replace: true });
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data && e.response?.data?.message);
      } else {
        const error = e as Error;
        setError(error.message);
      }
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
          borderRadius: 1,
          boxShadow: 3,
          width: '100%',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="text"
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            sx={{ marginTop: '1rem' }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body2" sx={{ marginTop: '1rem' }}>
          Need access?{' '}
          <Link component={RouterLink} to="/register">
            Register
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
