import React, { createContext, useContext, useState, useEffect } from "react";

import toast from "react-hot-toast";
import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState([]);

 
 const getAllPatients = async () => {
    setLoading(true);
    try {
        const {data} = await api.get(ENDPOINTS.PATIENTS.ALL)
        setPatient(data)
        console.log("🚀 ~ getAllPatients ~ res:", data)
        // toast.success("List of all patients");
        return data
    } catch (error) {
        console.log("🚀 ~ getAllPatients ~ error:", error)
              toast.error("failed fetch lists");
        
    } finally {
  setLoading(false);
}


 }


 const byStaff = async (payload) => {
  setLoading(true);
  try {
    const res = await api.post(ENDPOINTS.PATIENTS.BY_STAFF,payload)
             console.log("🚀 ~ byStaff ~ res:", res)
             toast.success("Appointment booked!");
    return true;

  } catch (error) {
    console.log("🚀 ~ byStaff ~ error:", error)
            toast.error("failed to book a appointment");
    
  } finally {
  setLoading(false);
}

 }
const loginPatient = async (payload) => {
  setLoading(true);
  try {
    const {data} = await api.post(ENDPOINTS.PATIENTS.LOGIN, payload)
       toast.success("Login successfully!");
         setPatient(data.patient);
       return true
  } catch (error) {
    console.log("🚀 ~ loginPatient ~ error:", error)
    
  }  finally {
    setLoading(false)
  }

}

  // Create/Register patient
  const createPatient = async (payload) => {
    setLoading(true);
    try {
      const res = await api.post(ENDPOINTS.PATIENTS.CREATE, payload);
      toast.success("Registered successfully!");
      return true || res.data// optional: return new patient
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.error("🚀 Registration error:", error);
      return false
    } finally {
      setLoading(false);
    }
  }; 
 
  //patient by id

  const getPatientById = async (id) => {
    try {
      const {data} = await api.get(ENDPOINTS.PATIENTS.BY_ID(id))
      setPatient(data);
      return data;
    } catch (error) {
      console.log("🚀 ~ getPatientById ~ error:", error)

    } finally {
  setLoading(false);
}

  }
  const updatePatient = async (id, payload) => {
    setLoading(true);
    try {
     const res = await api.put(ENDPOINTS.PATIENTS.UPDATE_BY_ID(id), payload);
      console.log("🚀 ~ updatePatient ~ res:", res)
      toast.success("Patient updated successfully!");
      return true;
    } catch (error) {
      console.error("🚀 updatePatient error:", error);
      toast.error("Failed to update patient!");
      return false;
    } finally {
      setLoading(false);
    }
  };
const deletePatient = async (id) => {
  try {
    const {data} = await api.delete(ENDPOINTS.PATIENTS.DELETE(id));
    console.log("🚀 ~ deletePatient ~ res:", data);

    // ✅ Update the local patient list immediately
    setPatient((prev) => prev.filter((p) => p.id !== id));

    toast.success("Patient deleted successfully!");
    return true;
  } catch (error) {
    console.log("🚀 ~ deletePatient ~ error:", error);
    toast.error("Failed to delete patient!");
  } finally {
    setLoading(false);
  }
};



  return (
    <PatientContext.Provider value={{getAllPatients,byStaff,updatePatient,deletePatient, loginPatient,createPatient, getPatientById, patient , loading }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);
 