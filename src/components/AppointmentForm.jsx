import React, { useEffect, useState } from "react";
import {
  MenuItem,
  Paper,
  Grid,
  TextField,
  Box,
  Typography,
  Button,
  Stack, 
  Divider,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import { useDoctor } from "../context/DoctorContext";
import { usePatient } from "../context/PatientContext";
import { useAppointment } from "../context/AppointmentContext";
import { useService } from "../context/ServiceContext";
import toast from "react-hot-toast";

const AppointmentForm = ({ onClose }) => {
  const { getAllDoctor, doctor } = useDoctor();
  const { getAllPatients, patient } = usePatient();
  const { createAppointment, loading, getAllAppointment } = useAppointment();
  const { generalServices, doctorServices, getAllGeneralServices, fetchAllDoctorServices } = useService();

  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    start_time: "",
    end_time: "",
    status: "Scheduled",
    selectedServices: [],
  });

  const [availableServices, setAvailableServices] = useState([]);

  useEffect(() => {
    getAllDoctor();
    getAllPatients();
    getAllGeneralServices();
    fetchAllDoctorServices();
  }, []);

  // Update available services when doctor is selected
  useEffect(() => {
    if (form.doctor_id) {
      const selectedDoctorServices = doctorServices.filter(service => service.doctor_id === form.doctor_id);
      setAvailableServices([...generalServices, ...selectedDoctorServices]);
    } else {
      setAvailableServices(generalServices);
    }
  }, [form.doctor_id, generalServices, doctorServices]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (event) => {
    const { value } = event.target;
    setForm({ ...form, selectedServices: value });
  };

  const handleRemoveService = (serviceId) => {
    setForm(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.filter(id => id !== serviceId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.patient_id || !form.doctor_id || !form.start_time || !form.end_time || form.selectedServices.length === 0) {
      toast.error("Please fill all required fields including service.");
      return;
    }

    const payload = {
      patient_id: form.patient_id,
      doctor_id: form.doctor_id,
      start_time: form.start_time,
      end_time: form.end_time,
      status: form.status,
      services: form.selectedServices.map(serviceId => ({ service_id: serviceId, quantity: 1 })),
    };

    try {
      const res = await createAppointment(payload);
      if (res) {
        toast.success("Appointment created successfully!");
        await getAllAppointment(); // refresh list if needed
        onClose && onClose(); // close modal if passed
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to create appointment.");
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, px: 2 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
          Create Appointment
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={3}>
            {/* Row 1: Patient + Doctor */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="Select Patient"
                name="patient_id"
                value={form.patient_id}
                onChange={handleChange}
                required
              >
                <MenuItem value="">-- Choose Patient --</MenuItem>
                {patient?.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="Select Doctor"
                name="doctor_id"
                value={form.doctor_id}
                onChange={handleChange}
                required
              >
                <MenuItem value="">-- Choose Doctor --</MenuItem>
                {doctor?.map((doc) => (
                  <MenuItem key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialization})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Row 2: Services */}
            <Grid size={12}>
              <FormControl fullWidth required>
                <InputLabel>Select Services</InputLabel>
                <Select
                  multiple
                  value={form.selectedServices}
                  onChange={handleServiceChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const service = availableServices?.find(s => s.id === value);
                        return (
                          <Chip
                            key={value}
                            label={service ? service.name : value}
                            onDelete={() => handleRemoveService(value)}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {availableServices?.map((srv) => (
                    <MenuItem key={srv.id} value={srv.id}>
                      {srv.name} – ₹{srv.cost} {srv.type === 'doctor' ? `(Dr. ${srv.doctorName})` : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {availableServices.length === 0 && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Select a doctor to see available services
                </Typography>
              )}
            </Grid>

            {/* Row 3: Start + End Time */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Start Time"
                name="start_time"
                type="datetime-local"
                value={form.start_time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="End Time"
                name="end_time"
                type="datetime-local"
                value={form.end_time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            {/* Row 4: Status */}
            <Grid size={12}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>

            {/* Submit Button */}
            <Grid size={12} sx={{ textAlign: "center", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ borderRadius: 2, px: 4 }}
              >
                {loading ? "Creating..." : "Create Appointment"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AppointmentForm;
