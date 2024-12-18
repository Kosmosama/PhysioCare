import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { checkEnvFile } from "./utils/utils.js";
import userRoutes from "./routes/userRoutes.js";
import patientsRoutes from "./routes/patientsRoutes.js";
import physiosRoutes from "./routes/physiosRoutes.js";
import recordsRoutes from "./routes/recordsRoutes.js";

dotenv.config();

checkEnvFile();

const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URL)
    .then(() => console.log(`Connected to MongoDB...`))
    .catch(err => console.error(`Could not connect to MongoDB...`, err));

app.use("/auth", userRoutes);
app.use("/patients", patientsRoutes);
app.use("/physios", physiosRoutes);
app.use("/records", recordsRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
