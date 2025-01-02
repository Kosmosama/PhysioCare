import Patient from "../models/patient.js";
// import { ROLES } from "../utils/constants.js";
// import { createUser } from "./userController.js";

// Returns the list of all patients registered in the clinic
const getPatients = async (req, res) => {
    const { name } = req.query;

    try {
        let query = {};

        if (name) {
            query.name = new RegExp(name, 'i');
        }

        const patients = await Patient.find(query);

        res.render('pages/patients/patients_list', {
            title: "Patients List",
            patients,
            filter: { name }
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

// Retrieve patient by name or surname.
// const findPatientsByNameOrSurname = async (req, res) => {
//     const { name, surname } = req.query;

//     try {
//         const query = {};
//         if (name || surname) {
//             query.$and = []; 
//             if (name) query.$and.push({ name: { $regex: name, $options: "i" } });
//             if (surname) query.$and.push({ surname: { $regex: surname, $options: "i" } });
//         }

//         const patients = await Patient.find(query);

//         if (patients.length === 0) return res.status(404).json({ error: "No patients found with those criteria." });

//         res.status(200).json({ result: patients });
//     } catch (error) {
//         res.status(500).json({ error: "An error occurred while fetching patients." });
//     }
// };

// Insert a new patient
// const addPatient = async (req, res) => {
//     const { name, surname, birthDate, address, insuranceNumber, login, password } = req.body;

//     try {
//         // const user = createUser({ login: login, password: password, role: ROLES.PATIENT });
        
//         const newPatient = new Patient({
//             // _id: user._id,
//             name,
//             surname,
//             birthDate,
//             address,
//             insuranceNumber
//         });
        
//         const savedPatient = await newPatient.save();
//         res.status(201).json({ result: savedPatient });
//     } catch (error) {
//         if (error.name === 'ValidationError') return res.status(400).json({ error: "Validation failed: " + error.message });
        
//         // 11000 -> Trying to duplicate value on unique field
//         if (error.code === 11000) return res.status(400).json({ error: "Insurance number must be unique." });
        
//         res.status(400).json({ error: "An error occurred while adding the patient: " + error.message });
//     }
// };

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
                if (error.errors.name) {
                    errors.name = error.errors.name.message;
                }
                if (error.errors.surname) {
                    errors.surname = error.errors.surname.message;
                }
                if (error.errors.birthDate) {
                    errors.birthDate = error.errors.birthDate.message;
                }
                if (error.errors.insuranceNumber) {
                    errors.insuranceNumber = error.errors.insuranceNumber.message;
                }
                if (error.errors.address) {
                    errors.address = error.errors.address.message;
                }
            }
    
            if (error.code === 11000) {
                errors.insuranceNumber = "Insurance number must be unique.";
            }
    
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

export { getPatients, getPatient, updatePatient, deletePatient, editPatient }; // , findPatientsByNameOrSurname, addPatient
