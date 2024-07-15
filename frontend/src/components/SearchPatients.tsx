import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { IconSearch, IconFile, IconFileText, IconPhoto, IconChevronDown, IconChevronRight, IconDownload } from '@tabler/icons-react';
import debounce from 'lodash/debounce';
import { searchPatients, getPatientDetails, getPatientFileReferences, downloadFile } from '../utils/api';
import { Patient, PatientFile } from '../types';
import axios from 'axios';

const SearchPatients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [patientFiles, setPatientFiles] = useState<PatientFile[]>([]);
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [selectedFilesByType, setSelectedFilesByType] = useState<Record<string, Set<string>>>({});
  const [isSelectAllCheckedByType, setIsSelectAllCheckedByType] = useState<Record<string, boolean>>({});
  const resultsPerPage = 20;

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
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message || 'Error fetching patient data');
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
    setPatientData(null);
  };

  const fetchPatientDetails = useCallback(async (athenapatientid: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPatientDetails(athenapatientid);
      setPatientData(data);
      setSelectedCollection(Object.keys(data)[0]);
    } catch (err: any) {
      setError(err.message || 'Error fetching patient details');
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
    } catch (err: any) {
      console.error('Error fetching patient files:', err);
      setError(err.message || 'Error fetching patient files');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleExpand = (fileType: string) => {
    setExpandedTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileType)) {
        newSet.delete(fileType);
      } else {
        newSet.add(fileType);
      }
      return newSet;
    });
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <IconFileText className="w-6 h-6 text-red-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <IconPhoto className="w-6 h-6 text-blue-500" />;
      default:
        return <IconFile className="w-6 h-6 text-gray-500" />;
    }
  };

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

    const data = patientData[selectedCollection];
    return data.map((item: any, index: number) => (
      <table key={index} className="table-auto w-full bg-white shadow-md rounded mb-4">
        <thead>
          <tr>
            {Object.keys(item).map((key) => (
              <th key={key} className="px-4 py-2 border">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.values(item).map((value, i) => (
              <td key={i} className="px-4 py-2 border">{JSON.stringify(value, null, 2)}</td>
            ))}
          </tr>
        </tbody>
      </table>
    ));
  };

  const renderFiles = () => {
    if (patientFiles.length === 0) {
      return <p>No files found for this patient.</p>;
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
      <div className="space-y-4">
        {Object.entries(groupedFiles).map(([fileType, files]) => (
          <div key={fileType} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-4 flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-2">
                {fileType === 'PDF' ? <IconFileText className="w-6 h-6 text-red-500" /> : <IconPhoto className="w-6 h-6 text-blue-500" />}
                <span className="font-semibold">{fileType} Files ({files.length})</span>
              </div>
              <IconChevronDown className="w-5 h-5" />
            </div>
            <div className="p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        title="Select all files of this type for download"
                        type="checkbox"
                        checked={isSelectAllCheckedByType[fileType] || false}
                        onChange={() => handleSelectAllChange(fileType)}
                        className="form-checkbox h-5 w-5 text-[#00b7be]"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file, index) => {
                    const relativePath = file.filePath.replace(`${import.meta.env.EXPORT_FILES_PATH}`, '').replace(/^[\\/]/, '');
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            title="Select file for download"
                            type="checkbox"
                            checked={selectedFilesByType[fileType]?.has(relativePath) || false}
                            onChange={() => handleFileSelection(file)}
                            className="form-checkbox h-5 w-5 text-[#00b7be]"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{file.filename}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{file.collection}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleFileDownload(file.filePath)}
                            className="px-4 py-2 bg-[#00b7be] text-white rounded-lg hover:bg-[#00a0a6] transition-colors duration-200"
                            aria-label={`Download ${file.filename}`}
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTabs = () => {
    if (!patientData) return null;
    return (
      <div className="mb-4">
        {Object.keys(patientData).map((collection) => (
          <button
            key={collection}
            onClick={() => setSelectedCollection(collection)}
            className={`px-4 py-2 mr-2 ${selectedCollection === collection ? 'bg-[#00b7be] text-white' : 'bg-gray-200'}`}
          >
            {collection}
          </button>
        ))}
        <button
          onClick={() => setSelectedCollection('files')}
          className={`px-4 py-2 mr-2 ${selectedCollection === 'files' ? 'bg-[#00b7be] text-white' : 'bg-gray-200'}`}
        >
          Files
        </button>
        <button
          onClick={() => setSelectedCollection('filesSummary')}
          className={`px-4 py-2 mr-2 ${selectedCollection === 'filesSummary' ? 'bg-[#00b7be] text-white' : 'bg-gray-200'}`}
        >
          Files Summary
        </button>
      </div>
    );
  };

  const renderFilesSummary = () => {
    const fileCounts = patientFiles.reduce((acc, file) => {
      acc[file.collection] = (acc[file.collection] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Files Summary</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(fileCounts).map(([fileType, count]) => (
              <tr key={fileType}>
                <td className="px-6 py-4 whitespace-nowrap">{fileType}</td>
                <td className="px-6 py-4 whitespace-nowrap">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4">Total files: {patientFiles.length}</p>
      </div>
    );
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  return (
    <div className="flex flex-col h-full">
      <div className={`bg-white shadow-md transition-all duration-300 ease-in-out ${hasSearched ? 'py-4' : 'py-20'}`}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search patients by first name, last name, or Athena ID..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00b7be] focus:border-transparent transition duration-200 pl-10"
              />
              <IconSearch className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="ml-2 px-4 py-3 bg-gradient-to-r from-[#00b7be] to-[#00a0a6] text-white rounded-lg" title="Button Text">
              <IconSearch className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {loading && <p className="text-center text-gray-600">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!selectedPatient && searchResults.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Athena ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentResults.map((patient: Patient, index: number) => (
                    <tr key={index} onClick={() => handlePatientClick(patient.patientdetails.athenapatientid)} className="cursor-pointer hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{patient.patientdetails.firstname}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.patientdetails.lastname}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.patientdetails.dob}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.patientdetails.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.patientdetails.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.patientdetails.athenapatientid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-[#00b7be] text-white rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-[#00b7be] text-white rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
          {selectedPatient && patientData && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-600">Patient Details</h2>
              {renderTabs()}
              <div className="mb-4 flex justify-between items-center">
                <button
                  onClick={downloadSelected}
                  disabled={isDownloading || Object.values(selectedFilesByType).every(set => set.size === 0)}
                  className={`px-4 py-2 bg-[#00b7be] text-white rounded-lg flex items-center ${
                    isDownloading || Object.values(selectedFilesByType).every(set => set.size === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00a0a6]'
                  } transition-colors duration-200`}
                >
                  <IconDownload className="w-5 h-5 mr-2" />
                  {isDownloading ? 'Downloading...' : `Download Selected (${Object.values(selectedFilesByType).reduce((sum, set) => sum + set.size, 0)})`}
                </button>
              </div>
              {renderData()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPatients;
