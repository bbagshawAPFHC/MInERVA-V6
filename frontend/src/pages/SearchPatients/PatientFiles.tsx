// PatientFiles.tsx
import React, { useState } from 'react';
import { Box, Paper, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Button, IconButton } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { PatientFile } from '../../types';
import { downloadFile } from '../../utils/api';

interface PatientFilesProps {
  patientFiles: PatientFile[];
  selectedFilesByType: Record<string, Set<string>>;
  setSelectedFilesByType: React.Dispatch<React.SetStateAction<Record<string, Set<string>>>>;
}

const PatientFiles: React.FC<PatientFilesProps> = ({ patientFiles, selectedFilesByType, setSelectedFilesByType }) => {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());
  const [isSelectAllCheckedByType, setIsSelectAllCheckedByType] = useState<Record<string, boolean>>({});

  const groupedFiles = patientFiles.reduce((acc, file) => {
    const fileType = file.filetype.toUpperCase();
    if (!acc[fileType]) {
      acc[fileType] = [];
    }
    acc[fileType].push(file);
    return acc;
  }, {} as Record<string, PatientFile[]>);

  const handleFileSelection = (file: PatientFile) => {
    const fileType = file.filetype.toUpperCase();
    const relativePath = file.filePath.replace(`${import.meta.env.EXPORT_FILES_PATH}`, '').replace(/^[\\/]/, '');
    
    setSelectedFilesByType(prev => {
      const newSelected = new Set(prev[fileType] || []);
      if (newSelected.has(relativePath)) {
        newSelected.delete(relativePath);
      } else {
        newSelected.add(relativePath);
      }
      return { ...prev, [fileType]: newSelected };
    });
  };

  const handleSelectAllChange = (fileType: string) => {
    setIsSelectAllCheckedByType(prev => ({ ...prev, [fileType]: !prev[fileType] }));
    
    const filesOfType = patientFiles.filter(file => file.filetype.toUpperCase() === fileType);
    
    if (!isSelectAllCheckedByType[fileType]) {
      const allFilePaths = filesOfType.map(file => 
        file.filePath.replace(`${import.meta.env.EXPORT_FILES_PATH}`, '').replace(/^[\\/]/, '')
      );
      setSelectedFilesByType(prev => ({ ...prev, [fileType]: new Set(allFilePaths) }));
    } else {
      setSelectedFilesByType(prev => ({ ...prev, [fileType]: new Set() }));
    }
  };

  const handleFileDownload = async (filePath: string) => {
    try {
      const blob = await downloadFile(filePath);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filePath.split('/').pop() || 'file');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <Box>
      {Object.entries(groupedFiles).map(([fileType, files]) => (
        <Paper key={fileType} sx={{ mb: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: 'grey.100', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{fileType} Files ({files.length})</Typography>
            <IconButton onClick={() => setExpandedTypes(prev => {
              const newSet = new Set(prev);
              if (newSet.has(fileType)) {
                newSet.delete(fileType);
              } else {
                newSet.add(fileType);
              }
              return newSet;
            })}>
              {expandedTypes.has(fileType) ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>
          {expandedTypes.has(fileType) && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelectAllCheckedByType[fileType] || false}
                        onChange={() => handleSelectAllChange(fileType)}
                      />
                    </TableCell>
                    <TableCell>File Name</TableCell>
                    <TableCell>Collection</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {files.map((file, index) => {
                    const relativePath = file.filePath.replace(`${import.meta.env.EXPORT_FILES_PATH}`, '').replace(/^[\\/]/, '');
                    return (
                      <TableRow key={index}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedFilesByType[fileType]?.has(relativePath) || false}
                            onChange={() => handleFileSelection(file)}
                          />
                        </TableCell>
                        <TableCell>{file.filename}</TableCell>
                        <TableCell>{file.collection}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleFileDownload(file.filePath)}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default PatientFiles;