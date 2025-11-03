import React, { useContext, useEffect, useState, createContext } from "react";
import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
import toast from "react-hot-toast";

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState([]);

  const getAllDoctor = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(ENDPOINTS.DOCTOR.ALL);
      console.log("🚀 ~ getAllDoctor ~ data:", data);
      setDoctor(data)
      // toast.success("List of all doctor");
      return data;
    } catch (error) {
      console.log("🚀 ~ getAllDoctor ~ error:", error);
      toast.error("Not able to fetch list of doctors!");
    } finally {
      setLoading(false);
    }
  };

  const createDoctor = async (payload) => {
    setLoading(true);
    try {
      const res = await api.post(ENDPOINTS.DOCTOR.CREATE, payload);
      toast.success("Doctor Registered successfully!");
      console.log("🚀 ~ createDoctor ~ res:", res);
      return true;
    } catch (error) {
      console.log("🚀 ~ createDoctor ~ error:", error);
         toast.error("failed to register doctor!");
    } finally {
      setLoading(false);
    }
  };

  
    const getById = async (id) => {
        setLoading(true);
        try {
            const {data} = await api.get(ENDPOINTS.DOCTOR.BY_ID(id))
            console.log("🚀 ~ getById ~ data:", data)
            setDoctor(data)
             
        } catch (error) {
            console.log("🚀 ~ getById ~ error:", error)
             toast.error("Doctor not found!");
        }  finally {
            setLoading(false)
        }
    }

    return (
        <DoctorContext.Provider value={{getAllDoctor, getById, createDoctor, loading, doctor}}>{children}</DoctorContext.Provider>
    )
};

export const useDoctor = () => useContext(DoctorContext)