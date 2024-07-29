import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Container,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  height: 64,
  [theme.breakpoints.up('sm')]: {
    height: 70,
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& img': {
    width: 32,
    height: 32,
    marginRight: theme.spacing(1),
  },
}));

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const ProfileButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5, 1),
}));

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('Guest');
  const { accounts, instance } = useMsal();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchUserData = async () => {
      if (accounts.length === 0) return;

      try {
        const accessToken = await instance.acquireTokenSilent({
          scopes: ['User.Read'],
          account: accounts[0],
        });

        // Fetch user profile data
        const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: {
            'Authorization': `Bearer ${accessToken.accessToken}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setFirstName(userData.givenName || 'Guest');
        } else {
          console.error('Failed to fetch user data:', userResponse.statusText);
        }

        // Fetch profile picture
        const pictureResponse = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
          headers: {
            'Authorization': `Bearer ${accessToken.accessToken}`,
          },
        });

        if (pictureResponse.ok) {
          const blob = await pictureResponse.blob();
          const imageUrl = URL.createObjectURL(blob);
          setProfilePicUrl(imageUrl);
        } else {
          console.error('Failed to fetch profile picture:', pictureResponse.statusText);
          setProfilePicUrl('https://via.placeholder.com/150');
        }
      } catch (error) {
        console.error('Error acquiring token or fetching user data:', error);
        setProfilePicUrl('https://via.placeholder.com/150');
      }
    };

    fetchUserData();
  }, [accounts, instance]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="xl">
        <StyledToolbar disableGutters>
          <LogoContainer>
            <img src="minerva_256.png" alt="MINERVA Logo" />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 300 }}>
              MInERVA
            </Typography>
          </LogoContainer>

          <ActionsContainer>
            <Tooltip title="Notifications">
              <IconButton size="large" color="inherit">
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

            <ProfileButton onClick={handleMenuOpen}>
              <Avatar src={profilePicUrl || 'https://via.placeholder.com/150'} sx={{ width: 32, height: 32 }} />
              {!isMobile && (
                <Typography variant="subtitle1" sx={{ ml: 1, mr: 0.5 }}>
                  {firstName}
                </Typography>
              )}
              <KeyboardArrowDownIcon fontSize="small" />
            </ProfileButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem>Your Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Sign out</MenuItem>
            </Menu>

            {isMobile && (
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
            )}
          </ActionsContainer>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default Header;