// SearchResults.tsx
import React from 'react';
import { Paper, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Box, Pagination } from '@mui/material';
import { Patient } from '../../types';

interface SearchResultsProps {
  searchResults: Patient[];
  currentPage: number;
  resultsPerPage: number;
  onPatientClick: (athenapatientid: string) => void;
  onPageChange: (value: number) => void;
  totalPages: number; // Add this line
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  currentPage,
  resultsPerPage,
  onPatientClick,
  onPageChange,
  totalPages, // Add this line
}) => {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Search Results</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Athena ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.map((patient: Patient) => (
              <TableRow 
                key={patient.patientdetails.athenapatientid} 
                onClick={() => onPatientClick(patient.patientdetails.athenapatientid)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell>{patient.patientdetails.firstname}</TableCell>
                <TableCell>{patient.patientdetails.lastname}</TableCell>
                <TableCell>{patient.patientdetails.dob}</TableCell>
                <TableCell>{patient.patientdetails.age}</TableCell>
                <TableCell>{patient.patientdetails.gender}</TableCell>
                <TableCell>{patient.patientdetails.athenapatientid}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination 
          count={totalPages} 
          page={currentPage} 
          onChange={(event, value) => onPageChange(value)}
        />
      </Box>
    </Paper>
  );
};

export default SearchResults;