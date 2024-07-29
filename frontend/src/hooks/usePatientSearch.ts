import { useState, useEffect } from 'react';
import { searchPatients, getPatientDetails, getPatientFileReferences } from '../utils/api';
import { Patient, PatientFile } from '../types';

export const usePatientSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [patientFiles, setPatientFiles] = useState<PatientFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      searchPatients(searchTerm, 1000) // Pass the limit value (e.g., 10) here
        .then(results => setSearchResults(results))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [searchTerm]);

  const fetchPatientDetails = (patientId: string) => {
    setLoading(true);
    getPatientDetails(patientId)
      .then(data => setPatientData(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const fetchPatientFiles = (patientId: string) => {
    setLoading(true);
    getPatientFileReferences(patientId, 1000) // Pass the limit value (e.g., 5) here
      .then(files => setPatientFiles(files))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    selectedPatient,
    setSelectedPatient,
    patientData,
    patientFiles,
    loading,
    error,
    fetchPatientDetails,
    fetchPatientFiles,
  };
};
