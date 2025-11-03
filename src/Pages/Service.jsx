import React, { useEffect, useState } from "react";
import { useService } from "../context/ServiceContext";
import ServiceForm from "../components/ServiceForm";
import ServiceTable from "../components/ServiceTable";
import CommonModal from "../components/CommonModal";
import { Button, Box, Typography, CircularProgress } from "@mui/material";

const Service = () => {
  const { getAllService, loading } = useService();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getAllService();
  }, []);

 if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  return ( 
    <div>
         <ServiceTable />
      {/* Header and Add Button */}
       <div className="addBtn">
         <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
           + Add Services
         </Button>
       </div>
      {/* Table */}
   

      {/* Modal for ServiceForm */}
      <CommonModal
        title="Add New Service"
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <ServiceForm onClose={() => setShowModal(false)} />
      </CommonModal>
    </div>
  );
};

export default Service;
