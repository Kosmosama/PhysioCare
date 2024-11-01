import express from "express";
import {
    getRecords,
    getRecord,
    findRecordsBySurname,
    addRecord,
    addAppointmentToRecord,
    deleteMedicalRecord
} from "../controllers/recordsController.js";

const router = express.Router();

router.get("/find", findRecordsBySurname);

router.post("/:id/appointments", addAppointmentToRecord);

router.get("/:id", getRecord);
router.delete("/:id", deleteMedicalRecord);

router.get("/", getRecords);
router.post("/", addRecord);

export default router;