import express from "express";
import { ROLES } from "../utils/constants.js";
import { 
    getPhysios,
    getPhysio,
    findPhysiosBySpecialty,
    addPhysio,
    updatePhysio,
    deletePhysio
} from "../controllers/physiosController.js";

const router = express.Router();

router.get("/find", protectRoute(ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT), findPhysiosBySpecialty);

router.get("/:id", protectRoute(ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT), getPhysio);
router.put("/:id", protectRoute(ROLES.ADMIN), updatePhysio);
router.delete("/:id", protectRoute(ROLES.ADMIN), deletePhysio);

router.get("/", protectRoute(ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT), getPhysios);
router.post("/", protectRoute(ROLES.ADMIN), addPhysio);

export default router;