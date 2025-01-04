import express from "express";
import uploads from "../middlewares/uploads.js";
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

router.get('/add', allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), showAddPatient);
router.get('/:id/edit/', allowedRoles(ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT), editPatient); // #TODO Only self patient
router.get("/:id", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT), getPatient); // #TODO Only self patient
router.get("/", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), getPatients);

router.delete("/:id", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), deletePatient);
router.put("/:id", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT), uploads.upload.single('image'), updatePatient); // #TODO Only self patient
router.post("/", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), uploads.upload.single('image'), addPatient);

export default router;

// #ASK Can patients edit themselves?
// #ASK Can patients delete themselves?
// #ASK Can patients add themselves?