import express from "express";
import { upload } from "../middlewares/uploads.js";
import { ROLES } from "../utils/constants.js";
import { allowedRoles } from "../middlewares/auth.js";
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

router.get('/new', allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), showAddPatient);
router.get('/:id/edit/', allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), editPatient);
router.get("/:id", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT), getPatient);
router.get("/", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), getPatients);

router.delete("/:id", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), deletePatient);
router.post("/:id", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), upload.single('image'), updatePatient);
router.post("/", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), upload.single('image'), addPatient);

export default router;