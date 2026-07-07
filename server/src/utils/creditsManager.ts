import User from "../models/User";

export const handleDailyCredits = async (user: any) => {
  const now = new Date();
  const lastReset = new Date(user.lastCreditReset);

  const isNewDay =
    now.getDate() !== lastReset.getDate() ||
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear();

  if (isNewDay) {
    if (user.plan === "pro") {
      user.credits = 100;
    }

    // ❗ Free users → DO NOT reset (as per your logic)
    // If later needed:
    // if (user.plan === "free") user.credits = 10;

    user.lastCreditReset = now;
    await user.save();
  }

  return user;
};