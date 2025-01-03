import express from "express";
// import { ROLES } from "../utils/constants.js";
// import { protectRoute } from "../auth/auth.js";
import { 
    getPatients, 
    getPatient, 
    addPatient,
    updatePatient,
    deletePatient,
    editPatient,
    showAddPatient
} from "../controllers/patientsController.js";

const router = express.Router();


router.get('/add', showAddPatient); // Show patient add form
router.get('/:id/edit/', editPatient); // Show patient edit form
router.get("/:id", getPatient); // Show patient details
router.get("/", getPatients); // Show all patients

router.delete("/:id", deletePatient); // Recieves form POST delete «to delete»
router.put("/:id", uploads.upload.single('image'), updatePatient); // Recieves form POST «to edit»
router.post("/", uploads.upload.single('image'), addPatient); // Recieves form POST «to add»

export default router;