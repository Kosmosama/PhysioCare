import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minlength: 4,
        trim: true
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
        enum: ['admin', 'physio', 'patient']
    }
});

const User = mongoose.model('users', userSchema);
export default User;