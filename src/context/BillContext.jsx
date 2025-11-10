import React, { createContext, useContext, useState } from "react";
import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
import toast from "react-hot-toast";


const BillContext = createContext();

export const BillProvider = ({children}) => {

    const [bills, setBills] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedBill, setSelectedBill] = useState(null);


    const getAllBills = async () => {
        setLoading(true)
        try {
            const {data} = await api.get(ENDPOINTS.BILLS.ALL);
            console.log("🚀 ~ getAllBills ~ data:", data)
            setBills(data)
            return data;
        } catch (error) {
            console.log("🚀 ~ getAllBills ~ error:", error)
              toast.error("Not able to fetch list bills!");
            
        } finally {
            setLoading(false)
        }

    }

    const generateBill = async (appointment_id) => {
    setLoading(true);
    try {
      const { data } = await api.post(ENDPOINTS.BILLS.CREATE, { appointment_id });
      toast.success("Bill generated successfully");
      return data;
    } catch (error) {
      console.error("generateBill error:", error);
      toast.error("Failed to generate bill");
    } finally {
      setLoading(false);
    }
  };

    const markAsPaid = async (id,payload) => {
        setLoading(true);
        try {
            const {data} = await api.patch(ENDPOINTS.BILLS.MARKED_PAY(id), payload);
            console.log("🚀 ~ markAsPaid ~ data:", data)
            return data;
        } catch (error) {
            console.log("🚀 ~ markAsPaid ~ error:", error)
            
        } finally {
            setLoading(false);
        }

    }

    const billDiscount = async (id, payload) => {
        setLoading(true)

        try {
            const {data} = api.patch(ENDPOINTS.BILLS.DISCOUNT(id), payload)
            console.log("🚀 ~ billDiscount ~ data:", data)
            return data
        } catch (error) {
            console.log("🚀 ~ billDiscount ~ error:", error)
            
        } finally {
            setLoading(false)
        }

    }

    const deleteBill = async (id) => {
        setLoading(true);
        try {
            const {data} = api.delete(ENDPOINTS.BILLS.DELETE(id))
            return data;
        } catch (error) {
            console.log("🚀 ~ deleteBill ~ error:", error)
            
        } finally {
            setLoading(false);
        }
    }

    const getById = async (id) => {
        setLoading(true);
        try {
            const {data} = api.get(ENDPOINTS.BILLS.BY_ID(id));
             setBills(data)
            return data;
        } catch (error) {
            console.log("🚀 ~ getById ~ error:", error)
            
        } finally {
            setLoading(false)
        }

    }

    const getPatientById = async (patientId) => {
        setLoading(true);
        try {
            const {data} = api.get(ENDPOINTS.BILLS.BY_PATIENT(patientId));
            console.log("🚀 ~ getPatientById ~ data:", data)
             setBills(data)
            return data;
        } catch (error) {
            console.log("🚀 ~ getPatientById ~ error:", error)
            
        } finally {
            setLoading(false)
        }
    }

    return(
        <BillContext.Provider value={{selectedBill, setSelectedBill , getAllBills,getById,getPatientById,generateBill, markAsPaid, billDiscount, deleteBill , bills, loading}}>{children}</BillContext.Provider>
    )

}

export const useBill = () => useContext(BillContext);