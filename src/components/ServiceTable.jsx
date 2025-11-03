import React, { useState } from "react";
import { useService } from "../context/ServiceContext";
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
  TextField,
  Typography,
  Box,
} from "@mui/material";

const ServiceTable = () => {
  const { services, deleteService, updateService } = useService();
  const { searchQuery } = useSearch();

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", cost: "" });

  const filterService = services.filter((s) =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (serv) => {
    setEditId(serv.id);
    setEditData({ name: serv.name, cost: serv.cost });
  };

  const handleSave = async (id) => {
    if (!editData.name || !editData.cost) {
      alert("Please fill all fields");
      return;
    }

    await updateService(id, editData);
    setEditId(null);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditData({ name: "", cost: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      deleteService(id);
    }
  };

  const columns = ["Name", "Cost (₹)", "Action"];

  if (!services || services.length === 0) {
    return <Typography>No services found...</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Service List
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ width: "70dvw", mx: "auto", mt: 2, p: 2 }}
      >
        <Table>
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
            {filterService.length > 0 ? (
              filterService.map((ser) => (
                <TableRow key={ser.id}>
                  {/* Editable Name */}
                  <TableCell>
                    {editId === ser.id ? (
                      <TextField
                        size="small"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                      />
                    ) : (
                      ser.name
                    )}
                  </TableCell>

                  {/* Editable Cost */}
                  <TableCell>
                    {editId === ser.id ? (
                      <TextField
                        type="number"
                        size="small"
                        value={editData.cost}
                        onChange={(e) =>
                          setEditData({ ...editData, cost: e.target.value })
                        }
                      />
                    ) : (
                      `₹${ser.cost}`
                    )}
                  </TableCell>

                  {/* Action Buttons */}
                  <TableCell align="center">
                    {editId === ser.id ? (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleSave(ser.id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleEdit(ser)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(ser.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{ color: "text.secondary" }}
                >
                  No matching service found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ServiceTable;
