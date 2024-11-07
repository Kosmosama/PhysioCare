import express from "express";

const router = express.Router();

// Body: login, password
//       correct -> 200 + token (campo result [?????])
//       error -> 401 "Incorrect login"
router.post("/login", async (req, res) => {console.log("logged in");});

export default router;