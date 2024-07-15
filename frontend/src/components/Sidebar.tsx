import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconX } from '@tabler/icons-react';

const Sidebar: React.FC = () => {
  const [openPatients, setOpenPatients] = useState<string[]>([]);
  const location = useLocation();

  const closePatient = (patientId: string) => {
    setOpenPatients(openPatients.filter(id => id !== patientId));
  };

  return (
    <aside className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav>
        <Link to="/" className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === '/' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>Dashboard</Link>
        <Link to="/patient-search" className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname === '/patient-search' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>Patient Search</Link>
        {openPatients.map(patientId => (
          <div key={patientId} className="relative">
            <Link to={`/patient/${patientId}`} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              {patientId}
            </Link>
            <button 
              onClick={() => closePatient(patientId)} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <IconX size={16} />
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;