import Patient from "../models/patient.js";
import User from "../models/user.js";
import { ROLES } from "../utils/constants.js";

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

        const patients = await Patient.find(query);

        if (patients.length === 0) {
            return res.status(404).render('pages/error', {
                title: "Patients Not Found",
                error: "No patients found with those criteria.",
                code: 404
            });
        }

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

    try {
        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).render('pages/error', {
                title: "Patient Not Found",
                error: `No patient found with ID: ${id}`,
                code: 404
            });
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
            login: login,
            password: password,
            rol: ROLES.PATIENT
        });
        
        await newUser.save();
        
        const newPatient = new Patient({
            _id: newUser._id,
            name,
            surname,
            birthDate,
            address,
            insuranceNumber,
            image // #TODO If this fails, delete image (also delete user)
        });
        
        const savedPatient = await newPatient.save();

        res.status(201).render('pages/patients/patient_detail', {
            title: `Patient Added - ${savedPatient.name} ${savedPatient.surname}`,
            patient: savedPatient,
            message: "Patient successfully added!"
        });
    } catch (error) {
        const errors = { general: "An error occurred while creating the patient." };

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
            error: "An error occurred while adding the patient.",
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
        const updateData = { name, surname, birthDate, address, insuranceNumber };

        if (req.file) {
            updateData.image = `/public/uploads/${req.file.filename}`;
        }

        const updatedPatient = await Patient.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPatient) {
            return res.status(404).render('pages/error', {
                title: "Patient Not Found",
                error: `No patient found with ID: ${id}`,
                code: 404
            });
        }

        res.status(200).render('pages/patients/patient_detail', {
            title: `Patient Updated - ${updatedPatient.name} ${updatedPatient.surname}`,
            patient: updatedPatient,
            message: "Patient successfully updated!"
        });
    } catch (error) {
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
    
            return res.render('pages/patients/edit_patient', {
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
    // #TODO Delete user as well
    try {
        const deletedPatient = await Patient.findByIdAndDelete(id);

        if (!deletedPatient) {
            return res.status(404).render('pages/error', {
                title: "Patient Not Found",
                error: `No patient found with ID: ${id}`,
                code: 404
            });
        }

        // #MAYBE to show a confirmation that the patient has been deleted
        // res.status(200).render('pages/success', {
        //     title: "Patient Deleted",
        //     message: `Patient with ID ${id} has been successfully deleted.`
        // });

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
