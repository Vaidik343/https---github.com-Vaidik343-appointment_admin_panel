import React, { useState } from "react";
import { useService } from "../context/ServiceContext";
import toast from "react-hot-toast";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const ServiceForm = ({ onClose, serviceType = "general", doctorId = null }) => {
  const {
    createGeneralService,
    createDoctorService,
    loading
  } = useService();

  const [form, setForm] = useState({
    name: "",
    cost: "",
    category: "",
    doctor_id: doctorId || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (serviceType === "general") {
      if (!form.name || !form.cost) {
        toast.error("Please fill out name and cost");
        return;
      }
      const res = await createGeneralService({ name: form.name, cost: form.cost, category: form.category });
      if (res) {
        setForm({ name: "", cost: "", category: "" });
        if (onClose) onClose();
      }
    } else if (serviceType === "doctor") {
      if (!form.doctor_id || !form.name || !form.cost) {
        toast.error("Please fill out all fields");
        return;
      }
      const res = await createDoctorService({ doctor_id: form.doctor_id, name: form.name, cost: form.cost });
      if (res) {
        setForm({ name: "", cost: "", doctor_id: doctorId || "" });
        if (onClose) onClose();
      }
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 1,
        mt: 1,
      }}
      noValidate
      autoComplete="off"
    >
      {serviceType === "doctor" && (
        <TextField
          label="Doctor ID"
          name="doctor_id"
          value={form.doctor_id}
          onChange={handleChange}
          fullWidth
          required
          disabled={!!doctorId}
        />
      )}

      <TextField
        label="Service Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        required
      />

      <TextField
        label="Cost (₹)"
        name="cost"
        type="number"
        value={form.cost}
        onChange={handleChange}
        fullWidth
        required
      />

      {serviceType === "general" && (
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={form.category}
            onChange={handleChange}
            label="Category"
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Consultation">Consultation</MenuItem>
            <MenuItem value="Laboratory">Laboratory</MenuItem>
            <MenuItem value="Radiology">Radiology</MenuItem>
            <MenuItem value="Cardiology">Cardiology</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      )}

      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          {loading ? "Saving..." : "Submit"}
        </Button>
      </Stack>
    </Box>
  );
};

export default ServiceForm;
