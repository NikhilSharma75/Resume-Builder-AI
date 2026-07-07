// import { Request, Response, NextFunction } from "express";
// import User from "../models/User";
// import { handleDailyCredits } from "../utils/creditsManager";

// export const checkCredits = (cost: number) => {
//   return async (req: any, res: Response, next: NextFunction) => {
//     try {
//       const userId = req.user?._id;

//       if (!userId) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }

//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       // 🔥 STEP 1: Lazy reset
//       await handleDailyCredits(user);

//       // 🔥 STEP 2: Check credits
//       if (user.credits < cost) {
//         return res.status(403).json({
//           message:
//             user.plan === "free"
//               ? "Not enough credits. Upgrade to Pro."
//               : "Daily credits exhausted. Try again tomorrow.",
//         });
//       }

//       // 🔥 STEP 3: Deduct credits
//       user.credits -= cost;
//       await user.save();

//       // attach updated user
//       req.userData = user;

//       next();
//     } catch (error) {
//       console.error("Credit middleware error:", error);
//       res.status(500).json({ message: "Credit check failed" });
//     }
//   };
// };


import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { handleDailyCredits } from "../utils/creditsManager";

export const checkCredits = (cost: number) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // 🔥 STEP 1: Lazy reset
      await handleDailyCredits(user);

      // 🔥 STEP 2: Check credits ONLY (don't deduct here)
      if (user.credits < cost) {
        return res.status(403).json({
          message:
            user.plan === "free"
              ? "Not enough credits. Upgrade to Pro."
              : "Daily credits exhausted. Try again tomorrow.",
        });
      }

      // ✅ Don't deduct here - let the controller handle deduction
      // This prevents double-deducting!
      req.userData = user;

      next(); // ✅ ADD RETURN?
    } catch (error) {
      console.error("Credit middleware error:", error);
      return res.status(500).json({ message: "Credit check failed" }); // ✅ ADD RETURN
    }
  };
};