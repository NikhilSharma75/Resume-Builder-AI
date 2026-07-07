import mongoose from "mongoose";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ MONGO_URI missing in .env");
    process.exit(1);
}



const fixProUsersCredits = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        const result = await User.updateMany(
            { isSubscribed: true },
            { $set: { credits: 100, plan: "pro" } }
        );

        console.log(`✅ Updated ${result.modifiedCount} users`);

        process.exit();
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
};

fixProUsersCredits();