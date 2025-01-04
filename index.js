import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nunjucks from "nunjucks";
import { format } from 'date-fns';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import session from "express-session";

import { checkEnvFile } from "./utils/utils.js";
import patientsRoutes from "./routes/patientsRoutes.js";
import physiosRoutes from "./routes/physiosRoutes.js";
import recordsRoutes from "./routes/recordsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

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

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

const env = nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
});

env.addFilter('date', (date, dateFormat) => {
    if (!date) return '';
    return format(new Date(date), dateFormat || 'yyyy-mm-dd');
});

app.set('view engine', 'njk');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));

app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use("/auth", authRoutes);
app.use("/patients", patientsRoutes);
app.use("/physios", physiosRoutes);
app.use("/records", recordsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on \x1b[34mhttp://localhost:${PORT}...\x1b[0m`);
});

// #TODO Error should be a util