import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({

    employeeId: {type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true},
    type: {type: String, enum: ["SICK", "CASUAL", "ANNUAL"], required: true},
    startDate: {type: Date, required: true},
    endDate: {type: String, required: true},
    reason: {type: String, required: true},
    status: {type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING"}

}, {timestamps: true});

const leave = mongoose.models.leave || mongoose.model('leave', leaveSchema)

export default leave