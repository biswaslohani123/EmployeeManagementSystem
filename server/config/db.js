import mongoose from "mongoose";

const connectDB = async () => {
    try {

        mongoose.connection.on('connected', () => console.log('DATABASE CONNECTED'));

        await mongoose.connect(process.env.MONGO_URI)
        

    } catch (error) {

        console.log("Database connection failed:", error.message);
        
        
    }
}

export default connectDB