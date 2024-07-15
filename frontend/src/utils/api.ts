// src/utils/api.ts
import axios, { AxiosError } from 'axios';
import { Patient, PatientFile } from '../types';

export const searchPatients = async (query: string): Promise<Patient[]> => {
  try {
    const response = await axios.get(`http://localhost:5000/api/patients/search`, {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    throw new Error('Error fetching patient data');
  }
};

export const getPatientDetails = async (athenapatientid: string): Promise<any> => {
  try {
    const response = await axios.get(`http://localhost:5000/api/demographic/${athenapatientid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient details:', error);
    throw new Error('Error fetching patient details');
  }
};

export const getPatientFileReferences = async (athenapatientid: string): Promise<PatientFile[]> => {
  try {
    const response = await axios.get(`http://localhost:5000/api/patient-files/${athenapatientid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient file references:', error);
    throw new Error('Error fetching patient file references');
  }
};

export const getPatientFiles = async (athenapatientid: string): Promise<PatientFile[]> => {
  try {
    const response = await axios.get(`http://localhost:5000/api/patient-files/${athenapatientid}`);
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



export const bulkDownload = async (patientId: string, fileIds: string[]): Promise<Blob> => {
  try {
    const response = await axios.post(`${import.meta.env.API_BASE_URL}/bulk-download`, {
      patientId,
      fileIds
    }, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error bulk downloading files:', error);
    throw new Error('Error bulk downloading files');
  }
};