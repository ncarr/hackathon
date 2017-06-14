const TOKEN = require('../../config/discord').TOKEN;
const MONGO_URL = require('../../config/mongodb').URL;
const Discord = require('discord.js');
const client = new Discord.Client();

const mongoose = require('mongoose');
mongoose.connect(MONGO_URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const User = require('../models/user');

client.on('ready', () => {
  console.log("ready")
});
client.on('guildMemberAdd', member => {
    User.findOne({ discord: member.id }, (err, user) => {
        if (err) {
            console.log("Mongoose error: ", err);
        } else if (!user) {
            member.kick("Not accepted to the event")
        }
    });
});

client.login(TOKEN);

module.exports = client;
