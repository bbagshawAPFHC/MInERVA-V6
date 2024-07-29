import React from 'react';
import { List, ListItem, ListItemText, Checkbox } from '@mui/material';
import { PatientFile } from '../types';

interface FileListProps {
  files: PatientFile[];
  selectedFiles: Set<string>;
  onFileSelect: (file: PatientFile) => void;
}

const FileList: React.FC<FileListProps> = ({ files, selectedFiles, onFileSelect }) => {
  return (
    <List>
      {files.map(file => (
        <ListItem key={file.filePath} button onClick={() => onFileSelect(file)}>
          <Checkbox checked={selectedFiles.has(file.filePath)} />
          <ListItemText primary={file.filename} />
        </ListItem>
      ))}
    </List>
  );
};

export default FileList;