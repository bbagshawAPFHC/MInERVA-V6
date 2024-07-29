import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import SearchPatients from './pages/SearchPatients/SearchPatients';
import Settings from './pages/Settings/Settings';
import LoginPage from './pages/Login/LoginPage';

const drawerWidth = 240;

const AuthenticatedContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
        <Box
  component="main"
  sx={{
    flexGrow: 1,
    p: 3,
    width: { sm: `calc(100% - ${isSidebarOpen ? drawerWidth : 64}px)` },
    ml: { sm: `${isSidebarOpen ? drawerWidth : 64}px` },
    transition: theme =>
      theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
  }}
>
  <Toolbar /> {/* This toolbar is for spacing, pushing content below the AppBar */}
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/search" element={<SearchPatients />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</Box>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  const { instance } = useMsal();

  return (
    <Router>
      <CssBaseline />
      <AuthenticatedTemplate>
        <AuthenticatedContent />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <LoginPage msalInstance={instance} />
        </Box>
      </UnauthenticatedTemplate>
    </Router>
  );
};

export default App;