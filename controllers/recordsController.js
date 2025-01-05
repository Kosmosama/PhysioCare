import Record from "../models/record.js";
import Patient from "../models/patient.js";
import Physio from "../models/physio.js";

// Returns the list of all records registered in the clinic
const getRecords = async (req, res) => {
    const { surname } = req.query; // There might not be a surname, so it's not required

    try {
        let query = {};
        if (surname) query.surname = surname;

        const records = await Record.find().populate({
            path: 'patient',
            match: query,
            select: 'name surname',
        });

        // Filter out records where the patient did not match the filter (not matching records will have patient as null)
        const filteredRecords = records.filter(record => record.patient);

        if (filteredRecords.length === 0) {
            return res.status(404).render('pages/error', {
                title: "Records Not Found",
                error: "No records found with those criteria.",
                code: 404
            });
        }

        res.render('pages/records/records_list', {
            title: "Records List",
            records: filteredRecords,
            filter: { surname }
        });
    } catch (error) {
        res.status(500).render('pages/error', {
            title: "Error",
            error: "An error occurred while fetching the records.",
            code: 500
        });
    }
};

// Retrieve details from a specific record
const getRecord = async (req, res) => {
    const { id } = req.params;

    try {
        const record = await Record.findById(id)
            .populate('patient', 'name surname')
            .populate('appointments.physio', 'name');

        if (!record) {
            return res.status(404).render('pages/error', {
                title: "Record Not Found",
                error: `No record found with ID: ${id}`,
                code: 404
            });
        }

        res.render('pages/records/record_detail', {
            title: `Record Details - ${record.patient.name} ${record.patient.surname}`,
            record
        });
    } catch (error) {
        res.status(500).render('pages/error', {
            title: "Error",
            error: "An error occurred while fetching the record details.",
            code: 500
        });
    }
};

// Insert a new record
const addRecord = async (req, res) => {
    const { patientId, medicalRecord } = req.body;

    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).render('pages/error', {
                title: "Patient Not Found",
                error: `No patient found with ID: ${patientId}`,
                code: 404
            });
        }

        // #TODO Button won't show if record already exists // Could also be checked with the error 11000
        const existingRecord = await Record.findOne({ patient: patientId });
        if (existingRecord) {
            return res.status(400).render('pages/records/record_add', {
                title: "Record Already Exists",
                error: `A record already exists for the patient with ID: ${patientId}`,
                patientId,
                medicalRecord
            });
        }

        const newRecord = new Record({
            patient: patient._id,
            medicalRecord,
            appointments: []
        });

        await newRecord.save();

        res.status(200).redirect(`/records`);
    } catch (error) {
        const errors = { general: "An error occurred while creating the record." };

        if (error.name === 'ValidationError' || error.code === 11000) {
            if (error.errors.patient) errors.patient = error.errors.patient.message;
            if (error.errors.medicalRecord) errors.medicalRecord = error.errors.medicalRecord.message;
        
            if (error.code === 11000) errors.patient = "A record already exists for this patient.";

            res.status(400).render('pages/records/record_add', {
                title: "Add Medical Record - Validation Error",
                errors,
                patientId,
                medicalRecord
            });
        }

        res.status(500).render('pages/error', {
            title: "Error",
            error: "An error occurred while adding the medical record.",
            code: 500
        });
    }
};

// Show record creation form
const createRecord = async (req, res) => {
    const { patientId } = req.query;

    try {
        // SELECT p.id AS _id, p.name, p.surname
        // FROM patients p
        // LEFT JOIN records r
        // ON p.id = r.patient
        // WHERE r.patient IS NULL;
        const patientsWithoutRecords = await Patient.aggregate([
            {
                $lookup: {
                    from: "records",
                    localField: "_id",
                    foreignField: "patient",
                    as: "record"
                }
            },
            {
                $match: {
                    record: { $size: 0 }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    surname: 1
                }
            }
        ]);

        res.render('pages/records/record_add', {
            title: "Add Medical Record",
            patientId: patientId || null,
            patientsWithoutRecords
        });
    } catch (error) {
        res.status(500).render('pages/error', {
            title: "Error",
            error: "An error occurred while loading the form.",
            code: 500
        });
    }
};

// Show new appointment form
const addAppointment = async (req, res) => {
    const { id } = req.params;

    try {
        const record = await Record.findById(id).populate("patient");
        if (!record) {
            return res.status(404).render("pages/error", {
                title: "Record Not Found",
                error: `No record found with ID: ${id}`,
                code: 404
            });
        }

        const physios = await Physio.find();

        res.render("pages/records/appointment_add", {
            title: "Add Appointment",
            record,
            physios
        });
    } catch (error) {
        res.status(500).render("pages/error", {
            title: "Error",
            error: "An error occurred while loading the appointment form.",
            code: 500
        });
    }
};

// Add a new appointment to a record
const addAppointmentToRecord = async (req, res) => {
    const { id } = req.params;
    const { date, physio, diagnosis, treatment, observations } = req.body;

    try {
        const record = await Record.findById(id);
        if (!record) {
            return res.status(404).render('pages/error', {
                title: "Record Not Found",
                error: `No record found with ID: ${id}`,
                code: 404
            });
        }

        const appointment = {
            date,
            physio,
            diagnosis,
            treatment,
            observations
        };

        record.appointments.push({
            appointment
        });

        await record.save();

        res.redirect(`/records/${id}`);
    } catch (error) {
        const errors = { general: "An error occurred while adding the appointment." };
        const physios = await Physio.find();

        if (error.name === 'ValidationError') {
            if (error.errors.date) errors.date = error.errors.date.message;
            if (error.errors.physio) errors.physio = error.errors.physio.message;
            if (error.errors.diagnosis) errors.diagnosis = error.errors.diagnosis.message;
            if (error.errors.treatment) errors.treatment = error.errors.treatment.message;
            if (error.errors.observations) errors.observations = error.errors.observations.message;
        
            res.status(400).render('pages/records/record_add', {
                title: "Validation Error",
                error: errors,
                appointment,
                record,
                physios
            });
        }

        res.status(500).render('pages/error', {
            title: "Error",
            error: "An error occurred while adding the appointment.",
            code: 500
        });
    }
};

export { addRecord, createRecord, getRecords, getRecord, addAppointmentToRecord, addAppointment };