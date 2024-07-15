import React, { useCallback, useEffect } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import axios from 'axios';
import './App.css';
import LoginPage from './components/LoginPage';
import SearchPatients from './components/SearchPatients';
import Header from './components/Header';

const App: React.FC = () => {
  const { instance, inProgress } = useMsal();

  const getAccessToken = useCallback(async () => {
    if (inProgress !== InteractionStatus.None) {
      return null;
    }

    try {
      const account = instance.getAllAccounts()[0];
      if (account) {
        const response = await instance.acquireTokenSilent({
          scopes: ['User.Read'],
          account: account
        });
        return response.accessToken;
      }
    } catch (error) {
      console.error('Error acquiring token:', error);
    }
    return null;
  }, [instance, inProgress]);

  useEffect(() => {
    const configureAxios = async () => {
      const token = await getAccessToken();
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    };

    configureAxios();
  }, [getAccessToken]);

  return (
    <div className="flex flex-col h-screen">
      <AuthenticatedTemplate>
        <Header />
        <main className="flex-grow overflow-hidden">
          <SearchPatients />
        </main>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div className="flex items-center justify-center h-full">
          <LoginPage />
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
};

export default App;