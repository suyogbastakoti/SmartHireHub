const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true },
    password: String,
    role: {type: String, enum:['jobseeker', 'employer', 'admin'], default: 'jobseeker'},
    skills: [String],
    profile: Object
});

module.exports = mongoose.model('User', userSchema);
