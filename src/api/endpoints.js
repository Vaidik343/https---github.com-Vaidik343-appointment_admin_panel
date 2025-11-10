export const ENDPOINTS = {
    PATIENTS: {
        ALL:"/patient",
        CREATE:"/patient",
        LOGIN: '/patient/login',
        BY_STAFF: '/patient/staff',
        BY_ID: (id) =>`/patient/${id}`,  // single patient
        UPDATE_BY_ID:(id) =>`/patient/${id}`,
        DELETE:(id) =>`/patient/${id}`,
    },

    APPOINTMENTS: {
        ALL: "/appointment",
        CREATE: "/appointment",
        CANCEL: (id) =>`/appointment/${id}`, //cancel appointment
        BY_PATIENT_ID: (id) =>`/appointment/${id}`,   //appoinment by patient id
    },

    APPOINTMENTS_SERVICE: {
        ALL: "appointment-service",
        CREATE:"appointment-service",
        BY_ID: (id) => `appointment-service/${id}`,
        UPDATE_BY_ID: (id) => `appointment-service/${id}`,
        DELETE: (id) => `appointment-service/${id}`,

    },
    
    BILLS: {
    ALL: "/bill",
    CREATE: "/bill",
    BY_ID: (id) => `/bill/${id}`,                       // GET one bill
    BY_PATIENT: (patientId) => `/bill/patient/${patientId}`,
    MARKED_PAY: (id) => `bill/${id}/pay`,                   // PATCH mark as paid
    DISCOUNT: (id) => `bill/${id}/discount`,
    DELETE: (id) => `/bill/${id}`,
    },

    DOCTOR: {
        ALL: "/doctor",
        CREATE: "/doctor",
        BY_ID: (id) => `/doctor/${id}`,
    },

    GENERAL_SERVICES: {
        ALL: "/general",
        CREATE: "/general",
        BY_ID: (id) => `/general/${id}`,
        UPDATE_BY_ID: (id) => `/general/${id}`,
        DELETE: (id) => `/general/${id}`
    },

    DOCTOR_SERVICES: {
        ALL: (doctorId) => `/doctor/${doctorId}`,
        CREATE: "/doctor",
        BY_ID: (id) => `/doctor/${id}`,
        UPDATE_BY_ID: (id) => `/doctor/${id}`,
        DELETE: (id) => `/doctor/${id}`,
        AVAILABLE: (doctorId) => `/available/${doctorId}`
    }
}