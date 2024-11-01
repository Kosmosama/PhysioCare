import Patient from "../models/patient.js";

// Returns the list of all patients registered in the clinic
const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find();

        if (patients.length === 0) return res.status(404).json({ message: "No patients found in system." });

        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching patients." });
    }
};

// Retrieve details from a specific client
const getPatient = async (req, res) => {
    const { id } = req.params;

    try {
        const patient = await Patient.findById(id);

        if (!patient) return res.status(404).json({ message: "Patient not found." });

        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching patient: " + id });
    }
};

// Retrieve patient by name or surname. 
// #TODO Ask if it is an OR or an AND statement, as to say, if patient has to match name & surname or only one
const findPatientsByNameOrSurname = async (req, res) => {
    const { name, surname } = req.query;

    try {
        const query = {};
        if (name || surname) {
            query.$or = [];
            if (name) query.$or.push({ name: { $regex: name, $options: "i" } });
            if (surname) query.$or.push({ surname: { $regex: surname, $options: "i" } });
        }

        const patients = await Patient.find(query);

        if (patients.length === 0) return res.status(404).json({ message: "No patients found with those criteria." });

        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching patients." });
    }
};

// Insert a new patient
// #TODO No error 500?
const addPatient = async (req, res) => {
    const { name, surname, birthDate, address, insuranceNumber } = req.body;

    const newPatient = new Patient({
        name,
        surname,
        birthDate,
        address,
        insuranceNumber
    });

    try {
        const savedPatient = await newPatient.save();
        res.status(201).json(savedPatient);
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ error: "Validation failed: " + error.message });
        
        // 11000 -> Trying to duplicate value on unique field
        if (error.code === 11000) return res.status(400).json({ error: "Insurance number must be unique." });
        
        res.status(400).json({ error: "An error occurred while adding the patient: " + error.message });
        // (?) res.status(500).json({ error: "An internal server error occurred while adding the patient." });
    }
};

// Update patient data by ID
const updatePatient = async (req, res) => {
    const { id } = req.params;
    const { name, surname, birthDate, address, insuranceNumber } = req.body;

    try {
        const updatedPatient = await Patient.findByIdAndUpdate(
            id,
            { name, surname, birthDate, address, insuranceNumber },
            { new: true, runValidators: true }
        );

        if (!updatedPatient) return res.status(404).json({ error: "Patient not found." });

        res.status(200).json(updatedPatient);
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ error: "Validation failed: " + error.message });

        if (error.code === 11000) return res.status(400).json({ error: "Insurance number must be unique." });

        res.status(500).json({ error: "An internal server error occurred while updating the patient." });
    }
};

// Delete patient by ID
const deletePatient = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPatient = await Patient.findByIdAndDelete(id);

        if (!deletedPatient) return res.status(404).json({ error: "Patient not found." });

        res.status(200).json(deletedPatient);
    } catch (error) {
        res.status(500).json({ error: "An internal server error occurred while deleting the patient." });
    }
};

export { getPatients, getPatient, findPatientsByNameOrSurname, addPatient, updatePatient, deletePatient };
