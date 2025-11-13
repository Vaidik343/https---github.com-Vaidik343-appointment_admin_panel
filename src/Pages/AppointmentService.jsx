import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer, 
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { useAppointmentService } from "../context/AppointmentServiceContext";

const AppointmentServiceList = () => {
  const { appointmentService, loading, getAllAPS, deleteAPS } =
    useAppointmentService();

  useEffect(() => {
    getAllAPS(); // ✅ Fetch on mount
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      const success = await deleteAPS(id);
      if (success) {
        console.log("Deleted successfully");
      }
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Appointment Services
      </Typography>

      {appointmentService && appointmentService.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxWidth: "80vw", mx: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Service</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Cost (₹)</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointmentService.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.service?.name || "Unknown"}</TableCell>
                  <TableCell>{item.service?.cost || "N/A"}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => alert("Update flow coming soon!")}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography color="text.secondary" align="center">
          No services available.
        </Typography>
      )}
    </Box>
  );
};

export default AppointmentServiceList;
