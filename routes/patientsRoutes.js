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

router.get('/add', showAddPatient);
router.get('/:id/edit/', editPatient);
router.get("/:id", getPatient);
router.get("/", getPatients);

router.delete("/:id", deletePatient);
router.put("/:id", uploads.upload.single('image'), updatePatient);
router.post("/", uploads.upload.single('image'), addPatient);

export default router;