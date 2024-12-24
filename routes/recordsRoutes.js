import express from "express";
// import { ROLES } from "../utils/constants.js";
// import { protectRoute } from "../auth/auth.js";
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

router.post("/:id/appointments", addAppointmentToRecord); // #TODO

router.get("/:id", getRecord);
router.delete("/:id", deleteMedicalRecord); // #TODO

router.get("/", getRecords);
router.post("/", addRecord);

export default router;