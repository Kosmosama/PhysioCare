import express from "express";
// import { ROLES } from "../utils/constants.js";
// import { protectRoute } from "../auth/auth.js";
import { 
    getPatients, 
    getPatient, 
    findPatientsByNameOrSurname, 
    addPatient,
    updatePatient,
    deletePatient
} from "../controllers/patientsController.js";

const router = express.Router();

router.get("/find", findPatientsByNameOrSurname);

router.get("/:id", getPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

router.get("/", getPatients);
router.post("/", addPatient);

export default router;