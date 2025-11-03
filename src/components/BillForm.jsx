import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Stack,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { useBill } from "../context/BillContext";
import { useService } from "../context/ServiceContext";
import { useAppointment } from "../context/AppointmentContext";
import { useDoctor } from "../context/DoctorContext";
import { usePatient } from "../context/PatientContext";

const BillForm = ({ onClose }) => {
  const { generateBill, loading, getAllBills } = useBill();
  const { appointments, getAllAppointment } = useAppointment();
  const { services, getAllService } = useService();
  const { patient, getAllPatients } = usePatient();
  const { doctor, getAllDoctor } = useDoctor();

  const [appointmentId, setAppointmentId] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    getAllAppointment();
    getAllService();
    getAllPatients();
    getAllDoctor();
  }, []);

  const handleServiceChange = (index, field, value) => {
    const updated = [...selectedServices];
    updated[index][field] = value;
    setSelectedServices(updated);
  };

  const addServiceRow = () => {
    setSelectedServices([...selectedServices, { service_id: "", quantity: 1 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const service_ids = selectedServices.map((s) => s.service_id);
    const quantities = selectedServices.map((s) => Number(s.quantity));

    if (!appointmentId || service_ids.length === 0) {
      toast.error("Please select an appointment and at least one service");
      return;
    }

    const payload = { appointment_id: appointmentId, service_ids, quantities };
    const res = await generateBill(payload);

    if (res) toast.success("Bill generated successfully!");
    await getAllBills();
    if (onClose) onClose();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" mb={1}>
        Generate New Bill
      </Typography>

      {/* Appointment Selection */}
      <FormControl fullWidth required>
        <InputLabel>Appointment</InputLabel>
        <Select
          value={appointmentId}
          label="Appointment"
          onChange={(e) => setAppointmentId(e.target.value)}
        >
          <MenuItem value="">-- Select Appointment --</MenuItem>
          {appointments?.map((a) => {
            const foundPatient = patient?.find((p) => p.id === a.patient_id);
            const foundDoctor = doctor?.find((d) => d.id === a.doctor_id);

            const patientName = foundPatient ? foundPatient.name : "Unknown Patient";
            const doctorName = foundDoctor ? foundDoctor.name : "Unknown Doctor";
            const formattedDate = new Date(a.start_time).toLocaleString();

            return (
              <MenuItem key={a.id} value={a.id}>
                {patientName} with {doctorName} — {formattedDate}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {/* Service Selection */}
      <Typography variant="subtitle1" mt={1}>
        Services
      </Typography>

      {selectedServices.map((row, index) => (
        <Stack key={index} direction="row" spacing={2}>
          <FormControl fullWidth required>
            <InputLabel>Service</InputLabel>
            <Select
              value={row.service_id}
              label="Service"
              onChange={(e) => handleServiceChange(index, "service_id", e.target.value)}
            >
              <MenuItem value="">Select Service</MenuItem>
              {services?.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name} — ₹{s.cost}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Quantity"
            type="number"
            inputProps={{ min: 1 }}
            value={row.quantity}
            onChange={(e) => handleServiceChange(index, "quantity", e.target.value)}
            required
            sx={{ width: "120px" }}
          />
        </Stack>
      ))}

      <Button
        variant="outlined"
        color="secondary"
        onClick={addServiceRow}
        sx={{ alignSelf: "flex-start" }}
      >
        + Add Service
      </Button>

      {/* Submit */}
      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          {loading ? "Generating..." : "Generate Bill"}
        </Button>
      </Stack>
    </Box>
  );
};

export default BillForm;
