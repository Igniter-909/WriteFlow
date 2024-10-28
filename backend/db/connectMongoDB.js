import mongoose, { connect } from "mongoose";

const connectMongoDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected",conn.connection.host)
    } catch (error) {
        console.error("Error connecting to database ",error.message);
        process.exit(1);
    }
}

export default connectMongoDB;