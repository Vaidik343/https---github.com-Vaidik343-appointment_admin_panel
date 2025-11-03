import React, { useEffect, useState } from "react";
import { useDoctor } from "../context/DoctorContext";
import { usePatient } from "../context/PatientContext";
import { useAppointment } from "../context/AppointmentContext";
import { Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";

const AppointmentForm = ({ onClose }) => {
  const { getAllDoctor, doctor } = useDoctor();
  const { getAllPatients, patient } = usePatient();
  const { createAppointment, loading, getAllAppointment } = useAppointment();

  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    start_time: "",
    end_time: "",
    status: "Scheduled",
  });

  useEffect(() => {
    getAllDoctor();
    getAllPatients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.patient_id || !form.doctor_id || !form.start_time || !form.end_time) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const res = await createAppointment(form);
      if (res) {
        toast.success("Appointment created successfully!");
        await getAllAppointment(); // refresh list if needed
        onClose && onClose(); // close modal if passed
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to create appointment.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Patient</Form.Label>
        <Form.Select
          name="patient_id"
          value={form.patient_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Patient</option>
          {patient?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Doctor</Form.Label>
        <Form.Select
          name="doctor_id"
          value={form.doctor_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Doctor</option>
          {doctor?.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.specialization})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Start Time</Form.Label>
        <Form.Control
          type="datetime-local"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>End Time</Form.Label>
        <Form.Control
          type="datetime-local"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Form.Select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </Form.Select>
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? "Saving..." : "Create Appointment"}
      </Button>
    </Form>
  );
};

export default AppointmentForm;
