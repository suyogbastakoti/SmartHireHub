const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: String,
    description: String,
    skillsRequired: [String],
    employer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status:{type: String, default: 'pending'},
    expiryDate: Date
});

module.exports = mongoose.model('Job', jobSchema);