import express from "express";
// import { ROLES } from "../utils/constants.js";
// import { protectRoute } from "../auth/auth.js";
import {
    getRecords,
    getRecord,
    addRecord,
    addAppointmentToRecord,
    addAppointment,
    createRecord
} from "../controllers/recordsController.js";

const router = express.Router();

router.get("/new", createRecord); // Show record creation form
router.get("/:id/appointments/new", addAppointment); // Show appointment creation form
router.post("/:id/appointments", addAppointmentToRecord); // Add appointment to record

router.get("/:id", getRecord); // Show record details
router.get("/", getRecords); // Show all records

router.post("/", addRecord); // Form add record

export default router;