import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        minlength: 2, 
        maxlength: 50, 
        trim: true
    },
    surname: {
        type: String, 
        required: true, 
        minlength: 2, 
        maxlength: 50,
        trim: true
    },
    birthDate: { 
        type: Date, 
        required: true 
    },
    address: { 
        type: String, 
        maxlength: 100,
        trim: true
    },
    insuranceNumber: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^[a-zA-Z0-9]{9}$/,
        trim: true
    }
});

const Patient = mongoose.model('patients', patientSchema);
export default Patient;