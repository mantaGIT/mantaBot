const process = require('node:process');
require('dotenv').config();

const schedule = require('node-schedule');

const { loadLocalApiData } = require('./api-data.js');
const { createScheduleData } = require('./schedule-data.js');

const { GAMEMODE } = require(process.env.API_DATA_SCHEMA);
const log = require(process.env.LOGMSG);


module.exports = {
	callCounts: 0,
	readFromLocalApiData() {
		const apiData = loadLocalApiData('apiData.json').data;

		createScheduleData(apiData, GAMEMODE.REGULAR, this.callCounts);
		createScheduleData(apiData, GAMEMODE.OPEN, this.callCounts);
		createScheduleData(apiData, GAMEMODE.CHALLENGE, this.callCounts);
		createScheduleData(apiData, GAMEMODE.X, this.callCounts);

		log.printLogMsg(`Generate schedule data files by gamemode. : ${this.callCounts++}`);
	},
	createReadFileTimer() {
		log.printLogMsg('Register schedules-data-generation timer.');
		schedule.scheduleJob('0 * * * * *', () => {
			this.readFromLocalApiData();
		});
	},
};