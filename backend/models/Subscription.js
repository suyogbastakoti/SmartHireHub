const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: String,
        enum: ['free', 'standard', 'premium'],
        required: true,
        default: 'free'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentId: String, // eSewa payment ID
    amount: {
        type: Number,
        required: function() {
            return this.plan !== 'free';
        }
    },
    currency: {
        type: String,
        default: 'NPR'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    autoRenew: {
        type: Boolean,
        default: false
    },
    trialUsed: {
        type: Boolean,
        default: false
    },
    features: {
        maxJobPostings: {
            type: Number,
            default: function() {
                switch(this.plan) {
                    case 'free': return 1;
                    case 'standard': return 10;
                    case 'premium': return -1; // unlimited
                    default: return 1;
                }
            }
        },
        maxApplications: {
            type: Number,
            default: function() {
                switch(this.plan) {
                    case 'free': return 10;
                    case 'standard': return 100;
                    case 'premium': return -1; // unlimited
                    default: return 10;
                }
            }
        },
        prioritySupport: {
            type: Boolean,
            default: function() {
                return this.plan === 'premium';
            }
        },
        advancedAnalytics: {
            type: Boolean,
            default: function() {
                return this.plan === 'premium';
            }
        }
    },
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
subscriptionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Index for better query performance
subscriptionSchema.index({ employer: 1, isActive: 1 });
subscriptionSchema.index({ endDate: 1, isActive: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);