import { Request, Response } from "express";
import Feedback from "../models/Feedback";

// Create Feedback
export const createFeedback = async (req: Request, res: Response) => {
    try {
        const { userId, comment, rating } = req.body;

        const feedback = new Feedback({
            user: userId,
            comment,
            rating,
        });

        await feedback.save();

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: feedback,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to submit feedback",
        });
    }
};

// Get All Feedback
export const getAllFeedback = async (req: Request, res: Response) => {
    try {
        const feedback = await Feedback.find().populate("user", "name email");

        res.status(200).json({
            success: true,
            data: feedback,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch feedback",
        });
    }
};

// Delete Feedback (Admin)
// export const deleteFeedback = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;

//         await Feedback.findByIdAndDelete(id);

//         res.status(200).json({
//             success: true,
//             message: "Feedback deleted successfully",
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Failed to delete feedback",
//         });
//     }
// };


export const deleteFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // @ts-ignore
        const userId = req.user?._id;

        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found",
            });
        }

        // ✅ Only allow owner to delete
        if (feedback.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own feedback",
            });
        }

        await Feedback.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete feedback",
        });
    }
};


export const getMyFeedback = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user._id;

        const feedback = await Feedback.find({ user: userId });

        res.status(200).json({
            success: true,
            data: feedback,
        });
    } catch {
        res.status(500).json({ success: false });
    }
};

export const updateFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { comment, rating } = req.body;

        // @ts-ignore
        const userId = req.user._id;

        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found",
            });
        }

        // ✅ Only owner can edit
        if (feedback.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own feedback",
            });
        }

        feedback.comment = comment ?? feedback.comment;
        feedback.rating = rating ?? feedback.rating;

        await feedback.save();

        res.status(200).json({
            success: true,
            message: "Feedback updated successfully",
            data: feedback,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update feedback",
        });
    }
};
