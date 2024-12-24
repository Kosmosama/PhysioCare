import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { checkEnvFile } from "./utils/utils.js";
// import userRoutes from "./routes/userRoutes.js";
import patientsRoutes from "./routes/patientsRoutes.js";
import physiosRoutes from "./routes/physiosRoutes.js";
import recordsRoutes from "./routes/recordsRoutes.js";

dotenv.config();

checkEnvFile();
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;

const app = express();
app.use(express.json());

mongoose.connect(DB_URL)
    .then(() => console.log(`Connected to MongoDB...`))
    .catch(err => console.error(`Could not connect to MongoDB...`, err));

// app.use("/auth", userRoutes);
app.use("/patients", patientsRoutes);
app.use("/physios", physiosRoutes);
app.use("/records", recordsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on \x1b[34mhttp://localhost:${PORT}...\x1b[0m`);
});
