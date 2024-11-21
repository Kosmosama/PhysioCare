import mongoose from "mongoose";
import { ROLES } from "../utils/constants.js";

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minlength: 4,
        trim: true,
        unique: true
    },
    password: {
        type: String, 
        required: true,
        minlength: 7,
        trim: true
    },
    role: {
        type: String, 
        required: true, 
        enum: [ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT]
    }
});

const User = mongoose.model('users', userSchema);
export default User;