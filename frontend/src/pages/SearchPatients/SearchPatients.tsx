// SearchPatients.tsx
import React, { useState, useMemo } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { usePatientSearch } from "../../hooks/usePatientSearch";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import PatientDetails from "./PatientDetails";

const SearchPatients: React.FC = () => {
  const {
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
  } = usePatientSearch();

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 20;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setSelectedPatient(null);
  };

  const handlePatientClick = (athenapatientid: string) => {
    setSelectedPatient(athenapatientid);
    fetchPatientDetails(athenapatientid);
    fetchPatientFiles(athenapatientid);
  };

  // Calculate paginated results
  const paginatedResults = useMemo(() => {
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    return searchResults.slice(indexOfFirstResult, indexOfLastResult);
  }, [searchResults, currentPage, resultsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ maxWidth: "md", mx: "auto" }}>
          <SearchBar
            searchTerm={searchTerm}
            onInputChange={handleInputChange}
            onSearch={() => setSearchTerm(searchTerm)}
          />
        </Box>
      </Paper>
      <Box sx={{ flexGrow: 1, overflow: "auto", px: 2, ml: "8px" }}>
        {" "}
        {/* Adjust the margin-left to match the sidebar width */}
        <Box
          sx={{
            maxWidth: "md",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {loading && (
            <CircularProgress sx={{ display: "block", mx: "auto" }} />
          )}
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}

          {!selectedPatient && searchResults.length > 0 && (
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <SearchResults
                searchResults={paginatedResults}
                currentPage={currentPage}
                resultsPerPage={resultsPerPage}
                totalPages={totalPages}
                onPatientClick={handlePatientClick}
                onPageChange={setCurrentPage}
              />
            </Box>
          )}

          {selectedPatient && patientData && (
            <PatientDetails
              patientData={patientData}
              patientFiles={patientFiles}
              athenapatientid={selectedPatient}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchPatients;
