const mongoose = require('mongoose');
const uuid = require('uuid');
var eventSchema = mongoose.Schema({
    id: {type: String, default: uuid.v4, unique: true},
    name: String,
    description: String,
    photo: String,
    times: {
        start: Date,
        end: Date
    },
    discordURL: String,
    discordID: String,
    githubName: String,
    githubURL: String,
    githubID: String,
    links: [String],
    workshops: [{ type: String, ref: 'Event' }],
    attendees: [{ type: String, ref: 'User' }]
});
module.exports = mongoose.model('Event', eventSchema)
