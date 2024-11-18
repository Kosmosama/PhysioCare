import express from "express";
import { Roles } from "../utils/constants.js";
import { 
    getPhysios,
    getPhysio,
    findPhysiosBySpecialty,
    addPhysio,
    updatePhysio,
    deletePhysio
} from "../controllers/physiosController.js";

const router = express.Router();

router.get("/find", protectRoute(Roles.ADMIN, Roles.PHYSIO, Roles.PATIENT), findPhysiosBySpecialty);

router.get("/:id", protectRoute(Roles.ADMIN, Roles.PHYSIO, Roles.PATIENT), getPhysio);
router.put("/:id", protectRoute(Roles.ADMIN), updatePhysio);
router.delete("/:id", protectRoute(Roles.ADMIN), deletePhysio);

router.get("/", protectRoute(Roles.ADMIN, Roles.PHYSIO, Roles.PATIENT), getPhysios);
router.post("/", protectRoute(Roles.ADMIN), addPhysio);

export default router;