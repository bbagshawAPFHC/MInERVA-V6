// FilesSummary.tsx
import React from 'react';
import { Paper, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { PatientFile } from '../../types';

interface FilesSummaryProps {
  patientFiles: PatientFile[];
}

const FilesSummary: React.FC<FilesSummaryProps> = ({ patientFiles }) => {
  const fileCounts = patientFiles.reduce((acc, file) => {
    acc[file.collection] = (acc[file.collection] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Files Summary</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Type</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(fileCounts).map(([fileType, count]) => (
              <TableRow key={fileType}>
                <TableCell>{fileType}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography sx={{ mt: 2 }}>Total files: {patientFiles.length}</Typography>
    </Paper>
  );
};

export default FilesSummary;