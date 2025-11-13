import React, { createContext, useContext, useState } from "react";
import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
import toast from "react-hot-toast";

const BackupContext = createContext();

export const BackupProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // ✅ Trigger full database backup
  const triggerFullBackup = async () => {
    setLoading(true);
    try {
      const response = await api.get(ENDPOINTS.BACKUP.FULL, {
        responseType: 'blob', // Important for file downloads
      });
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `full_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Full database backup downloaded");
    } catch (error) {
      toast.error("Failed to trigger full backup");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Trigger table-specific backup
  const triggerTableBackup = async (tableName) => {
    if (!tableName || !/^[a-zA-Z0-9_]+$/.test(tableName)) {
      toast.error("Invalid table name");
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(ENDPOINTS.BACKUP.TABLE(tableName), {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${tableName}_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${tableName} backup downloaded`);
    } catch (error) {
      toast.error(`Failed to trigger ${tableName} backup`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackupContext.Provider
      value={{
        triggerFullBackup,
        triggerTableBackup,
        loading,
      }}
    >
      {children}
    </BackupContext.Provider>
  );
};

export const useBackup = () => useContext(BackupContext);
