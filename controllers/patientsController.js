import Patient from "../models/patient.js";
import User from "../models/user.js";
import { deleteImage } from "../middlewares/uploads.js";
import { ROLES } from "../utils/constants.js";
import { hasRecord } from "./recordsController.js";

// Returns the list of all patients registered in the clinic
const getPatients = async (req, res) => {
    const { name, surname } = req.query;

    try {
        const query = {};
        if (name || surname) {
            const conditions = [];
            if (name) conditions.push({ name: { $regex: name.trim(), $options: "i" } });
            if (surname) conditions.push({ surname: { $regex: surname.trim(), $options: "i" } });
            if (conditions.length > 0) query.$and = conditions;
        }

        let patients = await Patient.find(query);

        if (patients.length === 0) {
            return res.status(404).render('pages/error', {
                title: "Patients Not Found",
                error: "No patients found with those criteria.",
                code: 404
            });
        }

        patients = await Promise.all(
            patients.map(async (patient) => ({
                ...patient.toObject(),
                hasRecord: await hasRecord(patient._id),
            }))
        );

        res.render('pages/patients/patients_list', {
            title: "Patients List",
            patients,
            filter: { name, surname }
        });
    } catch (error) {
        res.status(500).render('pages/error', {
            title: "Error",
            error: "An error occurred while fetching patients.",
            code: 500
        });
    }
};

// Retrieve details from a specific client
const getPatient = async (req, res) => {
    const { id } = req.params;

    if (req.user.rol === ROLES.PATIENT && req.user.id !== id) {
        return res.status(403).render('pages/error', {
            title: "Forbidden",
            error: "Forbidden: Insufficient role privileges.",
            code: 403
        });
    }

    try {
        let patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).render('pages/error', {
                title: "Patient Not Found",
                error: `No patient found with ID: ${id}`,
                code: 404
            });
        }

        patient = {
            ...patient.toObject(),
            hasRecord: await hasRecord(patient._id)
        }

        res.status(200).render('pages/patients/patient_detail', {
            title: `Patient Details - ${patient.name} ${patient.surname}`,
            patient
        });
    } catch (error) {
        res.status(500).render('pages/error', {
            title: "Error",
            error: `An error occurred while fetching the patient with ID: ${id}`,
            code: 500
        });
    }
};

// Insert a new patient
const addPatient = async (req, res) => {
    const { name, surname, birthDate, address, insuranceNumber, login, password } = req.body;

    try {
        let image = null;
        if (req.file) {
            image = `/public/uploads/${req.file.filename}`;
        }

        const newUser = new User({
            login,
            password,
            rol: ROLES.PATIENT
        });

        const savedUser = await newUser.save();

        try {
            const newPatient = new Patient({
                _id: savedUser._id,
                name,
                surname,
                birthDate,
                address,
                insuranceNumber,
                image
            });

            const savedPatient = await newPatient.save();

            return res.status(201).render('pages/patients/patient_detail', {
                title: `Patient Added - ${savedPatient.name} ${savedPatient.surname}`,
                patient: savedPatient,
                message: "Patient successfully added!"
            });

        } catch (error) {
            await User.findByIdAndDelete(savedUser._id);
            throw error;
        }
    } catch (error) {
        if (req.file) {
            deleteImage(req.file.filename);
        }

        const errors = { general: "An error occurred while processing the request." };

        if (error.name === 'ValidationError' || error.code === 11000) {
            if (error.errors) {
                if (error.errors.name) errors.name = error.errors.name.message;
                if (error.errors.surname) errors.surname = error.errors.surname.message;
                if (error.errors.birthDate) errors.birthDate = error.errors.birthDate.message;
                if (error.errors.insuranceNumber) errors.insuranceNumber = error.errors.insuranceNumber.message;
                if (error.errors.address) errors.address = error.errors.address.message;
                if (error.errors.login) errors.login = error.errors.login.message;
                if (error.errors.password) errors.password = error.errors.password.message;
            }

            if (error.code === 11000) {
                if (error.message.includes('insuranceNumber')) {
                    errors.insuranceNumber = "Insurance number must be unique.";
                }
                if (error.message.includes('login')) {
                    errors.login = "Login must be unique.";
                }
            }

            return res.render('pages/patients/patient_add', {
                title: "Add Patient - Validation Error",
                patient: { name, surname, birthDate, address, insuranceNumber, login },
                errors
            });
        }

        res.status(500).render('pages/error', {
            title: "Internal Server Error",
            error: "An error occurred while processing the request.",
            code: 500
        });
    }
};

