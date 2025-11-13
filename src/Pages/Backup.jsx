import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Paper,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useBackup } from "../context/BackupContext";
import BackupIcon from "@mui/icons-material/Backup";
import TableChartIcon from "@mui/icons-material/TableChart";

const Backup = () => {
  const { triggerFullBackup, triggerTableBackup, loading } = useBackup();
  const [tableName, setTableName] = useState("");

  // List of available tables based on your backend models
  const availableTables = [
    "patients",
    "doctors",
    "appointments",
    "services",
    "bills",
    "bill_items",
    "appointment_services",
    "doctor_services",
    "general_services",
  ];

  const handleFullBackup = () => {
    triggerFullBackup();
  };

  const handleTableBackup = () => {
    if (tableName.trim()) {
      triggerTableBackup(tableName.trim());
      setTableName("");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Database Backup
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Create backups of your database. Full backups include all data, while table-specific backups allow you to backup individual tables.
      </Typography>

      <Grid container spacing={3}>
        {/* Full Database Backup */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <BackupIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Full Database Backup</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Download a complete backup of the entire database.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleFullBackup}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <BackupIcon />}
            >
              {loading ? "Creating Backup..." : "Create Full Backup"}
            </Button>
          </Paper>
        </Grid>

        {/* Table-Specific Backup */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <TableChartIcon sx={{ mr: 1, color: "secondary.main" }} />
              <Typography variant="h6">Table-Specific Backup</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select a table to backup from the dropdown.
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="table-select-label">Table Name</InputLabel>
              <Select
                labelId="table-select-label"
                id="table-select"
                value={tableName}
                label="Table Name"
                onChange={(e) => setTableName(e.target.value)}
              >
                {availableTables.map((table) => (
                  <MenuItem key={table} value={table}>
                    {table}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleTableBackup}
              disabled={loading || !tableName.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <TableChartIcon />}
            >
              {loading ? "Creating Backup..." : "Create Table Backup"}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> Backups are saved to your downloads folder. Ensure your backend server is running and accessible.
        </Typography>
      </Box>
    </Container>
  );
};

export default Backup;
