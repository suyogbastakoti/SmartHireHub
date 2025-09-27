const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
plan: { type: String, enum: ['free', 'standard', 'premium'] },
startDate: Date,
endDate: Date,
paymentStatus: String
});

module.exports = mongoose.model('Subscription', subscriptionSchema);