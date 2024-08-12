const process = require('node:process');
require('dotenv').config();

const schedule = require('node-schedule');

const { loadLocalApiData } = require('./api-data.js');
const { createScheduleData } = require('./schedule-data.js');

const { GAMEMODE } = require(process.env.API_DATA_SCHEMA);
const log = require(process.env.LOGMSG);

function createSchedulesFromApiData(fileName, callCounts) {
	const apiData = loadLocalApiData(fileName).data;

	createScheduleData(apiData, GAMEMODE.REGULAR, callCounts);
	createScheduleData(apiData, GAMEMODE.OPEN, callCounts);
	createScheduleData(apiData, GAMEMODE.CHALLENGE, callCounts);
	createScheduleData(apiData, GAMEMODE.X, callCounts);
}

module.exports = {
	callCounts: 0,
	createDataTimer(callCounts) {
		log.printLogMsg('Register schedules-data-generation timer.');
		schedule.scheduleJob('0 * * * * *', () => {
			createSchedulesFromApiData('apiData.json', callCounts);
			const msg = `Generate schedule data files by gamemode. : ${callCounts++}`;
			log.printLogMsg(msg);
		});
	},
};