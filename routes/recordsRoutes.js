import express from "express";
import { ROLES } from "../utils/constants.js";
import {
    getRecords,
    getRecord,
    findRecordsBySurname,
    addRecord,
    addAppointmentToRecord,
    deleteMedicalRecord
} from "../controllers/recordsController.js";

const router = express.Router();

router.get("/find", protectRoute(ROLES.ADMIN, ROLES.PHYSIO), findRecordsBySurname);

router.post("/:id/appointments", protectRoute(ROLES.ADMIN, ROLES.PHYSIO), addAppointmentToRecord);

router.get("/:id", protectRoute(ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT), getRecord);
router.delete("/:id", protectRoute(ROLES.ADMIN, ROLES.PHYSIO), deleteMedicalRecord);

router.get("/", protectRoute(ROLES.ADMIN, ROLES.PHYSIO), getRecords);
router.post("/", protectRoute(ROLES.ADMIN, ROLES.PHYSIO), addRecord);

export default router;