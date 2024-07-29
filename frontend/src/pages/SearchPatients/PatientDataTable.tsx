// PatientDataTable.tsx
import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography } from '@mui/material';

interface PatientDataTableProps {
  data: any[];
}

const PatientDataTable: React.FC<PatientDataTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography>No data available.</Typography>;
  }

  const keys = Object.keys(data[0]);

  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {keys.map((key) => (
              <TableCell key={key}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {keys.map((key) => (
                <TableCell key={key}>{JSON.stringify(item[key], null, 2)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientDataTable;