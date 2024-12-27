import express from "express";
// import { ROLES } from "../utils/constants.js";
// import { protectRoute } from "../auth/auth.js";
import { 
    getPatients, 
    getPatient, 
    // findPatientsByNameOrSurname, 
    // addPatient,
    updatePatient,
    deletePatient,
    editPatient
} from "../controllers/patientsController.js";

const router = express.Router();

router.get('/edit/:id', editPatient); // Show patient edit form
router.get("/:id", getPatient); // Show patient details
router.get("/", getPatients); // Show all patients

router.delete("/:id", deletePatient); // Recieves form POST delete «to delete»
router.post("/:id", updatePatient); // Recieves form POST «to edit»

// router.get("/find", findPatientsByNameOrSurname);
// router.post("/", addPatient);

export default router;