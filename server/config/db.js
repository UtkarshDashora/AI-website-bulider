import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Database connected successfully");
        });

        mongoose.connection.on("error", (err) => {
            console.log("Database connection error: ", err);
        });

        await mongoose.connect(`${process.env.MONGODB_URL}`);
    } catch (error) {
        console.log("Error connecting to database: ", error.message);
        process.exit(1);
    }
}

export default connectDB;