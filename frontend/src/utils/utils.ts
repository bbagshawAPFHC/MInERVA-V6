// utils.ts
import axios from 'axios';
import debounce from 'lodash/debounce';
import { Patient, PatientFile } from '../types';

export const downloadFile = async (fileId: string): Promise<void> => {
  const response = await axios.get(`/api/files/${fileId}/download`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'file.pdf'); // or extract the file name from response headers
  document.body.appendChild(link);
  link.click();
};

type DebouncedFunction<T extends (...args: any[]) => any> = (
  func: T,
  wait: number
) => (...args: Parameters<T>) => ReturnType<T>;

export const debounceFunction: DebouncedFunction<(query: string) => void> = (func, wait) => {
  return debounce(func, wait);
};