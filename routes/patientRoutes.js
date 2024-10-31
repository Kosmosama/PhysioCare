import express from "express";
import { getPatients, getPatient } from "../controllers/patientsController.js";

const router = express.Router();

// router.get("/patients/find", getPatientByName);
router.get("/:patientId", getPatient);
router.get("/", getPatients);

export default router;