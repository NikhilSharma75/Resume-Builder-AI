import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'user' | 'admin';
    oauthProvider?: 'google' | 'local';
    oauthId?: string;
    isSubscribed: boolean;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    aiUsageCount: number;
        plan: 'free' | 'pro';
    credits: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        oauthProvider: { type: String, enum: ['google', 'local'], default: 'local' },
        oauthId: { type: String },
        isSubscribed: { type: Boolean, default: false },
        stripeCustomerId: { type: String },
        stripeSubscriptionId: { type: String },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        aiUsageCount: { type: Number, default: 0 },
      plan: { type: String, enum: ['free', 'pro'], default: 'free' },
      credits: { type: Number, default: 10 },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
