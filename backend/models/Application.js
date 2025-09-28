const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    jobSeeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['applied', 'shortlisted', 'interviewed', 'rejected', 'hired'],
        default: 'applied'
    },
    coverLetter: {
        type: String,
        maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
    },
    resume: {
        filename: String,
        path: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    notes: String, // For employer to add notes about the candidate
    interviewDate: Date,
    interviewNotes: String,
    rejectionReason: String
});

// Ensure one application per job per job seeker
applicationSchema.index({ job: 1, jobSeeker: 1 }, { unique: true });

// Index for better query performance
applicationSchema.index({ jobSeeker: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ appliedAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
