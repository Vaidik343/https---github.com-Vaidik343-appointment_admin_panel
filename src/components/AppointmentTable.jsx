import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { useAppointment } from "../context/AppointmentContext";
import { useDoctor } from "../context/DoctorContext";
import { usePatient } from "../context/PatientContext";
import { useSearch } from "../context/SearchContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const AppointmentTable = () => {
  const { appointments, cancelAppointment } = useAppointment();
  const { doctor } = useDoctor();
  const { patient } = usePatient();
  const { searchQuery } = useSearch();

  if (!appointments || appointments.length === 0) {
    return <Typography>No appointments found...</Typography>;
  }

  // Helper functions
  const getDoctorName = (id) => {
    const found = doctor?.find((d) => d.id === id);
    return found ? found.name : "Unknown Doctor";
  };

  const getPatientName = (id) => {
    const found = patient?.find((p) => p.id === id);
    return found ? found.name : "Unknown Patient";
  };

  const filteredAppointments = appointments.filter((appt) => {
    const doctorName = getDoctorName(appt.doctor_id)?.toLowerCase();
    const patientName = getPatientName(appt.patient_id)?.toLowerCase();
    const status = appt.status?.toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      doctorName.includes(query) ||
      patientName.includes(query) ||
      status.includes(query)
    );
  });

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      cancelAppointment(id);
    }
  }; 

  const columns = [
    "Doctor",
    "Patient",
    "Start Time",
    "End Time",
    "Status",
    "Action",
  ];

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Appointments
      </Typography>

      <TableContainer component={Paper} sx={{ display:"flex", flexDirection:"column" , justifyContent:"center"}}>
        <Table sx={{ width: "81dvw" , height: "25dvh",}}>
          <TableHead>
            <TableRow>
              {columns.map((col, i) => (
                <TableCell key={i} sx={{ fontWeight: "bold" }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell>{getDoctorName(appt.doctor_id)}</TableCell>
                  <TableCell>{getPatientName(appt.patient_id)}</TableCell>
                  <TableCell>
                    {dayjs.utc(appt.start_time).format("DD-MM-YYYY HH:mm")}
                  </TableCell>
                  <TableCell>
                    {dayjs.utc(appt.end_time).format("DD-MM-YYYY HH:mm")}
                  </TableCell>
                  <TableCell>{appt.status}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      disabled={appt.status === "Cancelled"}
                      onClick={() => handleCancel(appt.id)}
                    >
                      {appt.status === "Cancelled" ? "Cancelled" : "Cancel"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ color: "text.secondary" }}
                >
                  No matching appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AppointmentTable;
