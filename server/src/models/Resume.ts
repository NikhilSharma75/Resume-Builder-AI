import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
    user: mongoose.Schema.Types.ObjectId;
    title: string;
    data: any; // Flexible structure for resume content
    selectedTemplate: string;
    isDraft: boolean;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        data: { type: Schema.Types.Mixed, default: {} },
        selectedTemplate: { type: String, default: 'modern' },
        isDraft: { type: Boolean, default: true },
        slug: { type: String, unique: true }, // For public sharing or friendly URLs
    },
    { timestamps: true }
);

// Generate slug before saving
ResumeSchema.pre('save', function (this: IResume) {
    if (!this.slug && this.title) {
        this.slug =
            this.title.toLowerCase().replace(/ /g, '-') +
            '-' +
            Math.random().toString(36).substr(2, 6);
    }
});

export default mongoose.model<IResume>('Resume', ResumeSchema);
