import React, { useState } from "react";
import { useService } from "../context/ServiceContext";
import toast from "react-hot-toast";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Stack,
} from "@mui/material";

const ServiceForm = ({ onClose }) => {
  const { createService, loading } = useService();

  const [form, setForm] = useState({
    name: "",
    cost: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.cost) {
      toast.error("Please fill out all fields");
      return;
    }

    const res = await createService(form);
    if (res) {
      toast.success("Service created successfully!");
      setForm({ name: "", cost: "" });
      if (onClose) onClose();
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
