import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  TextField, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Box, Tabs, Tab, Checkbox, CircularProgress, Alert, Pagination, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import debounce from 'lodash/debounce';
import { searchPatients, getPatientDetails, getPatientFileReferences, downloadFile } from '../utils/api';
import { Patient, PatientFile } from '../types';
import axios from 'axios';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const SearchPatients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<Record<string, unknown>>({}); // Changed from any
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientFiles, setPatientFiles] = useState<PatientFile[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFilesByType, setSelectedFilesByType] = useState<Record<string, Set<string>>>({});
  const [isSelectAllCheckedByType, setIsSelectAllCheckedByType] = useState<Record<string, boolean>>({});
  const resultsPerPage = 20;

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  const performSearch = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchPatients(query);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching patient data');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((query: string) => performSearch(query), 300),
    [performSearch]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setSelectedPatient(null);
    setPatientData({});
  };

  const fetchPatientDetails = useCallback(async (athenapatientid: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPatientDetails(athenapatientid);
      setPatientData(data);
      setSelectedCollection(Object.keys(data)[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching patient details');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPatientFiles = useCallback(async (athenapatientid: string) => {
    setLoading(true);
    setError(null);

    try {
      const files = await getPatientFileReferences(athenapatientid);
      setPatientFiles(files);
    } catch (err) {
      console.error('Error fetching patient files:', err);
      setError(err instanceof Error ? err.message : 'Error fetching patient files');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePatientClick = (athenapatientid: string) => {
    setSelectedPatient(athenapatientid);
    fetchPatientDetails(athenapatientid);
    fetchPatientFiles(athenapatientid);
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

  const downloadSelected = async () => {
    const allSelectedFiles = Object.values(selectedFilesByType).flatMap(set => [...set]);
    
    if (allSelectedFiles.length === 0) {
      alert('Please select files to download');
      return;
    }

    setIsDownloading(true);
    try {
      const response = await axios.post('/api/bulk-download', {
        patientId: selectedPatient,
        fileIds: allSelectedFiles
      }, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `patient_${selectedPatient}_files.zip`);
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

  const renderData = () => {
    if (selectedCollection === 'files') {
      return renderFiles();
    }
    if (selectedCollection === 'filesSummary') {
      return renderFilesSummary();
    }
    if (!selectedCollection || !patientData[selectedCollection]) {
      return null;
    }

    const data = patientData[selectedCollection] as Record<string, unknown>[];
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(data[0]).map((key) => (
                <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {Object.values(item).map((value, i) => (
                  <TableCell key={i}>{JSON.stringify(value, null, 2)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderFiles = () => {
    if (patientFiles.length === 0) {
      return <Typography>No files found for this patient.</Typography>;
    }
  
    const groupedFiles = patientFiles.reduce((acc, file) => {
      const fileType = file.filetype.toUpperCase();
      if (!acc[fileType]) {
        acc[fileType] = [];
      }
      acc[fileType].push(file);
      return acc;
    }, {} as Record<string, PatientFile[]>);

    return (
      <Box>
      {Object.entries(groupedFiles).map(([fileType, files]) => (
        <Accordion key={fileType}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center">
              {fileType === 'PDF' ? <PictureAsPdfIcon color="error" /> : 
               fileType === 'PNG' || fileType === 'JPG' || fileType === 'JPEG' ? <ImageIcon color="primary" /> :
               <InsertDriveFileIcon color="action" />}
              <Typography variant="subtitle1" ml={1}>
                {fileType} Files ({files.length})
              </Typography>
            </Box>
          </AccordionSummary>
            <AccordionDetails>
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
                              color="primary"
                              onClick={() => handleFileDownload(file.filePath)}
                              startIcon={<FileDownloadIcon />}
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
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };

  const renderTabs = () => {
    if (!patientData) return null;
    return (
      <Tabs
        value={selectedCollection}
        onChange={(_, newValue) => setSelectedCollection(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {Object.keys(patientData).map((collection) => (
          <Tab key={collection} label={collection} value={collection} />
        ))}
        <Tab label="Files" value="files" />
        <Tab label="Files Summary" value="filesSummary" />
      </Tabs>
    );
  };

  const renderFilesSummary = () => {
    const fileCounts = patientFiles.reduce((acc, file) => {
      acc[file.collection] = (acc[file.collection] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Files Summary</Typography>
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
        <Typography variant="body2" mt={2}>Total files: {patientFiles.length}</Typography>
      </Paper>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          transition: 'all 0.3s',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledTextField
            fullWidth
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search patients by first name, last name, or Athena ID..."
            variant="outlined"
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
          />
          <IconButton color="primary" sx={{ ml: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Paper>

      <Box sx={{ flexGrow: 1, overflow: 'auto', px: 2 }}>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!selectedPatient && searchResults.length > 0 && (
          <Paper elevation={3} sx={{ p: 2 }}>
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
                  {currentResults.map((patient: Patient, index: number) => (
                    <TableRow
                      key={index}
                      onClick={() => handlePatientClick(patient.patientdetails.athenapatientid)}
                      hover
                      sx={{ cursor: 'pointer' }}
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

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                />
              </Box>
            )}
          </Paper>
        )}

        {selectedPatient && patientData && (
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>Patient Details</Typography>
            {renderTabs()}
            <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FileDownloadIcon />}
                onClick={downloadSelected}
                disabled={isDownloading || Object.values(selectedFilesByType).every(set => set.size === 0)}
              >
                {isDownloading ? 'Downloading...' : `Download Selected (${Object.values(selectedFilesByType).reduce((sum, set) => sum + set.size, 0)})`}
              </Button>
            </Box>
            {renderData()}
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default SearchPatients;