import express from "express";
// import { logUser } from "../controllers/userController.js";
import { logUser, registerUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", logUser);
router.post("/register", registerUsers);

export default router;