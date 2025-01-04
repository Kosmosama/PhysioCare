import express from "express";
import { ROLES } from "../utils/constants.js";
import { allowedRoles } from "../middlewares/auth.js";
import {
    getRecords,
    getRecord,
    addRecord,
    addAppointmentToRecord,
    addAppointment,
    createRecord
} from "../controllers/recordsController.js";

const router = express.Router();

router.get("/new", createRecord);
router.get("/:id/appointments/new", addAppointment);
router.get("/:id", getRecord);
router.get("/", getRecords);

router.post("/:id/appointments", addAppointmentToRecord);
router.post("/", addRecord);

export default router;