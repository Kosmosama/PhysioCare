import Physio from "../models/physio.js";
import User from "../models/user.js";
import { deleteImage } from "../middlewares/uploads.js";
import { ROLES } from "../utils/constants.js";

// Returns the list of all physios registered in the clinic
const getPhysios = async (req, res) => {
    const { specialty } = req.query;

    try {
        let query = {};
        if (specialty) query.specialty = specialty;

        const physios = await Physio.find(query);

        if (physios.length === 0) {
            return res.status(404).render('pages/error', {
                title: "Physios Not Found",
                error: "No physios found with those criteria.",
                code: 404
            });
        }

        res.render('pages/physios/physios_list', {
            title: "Physios List",
            physios,
            filter: { specialty }
        });
    } catch (error) {
        res.status(500).render('pages/error', {
            title: "Error",
            error: "An error occurred while fetching physios.",
            code: 500
        });
    }
};

// Retrieve details from a specific physio
const getPhysio = async (req, res) => {
    const { id } = req.params;

    try {
        const physio = await Physio.findById(id);

        if (!physio) {
            return res.status(404).render('pages/error', {
                title: "Physio Not Found",
                error: `No physio found with ID: ${id}`,
                code: 404
            });
        }

        res.status(200).render('pages/physios/physio_detail', {
            title: `Physio Details - ${physio.name} ${physio.surname}`,
            physio
        });
    } catch (error) {
        res.status(500).render('pages/error', {
            title: "Error",
            error: `An error occurred while fetching the physio with ID: ${id}`,
            code: 500
        });
    }
}

// Show add physio form
const showPhysioAddForm = (req, res) => {
    res.render('pages/physios/physio_add', {
        title: "Add Physio"
    });
};

// Insert a new physio
const addPhysio = async (req, res) => {
    const { name, surname, specialty, licenseNumber, login, password } = req.body;

    try {
        let image = null;
        if (req.file) {
            image = `/public/uploads/${req.file.filename}`;
        }

        const newUser = new User({
            login,
            password,
            rol: ROLES.PHYSIO
        });

        const savedUser = await newUser.save();

        try {
            const newPhysio = new Physio({
                _id: savedUser._id,
                name,
                surname,
                specialty,
                licenseNumber,
                image
            });

            const savedPhysio = await newPhysio.save();

            return res.status(201).render('pages/physios/physio_detail', {
                title: `Physio Added - ${savedPhysio.name} ${savedPhysio.surname}`,
                physio: savedPhysio,
                message: "Physio successfully added!"
            });

        } catch (error) {
            await User.findByIdAndDelete(savedUser._id);
            throw error;
        }
    } catch (error) {
        if (req.file) {
            deleteImage(req.file.filename);
        }

        const errors = { general: "An error occurred while creating the physio." };

        if (error.name === 'ValidationError' || error.code === 11000) {
            if (error.errors) {
                if (error.errors.name) errors.name = error.errors.name.message;
                if (error.errors.surname) errors.surname = error.errors.surname.message;
                if (error.errors.specialty) errors.specialty = error.errors.specialty.message;
                if (error.errors.licenseNumber) errors.licenseNumber = error.errors.licenseNumber.message;
                if (error.errors.login) errors.login = error.errors.login.message;
                if (error.errors.password) errors.password = error.errors.password.message;
            }

            if (error.code === 11000) {
                if (error.message.includes('licenseNumber')) {
                    errors.licenseNumber = "License number must be unique.";
                }
                if (error.message.includes('login')) {
                    errors.login = "Login must be unique.";
                }
            }
    
            return res.render('pages/physios/physio_add', {
                title: "Add Physio - Validation Error",
                physio: { name, surname, specialty, licenseNumber, login },
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

// Update physio data by ID
const updatePhysio = async (req, res) => {
    const { id } = req.params;
    const { name, surname, specialty, licenseNumber } = req.body;

    try {
        const updateData = {};
        const physioToUpdate = await Physio.findById(id);

        if (!physioToUpdate) {
            return res.status(404).render('pages/error', {
                title: "Physio Not Found",
                error: `No physio found with ID: ${id}`,
                code: 404
            });
        }

        if (name) updateData.name = name;
        if (surname) updateData.surname = surname;
        if (specialty) updateData.specialty = specialty;
        if (licenseNumber) updateData.licenseNumber = licenseNumber;
        if (req.file) updateData.image = `/public/uploads/${req.file.filename}`;

        const updatedPhysio = await Physio.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (req.file && physioToUpdate.image) deleteImage(physioToUpdate.image);

        res.status(200).render('pages/physios/physio_detail', {
            title: `Physio Updated - ${updatedPhysio.name} ${updatedPhysio.surname}`,
            physio: updatedPhysio,
            message: "Physio successfully updated!"
        });
    } catch (error) {
        if (req.file) {
            deleteImage(req.file.filename);
        }

        const errors = { general: "An error occurred while updating the physio." };

        if (error.name === 'ValidationError' || error.code === 11000) {
            if (error.errors) {
                if (error.errors.name) errors.name = error.errors.name.message;
                if (error.errors.surname) errors.surname = error.errors.surname.message;
                if (error.errors.specialty) errors.specialty = error.errors.specialty.message;
                if (error.errors.licenseNumber) errors.licenseNumber = error.errors.licenseNumber.message;
            }

            if (error.code === 11000) errors.licenseNumber = "License number must be unique.";

            return res.render('pages/physios/physio_edit', {
                title: "Edit Physio - Validation Error",
                physio: { _id: id, name, surname, specialty, licenseNumber },
                errors
            });
        }

        res.status(500).render('pages/error', {
            title: "Internal Server Error",
            error: `An error occurred while updating the physio with ID: ${id}`,
            code: 500
        });
    }
};

// Show edit physio form
const editPhysio = async (req, res) => {
    const { id } = req.params;

    try {
        const physio = await Physio.findById(id);

        if (!physio) {
            return res.status(404).render('pages/error', {
                title: "Physio Not Found",
                error: `No physio found with ID: ${id}`,
                code: 404
            });
        }

        res.render('pages/physios/physio_edit', {
            title: "Edit Physio",
            physio
        });
    } catch (error) {
        res.status(500).render('pages/error', {
            title: "Internal Server Error",
            error: "An error occurred while fetching the physio for editing.",
            code: 500
        });
    }
};

// Delete physio by ID
const deletePhysio = async (req, res) => {
    const { id } = req.params;

    try {
        const physio = await Physio.findById(id);

        if (!physio) {
            return res.status(404).render('pages/error', {
                title: "Physio Not Found",
                error: `No physio found with ID: ${id}`,
                code: 404
            });
        }

        await Physio.findByIdAndDelete(id);
        await User.findByIdAndDelete(id);

        res.redirect(req.baseUrl);
    } catch (error) {
        res.status(500).render('pages/error', {
            title: "Internal Server Error",
            error: `An error occurred while deleting the physio with ID: ${id}`,
            code: 500
        });
    }
};

export { getPhysios, getPhysio, deletePhysio, editPhysio, updatePhysio, addPhysio, showPhysioAddForm };