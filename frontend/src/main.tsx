import React from 'react';
import ReactDOM from 'react-dom/client';
import { MsalProvider } from "@azure/msal-react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PublicClientApplication } from "@azure/msal-browser";
import App from './App';

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </MsalProvider>
  </React.StrictMode>,
);