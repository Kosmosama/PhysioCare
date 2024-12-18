import express from "express";
import { ROLES } from "../utils/constants.js";
import { protectRoute } from "../auth/auth.js";
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

router.post("/:id/appointments", protectRoute(ROLES.ADMIN, ROLES.PHYSIO), addAppointmentToRecord); // #TODO

router.get("/:id", protectRoute(ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT), getRecord);
router.delete("/:id", protectRoute(ROLES.ADMIN, ROLES.PHYSIO), deleteMedicalRecord); // #TODO

router.get("/", protectRoute(ROLES.ADMIN, ROLES.PHYSIO), getRecords);
router.post("/", protectRoute(ROLES.ADMIN, ROLES.PHYSIO), addRecord);

export default router;