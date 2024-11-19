import express from "express";
import { ROLES } from "../utils/constants.js";
import { 
    getPatients, 
    getPatient, 
    findPatientsByNameOrSurname, 
    addPatient,
    updatePatient,
    deletePatient
} from "../controllers/patientsController.js";

const router = express.Router();

router.get("/find", protectRoute(ROLES.ADMIN, ROLES.PHYSIO), findPatientsByNameOrSurname);

router.get("/:id", protectRoute(ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT), getPatient);
router.put("/:id", protectRoute(ROLES.ADMIN, ROLES.PHYSIO), updatePatient);
router.delete("/:id", protectRoute(ROLES.ADMIN, ROLES.PHYSIO), deletePatient);

router.get("/", protectRoute(ROLES.ADMIN, ROLES.PHYSIO), getPatients);
router.post("/", protectRoute(ROLES.ADMIN, ROLES.PHYSIO), addPatient);

export default router;