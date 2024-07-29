import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { AuthenticationResult, IPublicClientApplication } from '@azure/msal-browser';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Container,
  Avatar,
  CssBaseline,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getLoginRequest } from '../../services/authService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
}));

const Logo = styled('img')({
  width: '120px',
  height: '120px',
  marginBottom: '1rem',
});

interface LoginPageProps {
  msalInstance: IPublicClientApplication;
}

const LoginPage: React.FC<LoginPageProps> = ({ msalInstance }) => {
  const { instance } = useMsal();
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    const currentLoginRequest = getLoginRequest(email);

    instance.loginPopup(currentLoginRequest).then((response: AuthenticationResult) => {
      console.log("Login successful", response);
      // Handle login success, e.g., setting user state or redirecting
    }).catch((e: Error) => {
      console.error("Login failed", e);
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Fade in={true} timeout={1000}>
        <StyledPaper elevation={6}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Logo src="minerva_1024.png" alt="MINERVA Logo" />
          <Typography component="h1" variant="h4" gutterBottom>
            MInERVA
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
            Secure access to patient records
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" paragraph>
            Medical Information and Electronic Record Vault Application
          </Typography>
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: <EmailIcon color="action" />,
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              endIcon={<ArrowForwardIcon />}
            >
              Sign in with Entra ID
            </Button>
          </Box>
        </StyledPaper>
      </Fade>
    </Container>
  );
};

export default LoginPage;