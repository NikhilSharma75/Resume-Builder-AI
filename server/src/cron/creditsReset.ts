import cron from "node-cron";
import User from "../models/User";

export const startCreditResetJob = () => {
  // Runs every day at midnight (00:00)
  cron.schedule("0 0 * * *", async () => {
    console.log("🔄 Running daily credit reset...");

    try {
      // ✅ Pro users → reset to 100 daily
      await User.updateMany(
        { plan: "pro" },
        { $set: { credits: 100 } }
      );

      // ❗ Optional: If you want FREE users to reset daily (currently you said NO)
      // await User.updateMany(
      //   { plan: "free" },
      //   { $set: { credits: 10 } }
      // );

      console.log("✅ Credits reset successfully");
    } catch (error) {
      console.error("❌ Error resetting credits:", error);
    }
  });
};