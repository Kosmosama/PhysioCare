// External dependencies
import dotenv from "dotenv";
import express from "express";
import methodOverride from 'method-override';
import mongoose from "mongoose";
import nunjucks from "nunjucks";
import path from 'path';
import { fileURLToPath } from 'url';
import { format } from 'date-fns';
import session from "express-session";

// Internal routes
import authRoutes from "./routes/authRoutes.js";
import patientsRoutes from "./routes/patientsRoutes.js";
import physiosRoutes from "./routes/physiosRoutes.js";
import recordsRoutes from "./routes/recordsRoutes.js";

// Internal utilities and middlewares
import { checkEnvFile } from "./utils/utils.js";
import { allowedRoles } from "./middlewares/auth.js";
import { ROLES, SESSION_TIME } from "./utils/constants.js";

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
    saveUninitialized: false,
    expires: new Date(Date.now() + (SESSION_TIME * 60 * 1000))
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



app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use("/auth", authRoutes);
app.use("/patients", patientsRoutes);
app.use("/physios", physiosRoutes);
app.use("/records", recordsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on \x1b[34mhttp://localhost:${PORT}...\x1b[0m`);
});
 
// #ASK All records id should be used as patient id?

// #ASK Can I skip creating a /find as i already do it in the get{Patients/Physios} functions?

// #TODO Permissions (if something cannot be seen, add button to show it; ex: profile in menu for physio)
// https://imgur.com/lLLajlq

// #TODO Error should be a util

// #TODO Install connect-flash to:
// app.use(flash());

// app.use((req, res, next) => {
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// });

// Ex:
// req.flash('success', `Patient with ID ${id} has been successfully deleted.`);
// res.redirect(req.baseUrl);

// Ex:
// <% if (success) { %>
//     <div class="alert alert-success"><%= success %></div>
// <% } %>
// <% if (error) { %>
//     <div class="alert alert-danger"><%= error %></div>
// <% } %>