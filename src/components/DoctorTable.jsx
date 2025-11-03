import React from "react";
import { useDoctor } from "../context/DoctorContext";
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

const DoctorTable = () => {
  const { doctor, loading } = useDoctor();
  const { searchQuery } = useSearch();

  if (loading) return <p>Loading doctors...</p>;

  // 🔍 Filter inside this component
  const filteredDoctors = doctor.filter((d) =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4">Doctor List</Typography>

      <TableContainer component={Paper}>
        <Table sx={{ width: "80dvw" }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Contact</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.specialization}</TableCell>
                  <TableCell>{d.contact}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="3" className="text-center text-gray-500">
                  No matching doctors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DoctorTable;
