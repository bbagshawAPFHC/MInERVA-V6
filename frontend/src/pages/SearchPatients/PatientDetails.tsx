// PatientDetails.tsx
import React, { useState } from 'react';
import { Paper, Typography, Tabs, Tab, Box, Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { PatientFile } from '../../types';
import { bulkDownload } from '../../utils/api';
import PatientDataTable from './PatientDataTable';
import PatientFiles from './PatientFiles';
import FilesSummary from './FilesSummary';

interface PatientDetailsProps {
  patientData: any;
  patientFiles: PatientFile[];
  athenapatientid: string;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patientData, patientFiles, athenapatientid }) => {
  const [selectedCollection, setSelectedCollection] = useState<string>(Object.keys(patientData)[0]);
  const [selectedFilesByType, setSelectedFilesByType] = useState<Record<string, Set<string>>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadSelected = async () => {
    setIsDownloading(true);
    try {
      const allSelectedFiles = Object.values(selectedFilesByType).flatMap(set => [...set]);
      const blob = await bulkDownload(athenapatientid, allSelectedFiles);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `patient_${athenapatientid}_files.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download files. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Patient Details</Typography>
      <Tabs 
        value={selectedCollection} 
        onChange={(e, newValue) => setSelectedCollection(newValue as string)}
        sx={{ mb: 2 }}
      >
        {Object.keys(patientData).map((collection) => (
          <Tab key={collection} label={collection} value={collection} />
        ))}
        <Tab label="Files" value="files" />
        <Tab label="Files Summary" value="filesSummary" />
      </Tabs>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadSelected}
          disabled={isDownloading || Object.values(selectedFilesByType).every(set => set.size === 0)}
        >
          {isDownloading ? 'Downloading...' : `Download Selected (${Object.values(selectedFilesByType).reduce((sum, set) => sum + set.size, 0)})`}
        </Button>
      </Box>
      <Box sx={{ overflow: 'auto' }}>
        {selectedCollection === 'files' ? (
          <PatientFiles 
            patientFiles={patientFiles} 
            selectedFilesByType={selectedFilesByType}
            setSelectedFilesByType={setSelectedFilesByType}
          />
        ) : selectedCollection === 'filesSummary' ? (
          <FilesSummary patientFiles={patientFiles} />
        ) : (
          <PatientDataTable data={patientData[selectedCollection]} />
        )}
      </Box>
    </Paper>
  );
};

export default PatientDetails;