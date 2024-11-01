import express from "express";
import { 
    getPhysios,
    getPhysio,
    findPhysiosBySpecialty,
    addPhysio,
    updatePhysio,
    deletePhysio
} from "../controllers/physiosController.js";

const router = express.Router();

router.get("/find", findPhysiosBySpecialty);

router.get("/:id", getPhysio);
router.put("/:id", updatePhysio);
router.delete("/:id", deletePhysio);

router.get("/", getPhysios);
router.post("/", addPhysio);

export default router;