import React, { createContext, useContext, useState } from "react";
import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
import toast from "react-hot-toast";

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointment] = useState([]);

  const getAllAppointment = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(ENDPOINTS.APPOINTMENTS.ALL);
      setAppointment(data);
      console.log("🚀 ~ getAllAppointment ~ data:", data);
      // toast.success("List of all Appointments");
      return data;
    } catch (error) {
      console.log("🚀 ~ getAllAppointment ~ error:", error);
      toast.error("service not found");
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post(ENDPOINTS.APPOINTMENTS.CREATE, payload);
      console.log("🚀 ~ createAppointment ~ data:", data);
      return true;
    } catch (error) {
      console.log("🚀 ~ createAppointment ~ error:", error);
    } finally {
      setLoading(false);
    }
  };
  const cancelAppointment = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.put(ENDPOINTS.APPOINTMENTS.CANCEL(id));
      toast.success("Appointment canceled");

      // ✅ Optional: update local state after cancel
      setAppointment((prev) =>
        prev.map((ap) => (ap.id === id ? { ...ap, status: "Cancelled" } : ap))
      );

      return data; 
    } catch (error) {
      toast.error("Failed to cancel appointment");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const appointmentById = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(ENDPOINTS.APPOINTMENTS.BY_PATIENT_ID(id));
      console.log("🚀 ~ appointmentById ~ data:", data);
      return data;
    } catch (error) {
      console.log("🚀 ~ appointmentById ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        getAllAppointment,
        createAppointment,
        cancelAppointment,
        appointmentById,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => useContext(AppointmentContext);
