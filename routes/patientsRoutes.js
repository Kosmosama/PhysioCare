import express from "express";
import { Roles } from "../utils/constants.js";
import { 
    getPatients, 
    getPatient, 
    findPatientsByNameOrSurname, 
    addPatient,
    updatePatient,
    deletePatient
} from "../controllers/patientsController.js";

const router = express.Router();

router.get("/find", protectRoute(Roles.ADMIN, Roles.PHYSIO), findPatientsByNameOrSurname);

router.get("/:id", protectRoute(Roles.ADMIN, Roles.PHYSIO, Roles.PATIENT), getPatient);
router.put("/:id", protectRoute(Roles.ADMIN, Roles.PHYSIO), updatePatient);
router.delete("/:id", protectRoute(Roles.ADMIN, Roles.PHYSIO), deletePatient);

router.get("/", protectRoute(Roles.ADMIN, Roles.PHYSIO), getPatients);
router.post("/", protectRoute(Roles.ADMIN, Roles.PHYSIO), addPatient);

export default router;