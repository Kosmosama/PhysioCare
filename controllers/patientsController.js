import Patient from "../models/patient.js";

// Returns the list of all patients registered in the clinic
const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find();

        if (patients.length === 0) {
            return res.status(404).json({ message: "No patients found in system." });
        }

        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching patients." });
    }
};

// Retrieve details from a specific client
const getPatient = async (req, res) => {
    const { patientId } = req.params;

    try {
        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching patient: " + patientId });
    }
};

// Retrieve patient by name or surname. 
// #TODO Ask if it is an OR or an AND statement, as to say, if patient has to match name & surname or only one
const findPatientByNameOrSurname = async (req, res) => {
    const { name, surname } = req.query;

    try {
        const query = {};
        if (name || surname) {
            query.$or = [];
            if (name) query.$or.push({ name: { $regex: name, $options: "i" } });
            if (surname) query.$or.push({ surname: { $regex: surname, $options: "i" } });
        }

        const patients = await Patient.find(query);

        if (patients.length === 0) {
            return res.status(404).json({ message: "No patients found with those criteria." });
        }

        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching patients." });
    }
};

export { getPatients, getPatient };
