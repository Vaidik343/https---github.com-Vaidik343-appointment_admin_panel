import React, { useEffect , useState} from "react";
import BillForm from "../components/BillForm";
import CommonModal from "../components/CommonModal";
import BillList from "../components/BillList";
import { useBill } from "../context/BillContext";
// import { Button } from "react-bootstrap";
import { Box, Button, Typography } from "@mui/material";


const Bill = () => {
  // console.log("✅ Bill.jsx rendered");
  const {getAllBills} = useBill();
   const [showModal, setShowModal] = useState(false);

  useEffect(()=> {
    getAllBills();
  }, []);

    
  return (
     <div>
      <div className="addBtn">
    <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
      + Add Appointment
    </Button>
  </div>
   

          <BillList />
       <CommonModal 
     title="Add New Service"
     show={showModal}
     onClose={() => setShowModal(false)}
       
      
    >
        <BillForm onClose={ ()=> setShowModal(false)} />
    </CommonModal>
  
    </div>
  );
};

export default Bill;
