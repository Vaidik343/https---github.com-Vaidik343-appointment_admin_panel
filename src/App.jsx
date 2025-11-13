import { Routes, Route } from "react-router-dom";
import ResponsiveDrawer from "./components/Sidebar";
import Appointment from "./pages/Appointment";
import BillPage from "./pages/Bill";
import Patients from "./pages/Patient";
import Doctor from "./pages/Doctor";
import Service from "./pages/Service";
import Analytics from "./Pages/Analytics";
import Backup from "./Pages/Backup";

function App() {
  return (
    <Routes>
      {/* All nested routes go INSIDE the ResponsiveDrawer */}
      <Route path="/" element={<ResponsiveDrawer />}>
        <Route path="appointments" element={<Appointment />} />
        <Route path="bills" element={<BillPage />} />
        <Route path="patients" element={<Patients />} />
        <Route path="doctors" element={<Doctor />} />
        <Route path="services" element={<Service />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="backup" element={<Backup />} />
      </Route>
    </Routes>
  );
}

export default App;
