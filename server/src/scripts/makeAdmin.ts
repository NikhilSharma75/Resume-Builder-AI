import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

const makeAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI!);

    await User.updateOne(
        { email: "admin@example.com" },
        { $set: { role: "admin" } }
    );

    console.log("✅ User is now admin");
    process.exit();
};

makeAdmin();