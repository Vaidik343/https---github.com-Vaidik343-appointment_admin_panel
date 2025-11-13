# TODO: Fix Loading Issue on Navigation in Admin Dashboard

## Plan Overview
Move initial data fetching from page components to context providers to prevent refetching on route changes. This ensures data is loaded once on app initialization.

## Steps to Complete

### 1. Modify Context Providers to Fetch Data on Mount
- [ ] Update DoctorContext.jsx: Add useEffect in provider to call getAllDoctor() on mount
- [ ] Update ServiceContext.jsx: Add useEffect in provider to call getAllGeneralServices() on mount
- [ ] Update PatientContext.jsx: Add useEffect in provider to call getAllPatients() on mount
- [ ] Update AppointmentContext.jsx: Add useEffect in provider to call getAllAppointment() on mount
- [ ] Update BillContext.jsx: Add useEffect in provider to call getAllBills() on mount

### 2. Remove useEffect from Page Components
- [ ] Remove useEffect from Doctor.jsx
- [ ] Remove useEffect from Service.jsx
- [ ] Remove useEffect from Patient.jsx
- [ ] Remove useEffect from Appointment.jsx
- [ ] Remove useEffect from Bill.jsx

### 3. Handle Dependent Fetches
- [ ] Check ServiceTable.jsx for redundant getAllDoctor() call and remove if covered by context
- [ ] Ensure Appointment.jsx's multiple fetches are handled (doctors, patients, appointments)

### 4. Testing
- [ ] Navigate between pages and verify no loading spinners on route changes
- [ ] Confirm data persists across navigation
- [ ] Test CRUD operations still work without refetching issues
