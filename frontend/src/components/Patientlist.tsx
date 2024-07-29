import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Patient } from '../types';

interface PatientListProps {
  patients: Patient[];
  onPatientClick: (athenapatientid: string) => void;
}

const PatientList: React.FC<PatientListProps> = ({ patients, onPatientClick }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Gender</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map(patient => (
            <TableRow key={patient.id} onClick={() => onPatientClick(patient.id)}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.gender}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientList;