import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { usePatient } from "../context/PatientContext";

const WalkInForm = ({ onClose }) => {
  const { byStaff, loading, getAllPatients } = usePatient();

  const [form, setForm] = useState({
    name: "",
    dob: "",
    contact: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.name || !form.dob || !form.contact) {
      toast.error("Please fill all fields");
      return;
    }

    const res = await byStaff(form);
    if (res) {
      toast.success("Patient created successfully!");
      setForm({ name: "", dob: "", contact: "" });
      await getAllPatients();
      onClose && onClose();
    } else {
      toast.error("Failed to create patient");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSave}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        p: 2,
        minWidth: 400,
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Add New Patient
      </Typography>

      <TextField
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        required
      />

      <TextField
        label="Date of Birth"
        name="dob"
        type="date"
        value={form.dob}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        required
      />
 
      <TextField
        label="Contact Number"
        name="contact"
        type="tel"
        value={form.contact}
        onChange={handleChange}
        fullWidth
        required
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Saving..." : "Submit"}
      </Button>
    </Box>
  );
};

export default WalkInForm;
