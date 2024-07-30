import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { getCollectionCount, getPatientCount, getFileCounts } from '../../utils/api';

const Dashboard: React.FC = () => {
  const [collectionCount, setCollectionCount] = useState<number>(0);
  const [patientCount, setPatientCount] = useState<number>(0);
  const [fileCounts, setFileCounts] = useState<{ [fileType: string]: number }>({});

  useEffect(() => {
    // Fetch collection count
    getCollectionCount()
      .then((count) => setCollectionCount(count))
      .catch((error) => console.error("Error fetching collection count:", error));

    // Fetch patient count
    getPatientCount()
      .then((count) => setPatientCount(count))
      .catch((error) => console.error("Error fetching patient count:", error));

    // Fetch file counts
    getFileCounts()
      .then((counts) => setFileCounts(counts))
      .catch((error) => console.error("Error fetching file counts:", error));
  }, []);

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Number of collections</Typography>
              <Typography variant="h6">{collectionCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Number of unique patients</Typography>
              <Typography variant="h6">{patientCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5">File Counts</Typography>
              <ul>
                {Object.entries(fileCounts).map(([fileType, count]) => (
                  <li key={fileType}>
                    <Typography variant="body1">
                      {fileType}: {count}
                    </Typography>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;