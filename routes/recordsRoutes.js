import express from "express";
import {
    getRecords,
    getRecord,
    addRecord,
    addAppointmentToRecord,
    addAppointment,
    createRecord
} from "../controllers/recordsController.js";
import { ROLES } from "../utils/constants.js";
import { allowedRoles } from "../middlewares/auth.js";

const router = express.Router();

router.get("/new", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), createRecord);
router.get("/:id/appointments/new", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), addAppointment);
router.get("/:id", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT), getRecord); // #TODO Only self patient
router.get("/", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), getRecords);

router.post("/:id/appointments", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), addAppointmentToRecord);
router.post("/", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO), addRecord);

export default router;