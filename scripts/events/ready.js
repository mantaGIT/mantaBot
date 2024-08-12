const { Events } = require('discord.js');

const process = require('node:process');
require('dotenv').config();
const log = require(process.env.LOGMSG);


module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		log.printLogMsg(`Ready! Logged in as ${client.user.tag}`);
	},
};