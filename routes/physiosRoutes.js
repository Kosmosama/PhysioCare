import express from "express";
import { upload } from "../middlewares/uploads.js";
import { ROLES } from "../utils/constants.js";
import { allowedRoles } from "../middlewares/auth.js";
import {
    getPhysios,
    getPhysio,
    addPhysio,
    showPhysioAddForm,
    updatePhysio,
    deletePhysio,
    editPhysio
} from "../controllers/physiosController.js";

const router = express.Router();

router.get('/add', allowedRoles(ROLES.ADMIN), showPhysioAddForm); 
router.get("/:id", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT), getPhysio);
router.get('/:id/edit', allowedRoles(ROLES.ADMIN), editPhysio);
router.get("/", allowedRoles(ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT), getPhysios);

router.delete("/:id", allowedRoles(ROLES.ADMIN), deletePhysio);
router.post("/:id", allowedRoles(ROLES.ADMIN), upload.single('image'), updatePhysio);
router.post("/", allowedRoles(ROLES.ADMIN), upload.single('image'), addPhysio);


export default router;