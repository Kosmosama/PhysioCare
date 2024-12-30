import Physio from "../models/physio.js";

// Returns the list of all physios registered in the clinic
const getPhysios = async (req, res) => {
    const { name } = req.query;

    try {
        let query = {};

        if (name) {
            query.name = new RegExp(name, 'i');
        }

        const physios = await Physio.find(query);

        res.render('pages/physios/physios_list', {
            title: "Physios List",
            physios,
            filter: { name }
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

// Retrieve physios by specialty
// const findPhysiosBySpecialty = async (req, res) => {
//     const { specialty } = req.query;

//     try {
//         const query = {};

//         if (specialty) query.specialty = specialty;

//         const physios = await Physio.find(query);

//         if (physios.length === 0) return res.status(404).json({ error: "No patients found with that specialty." });

//         res.status(200).json({ result: physios });
//     } catch (error) {
//         res.status(500).json({ error: "An error occurred while fetching patients." });
//     }
// }

// Insert a new physio
// const addPhysio = async (req, res) => {
//     const { name, surname, specialty, licenseNumber } = req.body;

//     try {
//         const newPhysio = new Physio({
//             name,
//             surname,
//             specialty,
//             licenseNumber
//         });

//         const savedPhysio = await newPhysio.save();
//         res.status(201).json({ result: savedPhysio });
//     } catch (error) {
//         if (error.name === 'ValidationError') return res.status(400).json({ error: "Validation failed: " + error.message });
        
//         // 11000 -> Trying to duplicate value on unique field
//         if (error.code === 11000) return res.status(400).json({ error: "License number must be unique." });
        
//         res.status(400).json({ error: "An error occurred while adding the physio: " + error.message });
//     }
// };

// Update physio data by ID
const updatePhysio = async (req, res) => {
    const { id } = req.params;
    const { name, surname, specialty, licenseNumber } = req.body;

    try {
        const updatedPhysio = await Physio.findByIdAndUpdate(
            id,
            { name, surname, specialty, licenseNumber },
            { new: true, runValidators: true }
        );

        if (!updatedPhysio) {
            return res.status(404).render('pages/error', {
                title: "Physio Not Found",
                error: `No physio found with ID: ${id}`,
                code: 404
            });
        }

        res.status(200).render('pages/physios/physio_detail', {
            title: `Physio Updated - ${updatedPhysio.name} ${updatedPhysio.surname}`,
            physio: updatedPhysio,
            message: "Physio successfully updated!"
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).render('pages/error', {
                title: "Validation Error",
                error: `Validation failed: ${error.message}`,
                code: 400
            });
        }

        if (error.code === 11000) {
            return res.status(400).render('pages/error', {
                title: "Duplicate Value Error",
                error: "Insurance number must be unique.",
                code: 400
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
        const deletedPhysio = await Physio.findByIdAndDelete(id);

        if (!deletedPhysio) {
            return res.status(404).render('pages/error', {
                title: "Physio Not Found",
                error: `No physio found with ID: ${id}`,
                code: 404
            });
        }

        // #MAYBE to show a confirmation that the physio has been deleted
        // res.status(200).render('pages/success', {
        //     title: "Physio Deleted",
        //     message: `Physio with ID ${id} has been successfully deleted.`
        // });

        res.redirect(req.baseUrl);
    } catch (error) {
        res.status(500).render('pages/error', {
            title: "Internal Server Error",
            error: `An error occurred while deleting the physio with ID: ${id}`,
            code: 500
        });
    }
};

export { getPhysios, getPhysio, deletePhysio, editPhysio, updatePhysio }; // findPhysiosBySpecialty, addPhysio,