const mongoose = require('mongoose');
const uuid = require('uuid');
var userSchema = mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    name: String,
    shirtSize: String,
    dietaryRestrictions: String,
    specialNeeds: String,
    gender: String,
    school: mongoose.Schema.Types.Mixed,
    accessToken: String,
    roles: [String],
    discord: String
});
module.exports = mongoose.model('User', userSchema)
