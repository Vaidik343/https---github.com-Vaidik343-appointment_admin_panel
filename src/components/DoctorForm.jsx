import React, { useState } from "react";
import { useDoctor } from "../context/DoctorContext";
import toast from "react-hot-toast";
import {
  TextField,
  Button,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";

const DoctorForm = ({ onClose }) => {
  const { createDoctor, getAllDoctor, loading } = useDoctor();

  const [data, setData] = useState({
    name: "",
    specialization: "",
    contact: "",
  });

  const handleChanges = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name || !data.specialization || !data.contact) {
      toast.error("Please fill out all fields");
      return;
    }

    const res = await createDoctor(data);

    if (res) {
      toast.success("Doctor created successfully!");
      setData({ name: "", specialization: "", contact: "" });
      await getAllDoctor();
      if (onClose) onClose();
    } else {
      toast.error("Failed to create doctor!");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
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
        label="Name"
        name="name"
        value={data.name}
        onChange={handleChanges}
        fullWidth
        required
      />

      <TextField
        label="Specialization"
        name="specialization"
        value={data.specialization}
        onChange={handleChanges}
        fullWidth
        required
      />

      <TextField
        label="Contact Number"
        name="contact"
        type="number"
        value={data.contact}
        onChange={handleChanges}
        fullWidth
        required
      />

      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          {loading ? "Saving..." : "Submit"}
        </Button>
      </Stack>
    </Box>
  );
};

export default DoctorForm;
