import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({




}, {timestamps: true})

const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema)

export default Employee