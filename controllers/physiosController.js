import Physio from "../models/physio.js";

// Returns the list of all physios registered in the clinic
const getPhysios = async (req, res) => {
    try {
        const physios = await Physio.find();

        if (physios.length === 0) return res.status(404).json({ message: "No physios found in system." });

        res.status(200).json(physios);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching physios." });
    }
};

// Retrieve details from a specific physio
const getPhysio = async (req, res) => {
    const { id } = req.params;

    try {
        const physio = await Physio.findById(id);

        if (!physio) return res.status(404).json({ message: "Physio not found." });

        res.status(200).json(physio);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching physio: " + id });
    }
}

// Retrieve physios by specialty
const findPhysiosBySpecialty = async (req, res) => {
    const { specialty } = req.query;

    try {
        const query = {};

        if (specialty) query.specialty = specialty;

        const physios = await Physio.find(query);

        if (physios.length === 0) return res.status(404).json({ message: "No patients found with that specialty." });

        res.status(200).json(physios);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching patients." });
    }
}

// Insert a new physio
const addPhysio = async (req, res) => {
    const { name, surname, specialty, licenseNumber } = req.body;

    const newPhysio = new Physio({
        name,
        surname,
        specialty,
        licenseNumber
    });

    try {
        const savedPhysio = await newPhysio.save();
        res.status(201).json(savedPhysio);
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ error: "Validation failed: " + error.message });
        
        // 11000 -> Trying to duplicate value on unique field
        if (error.code === 11000) return res.status(400).json({ error: "License number must be unique." });
        
        res.status(400).json({ error: "An error occurred while adding the physio: " + error.message });
    }
};

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

        if (!updatedPhysio) return res.status(404).json({ error: "Physio not found." });

        res.status(200).json(updatedPhysio);
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ error: "Validation failed: " + error.message });

        if (error.code === 11000) return res.status(400).json({ error: "License number must be unique." });

        res.status(500).json({ error: "An error occurred while updating the physio." });
    }
};

// Delete physio by ID
const deletePhysio = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPhysio = await Physio.findByIdAndDelete(id);

        if (!deletedPhysio) return res.status(404).json({ error: "Physio not found." });

        res.status(200).json(deletedPhysio);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the physio." });
    }
};

export { getPhysios, getPhysio, findPhysiosBySpecialty, addPhysio, updatePhysio, deletePhysio };