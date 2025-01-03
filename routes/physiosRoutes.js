import express from "express";
import uploads from "../utils/uploads.js";
// import { ROLES } from "../utils/constants.js";
// import { protectRoute } from "../auth/auth.js";
import { 
    getPhysios,
    getPhysio,
    // findPhysiosBySpecialty,
    addPhysio,
    showPhysioAddForm,
    updatePhysio,
    deletePhysio,
    editPhysio
} from "../controllers/physiosController.js";

const router = express.Router();

// router.get("/find", findPhysiosBySpecialty);

router.get('/add', showPhysioAddForm); // Show physio add form
router.get("/:id", getPhysio); // Show physio details
router.get('/edit/:id', editPhysio); // Show physio edit form
router.post("/:id", uploads.upload.single('image'), updatePhysio); // Recieves form POST «to edit»
router.delete("/:id",  deletePhysio); // Recieves form POST delete «to delete»
router.post("/", uploads.upload.single('image'), addPhysio); // Recieves form POST «to add»

router.get("/", getPhysios); // Show all physios

export default router;