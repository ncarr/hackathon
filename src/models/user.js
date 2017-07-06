const mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    name: String,
    events: [{ type: String, ref: 'Event' }],
    shirtSize: String,
    dietaryRestrictions: String,
    specialNeeds: String,
    gender: String,
    school: mongoose.Schema.Types.Mixed,
    accessToken: String,
    newUser: Boolean,
    roles: [String],
    discord: String,
    github: String,
    githubToken: String
});
module.exports = mongoose.model('User', userSchema)
