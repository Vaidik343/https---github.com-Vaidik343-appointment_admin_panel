import React, { createContext, useContext, useState } from "react";
import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

const AppointmentServiceContext = createContext();

export const AppointmentServiceProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [appointmentService, setAppointmentService] = useState([]);

  const getAllAPS = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(ENDPOINTS.APPOINTMENTS_SERVICE.ALL);
      console.log("🚀 ~ getAllAPS ~ data:", data);
      setAppointmentService(data); // ✅ Load into state
      return data;
    } catch (error) {
      console.log("🚀 ~ getAllAPS ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(ENDPOINTS.APPOINTMENTS_SERVICE.BY_ID(id));
      console.log("🚀 ~ getById ~ data:", data);
      return data;
    } catch (error) {
      console.log("🚀 ~ getById ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  const createAPS = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post(
        ENDPOINTS.APPOINTMENTS_SERVICE.CREATE,
        payload
      );
      console.log("🚀 ~ createAPS ~ res:", data);
      setAppointmentService((prev) => [...prev, data]); // ✅ Add new to list
      return data;
    } catch (error) {
      console.log("🚀 ~ createAPS ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAPS = async (id, payload) => {
    setLoading(true);
    try {
      const { data } = await api.put(
        ENDPOINTS.APPOINTMENTS_SERVICE.UPDATE_BY_ID(id),
        payload
      );
      console.log("🚀 ~ updateAPS ~ res:", data);
      setAppointmentService((prev) =>
        prev.map((item) => (item.id === id ? data : item))
      ); // ✅ Update in state
      return data;
    } catch (error) {
      console.log("🚀 ~ updateAPS ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAPS = async (id) => {
    setLoading(true);
    try {
      await api.delete(ENDPOINTS.APPOINTMENTS_SERVICE.DELETE(id));
      setAppointmentService((prev) =>
        prev.filter((item) => item.id !== id)
      ); // ✅ Remove locally
      return true;
    } catch (error) {
      console.log("🚀 ~ deleteAPS ~ error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppointmentServiceContext.Provider
      value={{
        appointmentService,
        loading,
        createAPS,
        getAllAPS,
        getById,
        updateAPS,
        deleteAPS,
      }}
    >
      {children}
    </AppointmentServiceContext.Provider>
  );
};

export const useAppointmentService = () => useContext(AppointmentServiceContext);
