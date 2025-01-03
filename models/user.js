import mongoose from "mongoose";
import { ROLES } from "../utils/constants.js";

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: [true, "The login's name is required"], 
        minlength: [4, "The login must have at least 4 characters"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "The password is required"], 
        minlength: [7, "The password must have at least 7 characters"],
        trim: true
    },
    rol: {
        type: String, 
        required: true, 
        enum: [ROLES.ADMIN, ROLES.PHYSIO, ROLES.PATIENT]
    }
});

const User = mongoose.model('users', userSchema);
export default User;