const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true,
        maxlength: [100, 'Job title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
        trim: true,
        maxlength: [2000, 'Job description cannot exceed 2000 characters']
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    location: {
        city: {
            type: String,
            required: [true, 'City is required']
        },
        country: {
            type: String,
            required: [true, 'Country is required']
        },
        remote: {
            type: Boolean,
            default: false
        }
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
        required: [true, 'Job type is required']
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'executive'],
        required: [true, 'Experience level is required']
    },
    salary: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'USD'
        },
        negotiable: {
            type: Boolean,
            default: false
        }
    },
    skillsRequired: [{
        type: String,
        trim: true
    }],
    requirements: [String],
    benefits: [String],
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'expired'],
        default: 'pending'
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }],
    applicationCount: {
        type: Number,
        default: 0
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: [true, 'Expiry date is required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: Date,
    rejectedReason: String
});

// Index for better query performance
jobSchema.index({ status: 1, isActive: 1 });
jobSchema.index({ employer: 1 });
jobSchema.index({ 'location.city': 1, 'location.country': 1 });
jobSchema.index({ skillsRequired: 1 });

module.exports = mongoose.model('Job', jobSchema);