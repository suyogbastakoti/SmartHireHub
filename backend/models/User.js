const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['jobseeker', 'employer', 'admin'],
        default: 'jobseeker'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Job Seeker specific fields
    skills: [String],
    education: [{
        degree: String,
        institution: String,
        year: Number,
        gpa: String
    }],
    experience: [{
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        description: String,
        current: Boolean
    }],
    certifications: [{
        name: String,
        issuer: String,
        date: Date,
        expiryDate: Date
    }],
    location: {
        city: String,
        country: String
    },
    phone: String,
    // Employer specific fields
    companyName: String,
    companySize: String,
    industry: String,
    website: String,
    // Common fields
    profilePicture: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);
