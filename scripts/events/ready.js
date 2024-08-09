const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		const dateFormat = {
			dateStyle: 'medium',
			timeStyle: 'medium',
			timeZone: 'Asia/Seoul',
			hour12: false,
		};
		const currTime = new Intl.DateTimeFormat('ko-KR', dateFormat).format(new Date(Date.now()));
		console.log(`[${currTime}] Ready! Logged in as ${client.user.tag}`);
	},
};