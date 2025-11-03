import React from "react";
import { usePatient } from "../context/PatientContext";
// import { Button, Table } from 'react-bootstrap';
import { useSearch } from "../context/SearchContext";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from "@mui/material";

const PatientTable = () => {
  const { patient, deletePatient } = usePatient();
  const { searchQuery } = useSearch();

  const filteredPatient = patient.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Patient?")) {
      deletePatient(id);
    }
  };

  const columns = ["name", "dob", "contact", "email", "Action"];

  if (!patient || patient.length === 0) {
    return <p>No Patient Found...</p>;
  }

  return (
    <Box sx={{ mt: "20px" }}>
      <Typography variant="h4">Patient List</Typography>

      <TableContainer component={Paper}>
        <Table sx={{ width: "82dvw" }}>
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index} sx={{ fontWeight: "bold" }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatient.length > 0 ? (
              filteredPatient.map((pat) => (
                <TableRow key={pat.id}>
                  <TableCell>{pat.name}</TableCell>
                  <TableCell>{pat.dob}</TableCell>
                  <TableCell>{pat.contact}</TableCell>
                  <TableCell>{pat.email}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="contained"
                      color="error"
                      disabled={pat.status === "Deleted"}
                      onClick={() => handleDelete(pat.id)}
                    >
                      {pat.status === "Deleted" ? "Deleted" : "Delete"}
                    </Button>
                  </TableCell>
                  {/* <td>{pat.password}</td> */}
                </TableRow>
              ))
            ) : (
              <tr>
                <TableCell colSpan="3" className="text-center text-gray-500">
                  No matching patient found
                </TableCell>
              </tr>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientTable;
