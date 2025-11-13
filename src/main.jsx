import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { PatientProvider } from './context/PatientContext.jsx'
import { AppointmentProvider } from './context/AppointmentContext.jsx'
import { BillProvider } from './context/BillContext.jsx'
import { DoctorProvider } from './context/DoctorContext.jsx'
import { ServiceProvider } from './context/ServiceContext.jsx'
import { AppointmentServiceProvider } from './context/AppointmentServiceContext.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { SearchProvider } from './context/SearchContext.jsx'
import { BackupProvider } from './context/BackupContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <SearchProvider>
    <Router>
      <PatientProvider>
        <AppointmentProvider>
          <BillProvider>
            <DoctorProvider>
              <ServiceProvider>
                <AppointmentServiceProvider>
                  <BackupProvider>
                    <App />
                    <Toaster />
                  </BackupProvider>
                </AppointmentServiceProvider>
              </ServiceProvider>
            </DoctorProvider>
          </BillProvider>
        </AppointmentProvider>
      </PatientProvider>
    </Router>
      </SearchProvider>
  </StrictMode>,
)
