import Record from "../models/record.js";
import Patient from "../models/patient.js";
import Physio from "../models/physio.js";

// Returns the list of all records registered in the clinic
const getRecords = async (req, res) => {
    try {
        const records = await Record.find().populate('patient', 'name surname');

        res.render('pages/records/records_list', {
            title: "Records List",
            records
        });
    } catch (error) {
        console.error(error);
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
        console.error(error);
        res.status(500).render('pages/error', {
            title: "Error",
            error: "An error occurred while fetching the record details.",
            code: 500
        });
    }
};

// Retrieve records by patient surname
// const findRecordsBySurname = async (req, res) => {
//     const { surname } = req.query;
    
//     try {
//         const patients = await Patient.find({ surname: surname }).select('_id');
        
//         if (patients.length === 0) return res.status(404).json({ error: "No records found for the patient(s) with that surname." });

//         const patientIds = patients.map(patient => patient._id);

//         const records = await Record.find({ patient: { $in: patientIds } }).populate("patient");

//         res.status(200).json({ result: records });
//     } catch (error) {
//         res.status(500).json({ error: "An error occurred while fetching records." });
//     }
// };

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

        const existingRecord = await Record.findOne({ patient: patientId });
        if (existingRecord) {
            return res.status(400).render('pages/error', {
                title: "Record Already Exists",
                error: `A record already exists for the patient with ID: ${patientId}`,
                code: 400
            });
        }

        const newRecord = new Record({
            patient: patient._id,
            medicalRecord,
            appointments: []
        });

        await newRecord.save();

        res.status(200).redirect(`/patients/${patientId}`);
    } catch (error) {
        console.error(error);
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
        res.render('pages/records/record_add', {
            title: "Add Medical Record",
            patientId: patientId || null
        });
    } catch (error) {
        console.error(error);
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
        console.error(error);
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

        record.appointments.push({
            date,
            physio,
            diagnosis,
            treatment,
            observations
        });

        await record.save();

        res.redirect(`/records/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', {
            title: "Error",
            error: "An error occurred while adding the appointment.",
            code: 500
        });
    }
}

// Delete record by ID
// const deleteMedicalRecord = async (req, res) => {
//     const { id } = req.params;
    
//     try {
//         const deletedRecord = await Record.findOneAndDelete({ patient: id });

//         if (!deletedRecord) return res.status(404).json({ error: "Record not found." });

//         res.status(200).json({ result: deletedRecord });
//     } catch (error) {
//         res.status(500).json({ error: "An error occurred while deleting the record." });
//     }
// };

// export { getRecords, getRecord, findRecordsBySurname, addRecord, addAppointmentToRecord, deleteMedicalRecord };
export { addRecord, createRecord, getRecords, getRecord, addAppointmentToRecord, addAppointment };