// Show add patient form
const showAddPatient = (req, res) => {
    res.render('pages/patients/patient_add', {
        title: "Add Patient"
    });
};

// Update patient data by ID
const updatePatient = async (req, res) => {
    const { id } = req.params;
    const { name, surname, birthDate, address, insuranceNumber } = req.body;

    try {
        const updateData = {};
        const patientToUpdate = await Patient.findById(id);

        if (!patientToUpdate) {
            return res.status(404).render('pages/error', {
                title: "Patient Not Found",
                error: `No patient found with ID: ${id}`,
                code: 404
            });
        }

        if (name) updateData.name = name;
        if (surname) updateData.surname = surname;
        if (birthDate) updateData.birthDate = birthDate;
        if (address) updateData.address = address;
        if (insuranceNumber) updateData.insuranceNumber = insuranceNumber;
        if (req.file) updateData.image = `/public/uploads/${req.file.filename}`;

        const updatedPatient = await Patient.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (req.file && patientToUpdate.image) deleteImage(patientToUpdate.image);

        res.status(200).render('pages/patients/patient_detail', {
            title: `Patient Updated - ${updatedPatient.name} ${updatedPatient.surname}`,
            patient: updatedPatient,
            message: "Patient successfully updated!"
        });
    } catch (error) {
        if (req.file) {
            deleteImage(req.file.filename);
        }

        const errors = { general: "An error occurred while updating the patient." };

        if (error.name === 'ValidationError' || error.code === 11000) {
            if (error.errors) {
                if (error.errors.name) errors.name = error.errors.name.message;
                if (error.errors.surname) errors.surname = error.errors.surname.message;
                if (error.errors.birthDate) errors.birthDate = error.errors.birthDate.message;
                if (error.errors.insuranceNumber) errors.insuranceNumber = error.errors.insuranceNumber.message;
                if (error.errors.address) errors.address = error.errors.address.message;
            }
    
            if (error.code === 11000) errors.insuranceNumber = "Insurance number must be unique.";
    
            return res.render('pages/patients/patient_edit', {
                title: "Edit Patient - Validation Error",
                patient: { _id: id, name, surname, birthDate, address, insuranceNumber },
                errors
            });
        }

        res.status(500).render('pages/error', {
            title: "Internal Server Error",
            error: `An error occurred while updating the patient with ID: ${id}`,
            code: 500
        });
    }
};

// Delete patient by ID
const deletePatient = async (req, res) => {
    const { id } = req.params;

    try {
        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).render('pages/error', {
                title: "Patient Not Found",
                error: `No patient found with ID: ${id}`,
                code: 404
            });
        }

        if (patient.image) {
            deleteImage(patient.image);
        }

        await Patient.findByIdAndDelete(id);
        await User.findByIdAndDelete(id);

        res.redirect(req.baseUrl);
    } catch (error) {
        res.status(500).render('pages/error', {
            title: "Internal Server Error",
            error: `An error occurred while deleting the patient with ID: ${id}`,
            code: 500
        });
    }
};

// Edit patient data by ID
const editPatient = async (req, res) => {
    const { id } = req.params;

    try {
        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).render('pages/error', {
                title: "Patient Not Found",
                error: `No patient found with ID: ${id}`,
                code: 404
            });
        }

        res.render('pages/patients/patient_edit', {
            title: "Edit Patient",
            patient
        });
    } catch (error) {
        res.status(500).render('pages/error', {
            title: "Internal Server Error",
            error: "An error occurred while fetching the patient for editing.",
            code: 500
        });
    }
};

export { getPatients, getPatient, updatePatient, deletePatient, editPatient, showAddPatient, addPatient };
