const mongoose = require('mongoose');
const uuid = require('uuid');
var userSchema = mongoose.Schema({
    id: {type: String, default: uuid.v4},
    email: {type: String, unique: true},
    name: String,
    discord: String
});
module.exports = mongoose.model('User', userSchema)
