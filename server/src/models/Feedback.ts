import mongoose, { Document, Schema } from "mongoose";

export interface IFeedback extends Document {
    user: mongoose.Types.ObjectId;
    comment: string;
    rating?: number;
    createdAt: Date;
    updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);