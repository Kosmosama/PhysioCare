import Record from "../models/record.js";
import Patient from "../models/patient.js";

// Returns the list of all records registered in the clinic
const getRecords = async (req, res) => {
    try {
        const records = await Record.find();

        if (records.length === 0) return res.status(404).json({ error: "No records found in system." });

        res.status(200).json({ result: records });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching records." });
    }
};

// Retrieve details from a specific record
const getRecord = async (req, res) => {
    const { id } = req.params;
    const { id: userId, rol } = req.user;

    try {
        if (rol === 'patient' && id !== userId) return res.status(403).json({ error: "Forbidden: Patients can only access their own records." });

        const record = await Record.findOne({ patient: id });

        if (!record) return res.status(404).json({ error: "Record not found." });

        res.status(200).json({ result: record });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the record." });
    }
};

// Retrieve records by patient surname
const findRecordsBySurname = async (req, res) => {
    const { surname } = req.query;
    
    try {
        const patients = await Patient.find({ surname: surname }).select('_id');
        
        if (patients.length === 0) return res.status(404).json({ error: "No records found for the patient(s) with that surname." });

        const patientIds = patients.map(patient => patient._id);

        const records = await Record.find({ patient: { $in: patientIds } }).populate("patient");

        res.status(200).json({ result: records });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching records." });
    }
};

// Insert a new record
const addRecord = async (req, res) => {
    const { patient, medicalRecord } = req.body;
    
    // I would add a 400 error here that checks all data was sent

    try {
        if (!patient) return res.status(400).json({ error: "Patient ID is required." });
        if (!medicalRecord) return res.status(400).json({ error: "Medical record information is required." });

        const newRecord = new Record({
            patient,
            medicalRecord,
            appointments: []
        });

        const savedRecord = await newRecord.save();

        res.status(201).json({ result: savedRecord });
    } catch (error) {
        res.status(400).json({ error: "Error creating record: " + error.error });
    }
};

// Insert a new appointment o a record
const addAppointmentToRecord = async (req, res) => {
    const { id } = req.params; // Should be patient id
    const { date, physio, diagnosis, treatment, observations } = req.body;

    try {
        if (isNaN((new Date(date)).getTime())) return res.status(400).json({ error: "Invalid date format." });
        
        const record = await Record.findById(id);

        if (!record) return res.status(404).json({ error: "Record not found." });

        const newAppointment = {
            date: appointmentDate,
            physio,
            diagnosis,
            treatment,
            observations
        };
        record.appointments.push(newAppointment);

        const updatedRecord = await record.save();

        res.status(201).json({ result: updatedRecord });
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ error: "Validation failed: " + error.error });

        res.status(500).json({ error: "An error occurred while updating the record." });
    }
};

// Delete record by ID
const deleteMedicalRecord = async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedRecord = await Record.findByIdAndDelete(id);

        if (!deletedRecord) return res.status(404).json({ error: "Record not found." });

        res.status(200).json({ result: deletedRecord });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the record." });
    }
};

export { getRecords, getRecord, findRecordsBySurname, addRecord, addAppointmentToRecord, deleteMedicalRecord };