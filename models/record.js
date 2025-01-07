import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    date: { 
        type: Date, 
        required: [true, "The appointment date is required"]
    },
    physio: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'physios', 
        required: [true, "A physio is required"]
    },
    diagnosis: { 
        type: String,
        required: [true, "The diagnosis is required"],
        minlength: [10, "The diagnosis must have at least 10 characters"],
        maxlength: [500, "The diagnosis cannot exceed 500 characters"]
    },
    treatment: { 
        type: String,
        required: [true, "The treatment is required"]
    },
    observations: {
        type: String,
        maxlength: [500, "Observations cannot exceed 500 characters"]
    }
});

const recordSchema = new mongoose.Schema({
    patient: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patients',
        required: [true, "The patient reference is required"],
        unique: true
    },
    medicalRecord: {
        type: String,
        maxlength: [1000, "The medical record cannot exceed 1000 characters"]
    },
    appointments: [appointmentSchema]
});

const Record = mongoose.model("records", recordSchema);
export default Record;
