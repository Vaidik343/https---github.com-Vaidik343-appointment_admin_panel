import React, { createContext, useContext, useState } from "react";
import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
import toast from "react-hot-toast";

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);

  // ✅ Get all services
  const getAllService = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(ENDPOINTS.SERVICE.ALL);
      setServices(data); // ✅ store globally
      // toast.success("Fetched all services");
      return data; // ✅ return for flexibility
    } catch (error) {
      toast.error("Failed to fetch services");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    } 
  };

  // ✅ Create service
  const createService = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post(ENDPOINTS.SERVICE.CREATE, payload);
      toast.success("Service created");
      return data; // ✅ return created data
    } catch (error) {
      toast.error("Failed to create service");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get service by id
  const serviceById = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(ENDPOINTS.SERVICE.BY_ID(id));
      return data; // ✅ used for detail/edit pages
    } catch (error) {
      toast.error("Failed to fetch service");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update service
  const updateService = async (id, payload) => {
    setLoading(true);
    try {
      const { data } = await api.put(ENDPOINTS.SERVICE.UPDATE_BY_ID(id), payload);
      toast.success("Service updated");

      // ✅ Optional: update locally if list exists
      setServices((prev) =>
        prev.map((srv) => (srv.id === id ? data : srv))
      );

      return data; // ✅ return updated service
    } catch (error) {
      toast.error("Failed to update service");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete service
  const deleteService = async (id) => {
    setLoading(true);
    try {
      await api.delete(ENDPOINTS.SERVICE.DELETE(id));
      toast.success("Service deleted");

      // ✅ Update local list
      setServices((prev) => prev.filter((srv) => srv.id !== id));

      return true; // ✅ just success status
    } catch (error) {
      toast.error("Failed to delete service");
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServiceContext.Provider
      value={{
        getAllService,
        createService,
        serviceById,
        updateService,
        deleteService,
        loading,
        services,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => useContext(ServiceContext);
