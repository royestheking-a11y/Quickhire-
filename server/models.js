import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    type: { type: String, required: true },
    logo: { type: String, required: true },
    featured: { type: Boolean, default: false },
    latest: { type: Boolean, default: false }
}, { timestamps: true });

const ApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    jobTitle: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    resume: { type: String, required: true },
    coverNote: String,
    date: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isBanned: { type: Boolean, default: false },
    dateJoined: { type: Date, default: Date.now },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    profile: {
        bio: { type: String, default: '' },
        education: { type: String, default: '' },
        experience: { type: String, default: '' },
        cvUrl: { type: String, default: '' }
    }
});

export const Job = mongoose.model('Job', JobSchema);
export const Application = mongoose.model('Application', ApplicationSchema);
export const User = mongoose.model('User', UserSchema);
