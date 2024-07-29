// SearchBar.tsx
import React from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchBarProps {
  searchTerm: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onInputChange, onSearch }) => (
  <Grid container spacing={2} alignItems="center">
    <Grid item xs>
      <TextField
        fullWidth
        value={searchTerm}
        onChange={onInputChange}
        placeholder="Search patients by first name, last name, or Athena ID..."
        InputProps={{
          startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
        }}
      />
    </Grid>
    <Grid item>
      <Button
        variant="contained"
        color="primary"
        startIcon={<SearchIcon />}
        onClick={onSearch}
      >
        Search
      </Button>
    </Grid>
  </Grid>
);

export default SearchBar;