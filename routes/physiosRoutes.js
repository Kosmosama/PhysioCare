import express from "express";
import upload from "../middlewares/uploads.js";
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

router.get('/add', showPhysioAddForm); 
router.get("/:id", getPhysio);
router.get('/:id/edit', editPhysio);
router.get("/", getPhysios);

router.delete("/:id",  deletePhysio);
router.put("/:id", upload.single('image'), updatePhysio);
router.post("/", upload.single('image'), addPhysio);


export default router;

// #ASK Only admins can access here?
// #ASK Can physios see themselves?