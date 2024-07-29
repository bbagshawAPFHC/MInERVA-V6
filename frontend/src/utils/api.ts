import axios, { AxiosError } from 'axios';
import { Patient, PatientFile } from '../types';

// src/utils/api.ts

export const searchPatients = async (query: string, limit?: number): Promise<Patient[]> => {
  try {
    const response = await axios.get(`http://localhost:5000/api/patients/search`, {
      params: { query, limit }
    });
    console.log(`Number of results found: ${response.data.length}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    throw new Error('Error fetching patient data');
  }
};

export const getPatientDetails = async (athenapatientid: string): Promise<any> => {
  try {
    const response = await axios.get(`http://localhost:5000/api/demographic/${athenapatientid}`);
    console.log(`Number of results found: ${Object.keys(response.data).length}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient details:', error);
    throw new Error('Error fetching patient details');
  }
};

export const getPatientFileReferences = async (athenapatientid: string, limit?: number): Promise<PatientFile[]> => {
  try {
    const response = await axios.get(`http://localhost:5000/api/patient-files/${athenapatientid}`, {
      params: { limit }
    });
    console.log(`Number of results found: ${response.data.length}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient file references:', error);
    throw new Error('Error fetching patient file references');
  }
};

export const getPatientFiles = async (athenapatientid: string, limit?: number): Promise<PatientFile[]> => {
  try {
    const response = await axios.get(`http://localhost:5000/api/patient-files/${athenapatientid}`, {
      params: { limit }
    });
    console.log(`Number of results found: ${response.data.length}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient files:', error);
    throw new Error('Error fetching patient files');
  }
};

export const downloadFile = async (filePath: string): Promise<Blob> => {
  try {
    const response = await axios.get('/api/file-download', {
      params: { filePath },
      responseType: 'blob'
    });
    console.log(`Number of results found: 1`);
    return new Blob([response.data], { type: response.headers['content-type'] });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error downloading file:', error.message);
    } else {
      console.error('Unknown error downloading file:', error);
    }
    throw error;
  }
};

export const bulkDownload = async (patientId: string, fileIds: string[], limit?: number): Promise<Blob> => {
  try {
    const response = await axios.post(`http://localhost:5000/api/bulk-download`, {
      patientId,
      fileIds,
      limit
    }, {
      responseType: 'blob',
    });
    console.log(`Number of results found: 1`);
    return response.data;
  } catch (error) {
    console.error('Error bulk downloading files:', error);
    throw new Error('Error bulk downloading files');
  }
};