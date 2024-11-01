import Record from "../models/record.js";
import Patient from "../models/patient.js";

// Returns the list of all records registered in the clinic
const getRecords = async (req, res) => {
    try {
        const records = await Record.find();

        if (records.length === 0) return res.status(404).json({ message: "No records found in system." });

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching records." });
    }
};

// Retrieve details from a specific record
const getRecord = async (req, res) => {
    const { id } = req.params;

    try {
        const record = await Record.findById(id);

        if (!record) return res.status(404).json({ message: "Record not found." });

        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching record: " + id });
    }
}

// Retrieve records by patient surname
const findRecordsBySurname = async (req, res) => {
    try {
        const { surname } = req.query;

        // #TODO What should happen when surname is not specified 400? should I trim? case insensitive?
        const patients = await Patient.find({ surname: surname }).select('_id');
        
        if (patients.length === 0) return res.status(404).json({ message: "No records found for the patient(s) with that surname." });

        const patientIds = patients.map(patient => patient._id);

        const records = await Record.find({ patient: { $in: patientIds } });

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching records." });
    }
};

// Insert a new record
const addRecord = async (req, res) => {
    try {
        const { patient, medicalRecord } = req.body;

        if (!patient) return res.status(400).json({ message: "Patient ID is required." });
        if (!medicalRecord) return res.status(400).json({ message: "Medical record information is required." });

        const newRecord = new Record({
            patient,
            medicalRecord,
            appointments: []
        });

        const savedRecord = await newRecord.save();

        res.status(201).json(savedRecord);
    } catch (error) {
        // #TODO 400? no 500?
        res.status(400).json({ message: "Error creating record: " + error.message });
    }
};

// Insert a new appointment o a record
const addAppointmentToRecord = async (req, res) => {
    const { id } = req.params;
    const { date, physio, diagnosis, treatment, observations } = req.body;

    try {
        const appointmentDate = new Date(date);
        if (isNaN(appointmentDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format." });
        }
        
        const record = await Record.findById(id);

        if (!record) return res.status(404).json({ message: "Record not found." });


        const newAppointment = {
            date: appointmentDate,
            physio,
            diagnosis,
            treatment,
            observations
        };
        record.appointments.push(newAppointment);

        const updatedRecord = await record.save();

        res.status(201).json(updatedRecord);
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ error: "Validation failed: " + error.message });

        res.status(500).json({ message: "An internal server error occurred while updating the record." });
    }
};

// Delete record by ID
const deleteMedicalRecord = async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedRecord = await Record.findByIdAndDelete(id);

        if (!deletedRecord) return res.status(404).json({ message: "Record not found." });

        res.status(200).json(deletedRecord);
    } catch (error) {
        res.status(500).json({ message: "An internal server error occurred while deleting the record." });
    }
};

export { getRecords, getRecord, findRecordsBySurname, addRecord, addAppointmentToRecord, deleteMedicalRecord };