import React, { useEffect, useState } from "react";
import { useDoctor } from "../context/DoctorContext";
import DoctorTable from "../components/DoctorTable";
import DoctorForm from "../components/DoctorForm";
import CommonModal from "../components/CommonModal";
import { Box, Button, Typography , CircularProgress} from "@mui/material";

const Doctor = () => {
  const { getAllDoctor, loading } = useDoctor();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getAllDoctor();
  }, []);

 if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  return (
    <div>
        <DoctorTable />
      <div className="addBtn">
         <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
           + Add Doctor
         </Button>
       </div>

    

      <CommonModal
        title="Add New Doctor"
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <DoctorForm onClose={() => setShowModal(false)} />
      </CommonModal>
    </div>
  );
};

export default Doctor;
