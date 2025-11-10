import React, { createContext, useContext, useState } from "react";
import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
import toast from "react-hot-toast";

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [generalServices, setGeneralServices] = useState([]);
  const [doctorServices, setDoctorServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  // ✅ Get all general services
  const getAllGeneralServices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(ENDPOINTS.GENERAL_SERVICES.ALL);
      setGeneralServices(data);
      return data;
    } catch (error) {
      toast.error("Failed to fetch general services");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create general service
  const createGeneralService = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post(ENDPOINTS.GENERAL_SERVICES.CREATE, payload);
      toast.success("General service created");
      setGeneralServices((prev) => [...prev, data]);
      return data;
    } catch (error) {
      toast.error("Failed to create general service");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update general service
  const updateGeneralService = async (id, payload) => {
    setLoading(true);
    try {
      const { data } = await api.put(ENDPOINTS.GENERAL_SERVICES.UPDATE_BY_ID(id), payload);
      toast.success("General service updated");
      setGeneralServices((prev) =>
        prev.map((srv) => (srv.id === id ? data : srv))
      );
      return data;
    } catch (error) {
      toast.error("Failed to update general service");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete general service
  const deleteGeneralService = async (id) => {
    setLoading(true);
    try {
      await api.delete(ENDPOINTS.GENERAL_SERVICES.DELETE(id));
      toast.success("General service deleted");
      setGeneralServices((prev) => prev.filter((srv) => srv.id !== id));
      return true;
    } catch (error) {
      toast.error("Failed to delete general service");
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get doctor services for a specific doctor
  const getDoctorServices = async (doctorId) => {
    setLoading(true);
    try {
      const { data } = await api.get(ENDPOINTS.DOCTOR_SERVICES.ALL(doctorId));
      setDoctorServices(data);
      return data;
    } catch (error) {
      toast.error("Failed to fetch doctor services");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch all doctor services (for all doctors)
  const fetchAllDoctorServices = async () => {
    setLoading(true);
    try {
      const doctorsRes = await api.get(ENDPOINTS.DOCTOR.ALL);
      const doctorServicesPromises = doctorsRes.data.map(doctor =>
        api.get(`${ENDPOINTS.DOCTOR_SERVICES.ALL}/${doctor.id}`)
      );
      const doctorServicesResponses = await Promise.all(doctorServicesPromises);
      const doctorWithType = doctorServicesResponses.flatMap((res, index) =>
        res.data.map(service => ({ ...service, type: 'doctor', doctorName: doctorsRes.data[index].name }))
      );
      setDoctorServices(doctorWithType);
      return doctorWithType;
    } catch (error) {
      toast.error("Failed to fetch all doctor services");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create doctor service
  const createDoctorService = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post(ENDPOINTS.DOCTOR_SERVICES.CREATE, payload);
      toast.success("Doctor service created");
      return data;
    } catch (error) {
      toast.error("Failed to create doctor service");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update doctor service
  const updateDoctorService = async (id, payload) => {
    setLoading(true);
    try {
      const { data } = await api.put(ENDPOINTS.DOCTOR_SERVICES.UPDATE_BY_ID(id), payload);
      toast.success("Doctor service updated");
      return data;
    } catch (error) {
      toast.error("Failed to update doctor service");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete doctor service
  const deleteDoctorService = async (id) => {
    setLoading(true);
    try {
      await api.delete(ENDPOINTS.DOCTOR_SERVICES.DELETE(id));
      toast.success("Doctor service deleted");
      return true;
    } catch (error) {
      toast.error("Failed to delete doctor service");
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get available services for a doctor (doctor-specific + general)
  const getAvailableServices = async (doctorId) => {
    setLoading(true);
    try {
      const { data } = await api.get(ENDPOINTS.DOCTOR_SERVICES.AVAILABLE(doctorId));
      setAvailableServices(data);
      return data;
    } catch (error) {
      toast.error("Failed to fetch available services");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServiceContext.Provider
      value={{
        getAllGeneralServices,
        createGeneralService,
        updateGeneralService,
        deleteGeneralService,
        getDoctorServices,
        fetchAllDoctorServices,
        createDoctorService,
        updateDoctorService,
        deleteDoctorService,
        getAvailableServices,
        loading,
        generalServices,
        doctorServices,
        availableServices,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => useContext(ServiceContext);
