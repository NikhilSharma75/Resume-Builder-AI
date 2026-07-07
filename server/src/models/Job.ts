import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
    user: mongoose.Schema.Types.ObjectId;
    companyName: string;
    position: string;
    resume: mongoose.Schema.Types.ObjectId;
    status: 'to-apply' | 'applied' | 'interviewing' | 'offered' | 'rejected';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const JobSchema: Schema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        companyName: { type: String, required: true },
        position: { type: String, required: true },
        resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
        status: { 
            type: String, 
            enum: ['to-apply', 'applied', 'interviewing', 'offered', 'rejected'],
            default: 'to-apply'
        },
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IJob>('Job', JobSchema);
