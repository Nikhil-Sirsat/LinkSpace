import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("Connected to Database");
    }).catch((err) => {
        console.log(`Database connection error: ${err}`);
    });
};

export default connectDB;
