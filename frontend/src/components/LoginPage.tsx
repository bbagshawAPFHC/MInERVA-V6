import React, { useState } from 'react';
import { IconMail, IconArrowRight } from '@tabler/icons-react';
import { useMsal } from '@azure/msal-react';
import { getLoginRequest } from '../services/authService';
import { AuthenticationResult } from '@azure/msal-browser';

const LoginPage: React.FC = () => {
  const { instance } = useMsal();
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    // Create a login request with the current email
    const currentLoginRequest = getLoginRequest(email);

    instance.loginPopup(currentLoginRequest).then((response: AuthenticationResult) => {
      console.log("Login successful", response);
      // Handle login success, e.g., setting user state or redirecting
    }).catch((e: Error) => {
      console.error("Login failed", e);
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <img src="minerva_1024.png" alt="MINERVA Logo" className="w-32 h-32 ml-0" />
          </div>
          <h2 className="text-2xl text-center text-gray-600 mb-2">MInERVA</h2>
          <p className="text-gray-600 text-center mb-4 font-light">
            Secure access to patient records
          </p>
          <p className="text-sm text-gray-400 text-center mb-8 font-light">
            Medical Information and Electronic Record Vault Application
          </p>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="space-y-6">
              <div>
                <div className="relative">
                  <input 
                    type="email" 
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-center w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00b7be] focus:border-transparent transition duration-200"
                    placeholder="Enter your email"
                  />
                  <IconMail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="mt-8">
              <button 
                type="submit"
                className="w-full bg-[#00b7be] text-white rounded-lg px-4 py-3 font-medium hover:bg-[#00a0a6] focus:outline-none focus:ring-2 focus:ring-[#00b7be] focus:ring-offset-2 transition duration-200 flex items-center justify-center"
              >
                Sign in with Entra ID
                <IconArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;