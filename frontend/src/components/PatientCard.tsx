import React from 'react';

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    dob: string;
    gender: string;
    address: string;
  };
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">{patient.name}</h2>
      <p className="text-gray-600">ID: {patient.id}</p>
      <p className="text-gray-600">DOB: {patient.dob}</p>
      <p className="text-gray-600">Gender: {patient.gender}</p>
      <p className="text-gray-600">Address: {patient.address}</p>
    </div>
  );
};

export default PatientCard;