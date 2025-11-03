import React, { useEffect, useState } from 'react'
import { usePatient } from '../context/PatientContext'
import PatientTable from '../components/PatientTable';
import WalkInForm from '../components/WalkInForm';
import CommonModal from '../components/CommonModal';
// import { Button } from 'react-bootstrap';
import { Box, Button, Typography , CircularProgress} from "@mui/material";
const Patient = () => {

    const {getAllPatients, loading} = usePatient();
          const [showModal, setShowModal] = useState(false);

           
    useEffect( ()=> {
        getAllPatients();
    },[])
 
   if (loading)
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      ); 
  return (
    <div>
        <PatientTable />

      <div className="addBtn">
    <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
      + Add Patient
    </Button>
  </div>
           <CommonModal
          title="Add New Patient"
          show={showModal}
          onClose={() => setShowModal(false)}
        >
          <WalkInForm onClose={() => setShowModal(false)} />
        </CommonModal>
    </div>
  )
}

export default Patient