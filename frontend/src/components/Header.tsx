import React, { useState, useEffect } from 'react';
import { IconBell, IconChevronDown, IconMenu2 } from '@tabler/icons-react';
import { useMsal } from '@azure/msal-react';

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('Guest');
  const { accounts, instance } = useMsal();

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

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="minerva_256.png" alt="MINERVA Logo" className="w-8 h-8 mr-2" />
            <span className="text-xl font-light text-gray-800">MInERVA</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-[#00b7be] transition-colors duration-200" title="Button Text">
              <IconBell size={24} />
            </button>
            <div className="relative">
              <button
                className="flex items-center space-x-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b7be] focus:ring-offset-2 rounded-full"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={profilePicUrl || 'https://via.placeholder.com/150'}
                  alt="User profile"
                />
                <span className="text-gray-700 hidden md:inline">{firstName}</span>
                <IconChevronDown size={16} className="text-gray-400" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                  {['Your Profile', 'Settings', 'Sign out'].map((item) => (
                    <button key={item} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button className="md:hidden text-gray-400 hover:text-[#00b7be] transition-colors duration-200" title="Menu">
            <IconMenu2 size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;