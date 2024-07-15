// src/types/index.ts
export interface Patient {
  patientdetails: {
    firstname: string;
    lastname: string;
    dob: string;
    age: number;
    gender: string;
    athenapatientid: string;
  };
}
  
export interface SearchParams {
  term?: string;
  hospital?: string;
  businessUnit?: string;
  gender?: string;
  zipCode?: string;
  state?: string;
}

export interface PatientFile {
  collection: string;
  documentId: string;
  contentType: string;
  reference: string;
  pageId: string;
  pageOrdering: string;
  description: string;
  filename: string;
  filePath: string;
  filetype: string;
}