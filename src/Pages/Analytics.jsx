import React, { useEffect, useState } from "react";
import { usePatient } from "../context/PatientContext";
import { useAppointment } from "../context/AppointmentContext";
import { useBill } from "../context/BillContext";
import { Card, CardBody } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Analytics = () => {
  const { patient, getAllPatients } = usePatient();
  const { appointments, getAllAppointment } = useAppointment();
  const { bills, getAllBills } = useBill();

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    getAllPatients();
    getAllAppointment();
    getAllBills();
  }, []);

  useEffect(() => {
    if (bills && bills.length > 0) {
      const total = bills.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
      setTotalRevenue(total);

      // Group revenue by month
      const monthlyMap = {};
      bills.forEach((b) => {
        const month = new Date(b.created_at).toLocaleString("default", { month: "short" });
        monthlyMap[month] = (monthlyMap[month] || 0) + Number(b.total_amount);
      });

      const formatted = Object.entries(monthlyMap).map(([month, revenue]) => ({ month, revenue }));
      setMonthlyData(formatted);
    }
  }, [bills]);

  return (
    <div className="p-4">
      <h2 className="mb-4">📊 Dashboard Analytics</h2>

      {/* Top Stats */}
      <div className="d-flex gap-4 mb-4">
        <Card className="p-3 flex-fill text-center bg-light shadow-sm">
          <h5>Total Patients</h5>
          <h3>{patient?.length || 0}</h3>
        </Card>

        <Card className="p-3 flex-fill text-center bg-light shadow-sm">
          <h5>Total Appointments</h5>
          <h3>{appointments?.length || 0}</h3>
        </Card>

        <Card className="p-3 flex-fill text-center bg-light shadow-sm">
          <h5>Total Revenue</h5>
          <h3>₹{totalRevenue.toFixed(2)}</h3>
        </Card>
      </div>

      {/* Charts */}
      <div className="d-flex flex-wrap gap-4">
        {/* Revenue by Month */}
        <Card className="p-3 flex-fill">
          <h5 className="mb-3">Monthly Revenue</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#0d6efd" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Appointments by Month */}
        <Card className="p-3 flex-fill">
          <h5 className="mb-3">Appointments by Month</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                data={[
                  { name: "Booked", value: appointments?.filter(a => a.status === "Booked").length || 0 },
                //   { name: "Pending", value: appointments?.filter(a => a.status === "Pending").length || 0 },
                  { name: "Cancelled", value: appointments?.filter(a => a.status === "Cancelled").length || 0 }
                ]}
                outerRadius={100}
                fill="#8884d8"
                label
              >
                <Cell fill="#28a745" />
                {/* <Cell fill="#ffc107" /> */}
                <Cell fill="#dc3545" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
