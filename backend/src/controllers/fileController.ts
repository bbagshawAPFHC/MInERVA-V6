import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';

const EXPORT_FILES_PATH = process.env.EXPORT_FILES_PATH || path.join(__dirname, '..', '..', '..', '..', 'exported_files');

export const getPatientFiles = async (req: Request, res: Response) => {
  const { athenapatientid } = req.params;

  console.log('Searching for files for patient:', athenapatientid);
  console.log('EXPORT_FILES_PATH:', EXPORT_FILES_PATH);

  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections`);

    let fileReferences: Set<string> = new Set();

    for (const collectionInfo of collections) {
      console.log(`Searching in collection: ${collectionInfo.name}`);
      const collection = db.collection(collectionInfo.name);
      const documents = await collection.find(
        { "patientdetails.athenapatientid": athenapatientid }
      ).toArray();

      console.log(`Found ${documents.length} documents in ${collectionInfo.name}`);

      documents.forEach(doc => {
        const refs = extractFileReferences(doc);
        refs.forEach(ref => fileReferences.add(ref));
      });
    }

    console.log(`Found ${fileReferences.size} unique file references for patient ${athenapatientid}`);
    console.log('File references:', Array.from(fileReferences));

    // Step 2: Search for the files in the exported_files directory
    let foundFiles: any[] = [];
    for (const reference of fileReferences) {
      const filePaths = await findFile(reference);
      filePaths.forEach(filePath => {
        foundFiles.push({
          filename: path.basename(filePath),
          filetype: path.extname(filePath).slice(1),
          filePath: filePath,
          collection: path.basename(path.dirname(path.dirname(filePath))).split('_')[0]
        });
      });
    }

    console.log(`Found ${foundFiles.length} actual files for patient ${athenapatientid}`);
    console.log('Found files:', foundFiles);

    res.json(foundFiles);
  } catch (error: any) {
    console.error('Error fetching patient files:', error);
    res.status(500).json({ message: 'Error fetching patient files', error: error.toString() });
  }
};

function extractFileReferences(obj: any): string[] {
  let references: string[] = [];
  
  if (typeof obj !== 'object' || obj === null) {
    return references;
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      references = references.concat(extractFileReferences(item));
    }
  } else {
    for (const key in obj) {
      if (key === 'reference' && typeof obj[key] === 'string') {
        references.push(obj[key]);
      } else if (typeof obj[key] === 'object') {
        references = references.concat(extractFileReferences(obj[key]));
      }
    }
  }

  return references;
}

async function findFile(reference: string): Promise<string[]> {
  console.log('Searching for file:', reference);
  let foundPaths: string[] = [];

  async function searchInDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await searchInDirectory(fullPath);
      } else if (entry.isFile() && entry.name === path.basename(reference)) {
        console.log('File found:', fullPath);
        foundPaths.push(fullPath);
      }
    }
  }

  try {
    await searchInDirectory(EXPORT_FILES_PATH);
  } catch (error: any) {
    console.error('Error searching for file:', error.message);
  }

  if (foundPaths.length === 0) {
    console.log(`File not found: ${reference}`);
  }

  return foundPaths;
}

export const downloadFile = async (req: Request, res: Response) => {
  const filePath = req.query.filePath as string;

  if (!filePath) {
    return res.status(400).json({ message: 'File path is required' });
  }

  try {
    if (!(await fs.stat(filePath)).isFile()) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath);
  } catch (error: any) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Error downloading file', error: error.toString() });
  }
};