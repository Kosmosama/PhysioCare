import express from "express";
import { Roles } from "../utils/constants.js";
import {
    getRecords,
    getRecord,
    findRecordsBySurname,
    addRecord,
    addAppointmentToRecord,
    deleteMedicalRecord
} from "../controllers/recordsController.js";

const router = express.Router();

router.get("/find", protectRoute(Roles.ADMIN, Roles.PHYSIO), findRecordsBySurname);

router.post("/:id/appointments", protectRoute(Roles.ADMIN, Roles.PHYSIO), addAppointmentToRecord);

router.get("/:id", protectRoute(Roles.ADMIN, Roles.PHYSIO, Roles.PATIENT), getRecord);
router.delete("/:id", protectRoute(Roles.ADMIN, Roles.PHYSIO), deleteMedicalRecord);

router.get("/", protectRoute(Roles.ADMIN, Roles.PHYSIO), getRecords);
router.post("/", protectRoute(Roles.ADMIN, Roles.PHYSIO), addRecord);

export default router;