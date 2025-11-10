import React, { useEffect, useState } from "react";
import { useService } from "../context/ServiceContext";
import { useDoctor } from "../context/DoctorContext";
import ServiceForm from "../components/ServiceForm";
import ServiceTable from "../components/ServiceTable";
import CommonModal from "../components/CommonModal";
import { Button, Box, Typography, CircularProgress, Stack } from "@mui/material";

const Service = () => {
  const { getAllGeneralServices, getDoctorServices, loading } = useService();
  const { doctor, getAllDoctor } = useDoctor();
  const [showModal, setShowModal] = useState(false);
  const [serviceType, setServiceType] = useState("general");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  useEffect(() => {
    getAllGeneralServices();
    getAllDoctor();
  }, []);

  const handleAddGeneralService = () => {
    setServiceType("general");
    setSelectedDoctor("");
    setShowModal(true);
  };

  const handleAddDoctorService = () => {
    setServiceType("doctor");
    setShowModal(true);
  };

  const handleDoctorChange = (doctorId) => {
    setSelectedDoctor(doctorId);
    if (doctorId) {
      getDoctorServices(doctorId);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <ServiceTable />

      {/* Header and Add Buttons */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add New Services
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddGeneralService}
          >
            + Add General Service
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddDoctorService}
          >
            + Add Doctor Service
          </Button>
        </Stack>
      </Box>

      {/* Modal for ServiceForm */}
      <CommonModal
        title={`Add New ${serviceType === "general" ? "General" : "Doctor"} Service`}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <ServiceForm
          serviceType={serviceType}
          doctorId={selectedDoctor}
          onClose={() => setShowModal(false)}
        />
      </CommonModal>
    </Box>
  );
};

export default Service;
