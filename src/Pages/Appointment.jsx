import React, { useEffect, useState } from "react";
import { useAppointment } from "../context/AppointmentContext";
import { useDoctor } from "../context/DoctorContext";
import { usePatient } from "../context/PatientContext";
import AppointmentTable from "../components/AppointmentTable";
import { useSearch } from "../context/SearchContext";
import CommonModal from "../components/CommonModal";
import AppointmentForm from "../components/AppointmentForm";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

const Appointment = () => {
  const { getAllAppointment } = useAppointment();
  const { getAllDoctor } = useDoctor();
  const { getAllPatients } = usePatient();
  const { searchQuery } = useSearch();

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllDoctor();
        await getAllPatients();
        await getAllAppointment();
      } catch (error) {
        console.error("❌ Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Appointments</Typography>
        <Button variant="contained" onClick={() => setShowModal(true)}>
          + Add Appointment
        </Button>
      </Box>

      <AppointmentTable searchQuery={searchQuery} />

      <CommonModal
        title="Create Appointment"
        show={showModal}
        onClose={() => setShowModal(false)}
        size="md"
      >
        <AppointmentForm onClose={() => setShowModal(false)} />
      </CommonModal>
    </Box>
  );
};

export default Appointment;
