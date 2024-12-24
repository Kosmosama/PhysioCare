import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nunjucks from "nunjucks";
import path from 'path';
import { fileURLToPath } from 'url';

import { checkEnvFile } from "./utils/utils.js";
// import userRoutes from "./routes/userRoutes.js";
import patientsRoutes from "./routes/patientsRoutes.js";
import physiosRoutes from "./routes/physiosRoutes.js";
import recordsRoutes from "./routes/recordsRoutes.js";

dotenv.config();
checkEnvFile();
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;

mongoose.connect(DB_URL)
    .then(() => console.log(`Connected to MongoDB...`))
    .catch(err => console.error(`Could not connect to MongoDB...`, err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'njk');

app.use(express.json());

app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// app.use("/auth", userRoutes);
app.use("/patients", patientsRoutes);
app.use("/physios", physiosRoutes);
app.use("/records", recordsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on \x1b[34mhttp://localhost:${PORT}...\x1b[0m`);
});
