// src/components/Layout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
        <motion.main
          className="flex-grow p-4 overflow-auto"
          initial={{ paddingLeft: isSidebarOpen ? '16rem' : '4rem' }}
          animate={{ paddingLeft: isSidebarOpen ? '16rem' : '4rem' }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;