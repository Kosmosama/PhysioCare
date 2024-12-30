import express from "express";
// import { ROLES } from "../utils/constants.js";
// import { protectRoute } from "../auth/auth.js";
import { 
    getPhysios,
    getPhysio,
    // findPhysiosBySpecialty,
    // addPhysio,
    updatePhysio,
    deletePhysio,
    editPhysio
} from "../controllers/physiosController.js";

const router = express.Router();

// router.get("/find", findPhysiosBySpecialty);

router.get("/:id", getPhysio); // Show physio details
router.get('/edit/:id', editPhysio); // Show physio edit form
router.post("/:id",  updatePhysio); // Recieves form POST «to edit»
router.delete("/:id",  deletePhysio); // Recieves form POST delete «to delete»

router.get("/", getPhysios); // Show all physios
// router.post("/", addPhysio);

export default router;