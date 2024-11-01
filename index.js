import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import patientsRoutes from "./routes/patientsRoutes.js";
import physiosRoutes from "./routes/physiosRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URL)
    .then(() => console.log(`Connected to MongoDB...`))
    .catch(err => console.error(`Could not connect to MongoDB...`, err));

app.use("/patients", patientsRoutes);
app.use("/physios", physiosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));