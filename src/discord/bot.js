const TOKEN = require('../../config/discord').TOKEN;
const Discord = require('discord.js');
const client = new Discord.Client();

const User = require('../models/user');

client.on('ready', () => console.log("ready"));
client.on('guildMemberAdd', member => {
    User.findOne({ discord: member.id }).exec()
        .catch(err => console.log("Mongoose error: ", err))
        .then(user => {
            if (!user) {
                member.kick("Not accepted to the event");
            }
        });
});

client.login(TOKEN);

module.exports = client;
