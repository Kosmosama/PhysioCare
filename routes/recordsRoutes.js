import express from "express";
// import { ROLES } from "../utils/constants.js";
// import { protectRoute } from "../auth/auth.js";
import {
    // getRecords,
    // getRecord,
    // findRecordsBySurname,
    addRecord,
    // addAppointmentToRecord,
    // deleteMedicalRecord,
    createRecord
} from "../controllers/recordsController.js";

const router = express.Router();

router.get("/add", createRecord); // Show record creation form
// router.get("/find", findRecordsBySurname);

// router.post("/:id/appointments", addAppointmentToRecord);

// router.get("/:id", getRecord);
// router.delete("/:id", deleteMedicalRecord);

// router.get("/", getRecords);
router.post("/", addRecord);

export default router;