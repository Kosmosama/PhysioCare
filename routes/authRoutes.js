import express from "express";
import {
    showLogin,
    login
} from "../controllers/authController.js";

const router = express.Router();

router.get("/login", showLogin);
router.post("/login", login);

export default router;