import express from "express";
import { 
    getPatients, 
    getPatient, 
    findPatientByNameOrSurname, 
    addPatient,
    updatePatient,
    deletePatient
} from "../controllers/patientsController.js";

const router = express.Router();

router.get("/find", findPatientByNameOrSurname);

router.get("/:id", getPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

router.get("/", getPatients);
router.post("/", addPatient);

export default router;