import { Request, Response } from 'express';
import archiver from 'archiver';
import fs from 'fs-extra';
import path from 'path';

const EXPORT_FILES_PATH = process.env.EXPORT_FILES_PATH || path.join(__dirname, '..', '..', '..', '..', 'exported_files');

export const bulkDownload = async (req: Request, res: Response): Promise<void> => {
  const { patientId, fileIds } = req.body;

  if (!patientId || !fileIds || fileIds.length === 0) {
    res.status(400).json({ message: 'Invalid request parameters' });
    return;
  }

  console.log('EXPORT_FILES_PATH:', EXPORT_FILES_PATH);
  console.log('Requested fileIds:', fileIds);

  const zipFileName = `patient_${patientId}_files.zip`;
  const zipFilePath = path.join(__dirname, '..', 'temp', zipFileName);

  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('Archiver has been finalized and the output file descriptor has closed.');
    
    res.download(zipFilePath, zipFileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error sending file' });
        }
      }
      // Delete the temporary zip file
      fs.remove(zipFilePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting zip file:', unlinkErr);
      });
    });
  });

  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      console.warn('Archive warning:', err);
    } else {
      console.error('Archive error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error creating archive' });
      }
    }
  });

  archive.on('error', function(err) {
    console.error('Error during archiving:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error creating archive' });
    }
  });

  archive.pipe(output);

  let fileCount = 0;
  for (const fileId of fileIds) {
    try {
      const filePath = getFilePath(fileId);
      console.log(`Processing file: ${filePath}`);
      if (await fs.pathExists(filePath)) {
        const fileName = path.basename(filePath);
        archive.file(filePath, { name: fileName });
        console.log(`Added file to archive: ${fileName}`);
        fileCount++;
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error adding file ${fileId} to archive:`, error);
    }
  }

  if (fileCount === 0) {
    console.error('No files were added to the archive');
    if (!res.headersSent) {
      res.status(404).json({ message: 'No files found to download' });
    }
    return;
  }

  console.log(`Total files added to archive: ${fileCount}`);
  archive.finalize();
};

function getFilePath(fileId: string): string {
  // Remove any leading slash from fileId to avoid path resolution issues
  const sanitizedFileId = fileId.replace(/^\//, '');
  // Resolve the path, ensuring we don't duplicate EXPORT_FILES_PATH
  const filePath = path.resolve(EXPORT_FILES_PATH, sanitizedFileId);
  
  // Security check: ensure the resolved path is still within EXPORT_FILES_PATH
  if (!filePath.startsWith(EXPORT_FILES_PATH)) {
    throw new Error('Invalid file path');
  }
  
  console.log(`Resolved file path: ${filePath}`);
  return filePath;
}