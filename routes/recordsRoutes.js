import express from "express";
// import { ROLES } from "../utils/constants.js";
// import { protectRoute } from "../auth/auth.js";
import {
    getRecords,
    getRecord,
    // findRecordsBySurname,
    addRecord,
    addAppointmentToRecord,
    addAppointment,
    // deleteMedicalRecord,
    createRecord
} from "../controllers/recordsController.js";

const router = express.Router();

router.get("/add", createRecord); // Show record creation form
router.get("/:id/appointments/add", addAppointment); // Show appointment creation form
router.post("/:id/appointments/add", addAppointmentToRecord);

router.get("/:id", getRecord);
router.get("/", getRecords); // Show all records

// router.get("/find", findRecordsBySurname);
// router.delete("/:id", deleteMedicalRecord);

router.post("/", addRecord); // Form add record

export default router;