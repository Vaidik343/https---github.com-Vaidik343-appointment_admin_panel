import React, { useState, useEffect } from "react";
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
  Tabs, 
  Tab,
} from "@mui/material";
import { useDoctor } from "../context/DoctorContext";

const ServiceTable = () => {
  const {
    generalServices,
    doctorServices,
    deleteGeneralService,
    updateGeneralService,
    deleteDoctorService,
    updateDoctorService
  } = useService();
  const { searchQuery } = useSearch();
  const { doctor, getAllDoctor } = useDoctor();

  const [tabValue, setTabValue] = useState(0);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", cost: "", category: "" });

  useEffect(() => {
    getAllDoctor();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filterServices = (services) =>
    services.filter((s) =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleEdit = (serv) => {
    setEditId(serv.id);
    setEditData({
      name: serv.name,
      cost: serv.cost,
      category: serv.category || ""
    });
  };

  const handleSave = async (id) => {
    if (!editData.name || !editData.cost) {
      alert("Please fill all fields");
      return;
    }

    if (tabValue === 0) {
      await updateGeneralService(id, editData);
    } else {
      await updateDoctorService(id, { name: editData.name, cost: editData.cost });
    }
    setEditId(null);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditData({ name: "", cost: "", category: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      if (tabValue === 0) {
        deleteGeneralService(id);
      } else {
        deleteDoctorService(id);
      }
    }
  };

  const getDoctorName = (doctorId) => {
    const found = doctor?.find((d) => d.id === doctorId);
    return found ? found.name : "Unknown Doctor";
  };

  const renderTable = (services, columns) => {
    const filtered = filterServices(services);

    if (!services || services.length === 0) {
      return <Typography>No services found...</Typography>;
    }

    return (
      <TableContainer
        component={Paper}
        sx={{ width: "80dvw", mx: "auto", mt: 2, p: 2 }}
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
            {filtered.length > 0 ? (
              filtered.map((ser) => (
                <TableRow key={ser.id}>
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
                  {tabValue === 0 && (
                    <TableCell>
                      {editId === ser.id ? (
                        <TextField
                          size="small"
                          value={editData.category}
                          onChange={(e) =>
                            setEditData({ ...editData, category: e.target.value })
                          }
                        />
                      ) : (
                        ser.category || "N/A"
                      )}
                    </TableCell>
                  )}
                  {tabValue === 1 && (
                    <TableCell>{getDoctorName(ser.doctor_id)}</TableCell>
                  )}
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
                  colSpan={columns.length}
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
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Service Management
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="General Services" />
        <Tab label="Doctor Services" />
      </Tabs>

      {tabValue === 0 && renderTable(generalServices, ["Name", "Cost (₹)", "Category", "Action"])}
      {tabValue === 1 && renderTable(doctorServices, ["Name", "Cost (₹)", "Doctor", "Action"])}
    </Box>
  );
};

export default ServiceTable;
