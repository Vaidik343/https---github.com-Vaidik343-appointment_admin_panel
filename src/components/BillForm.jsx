import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Stack,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { useBill } from "../context/BillContext";
import { useAppointment } from "../context/AppointmentContext";
import { useDoctor } from "../context/DoctorContext";
import { usePatient } from "../context/PatientContext";

const BillForm = ({ onClose }) => {
  const { generateBill, loading, getAllBills } = useBill();
  const { appointments, getAllAppointment } = useAppointment();
  const { patient, getAllPatients } = usePatient();
  const { doctor, getAllDoctor } = useDoctor();

  const [appointmentId, setAppointmentId] = useState("");

  useEffect(() => {
    getAllAppointment();
    getAllPatients();
    getAllDoctor();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointmentId) {
      toast.error("Please select an appointment");
      return;
    }

    const result = await generateBill(appointmentId);
    if (result) {
      await getAllBills();
      if (onClose) onClose();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h5" mb={1}>
        Generate New Bill
      </Typography>

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
  {patientName} with {doctorName} — 
  {new Date(a.start_time).toLocaleString()} (Local) 
  {/* {new Date(a.start_time).toLocaleString("en-GB", { timeZone: "UTC" })} (UTC) */}
</MenuItem>

            ); 
          })}
        </Select>
      </FormControl>

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
