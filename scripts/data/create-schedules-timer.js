const process = require('node:process');
require('dotenv').config();

const schedule = require('node-schedule');

const { loadLocalApiData } = require('./api-data.js');
const { createScheduleData } = require('./schedule-data.js');

const { GAMEMODE } = require(process.env.API_DATA_SCHEMA);

function createSchedulesFromApiData(fileName, callCounts) {
	const apiData = loadLocalApiData(fileName).data;

	createScheduleData(apiData, GAMEMODE.REGULAR, callCounts);
	createScheduleData(apiData, GAMEMODE.OPEN, callCounts);
	createScheduleData(apiData, GAMEMODE.CHALLENGE, callCounts);
	createScheduleData(apiData, GAMEMODE.X, callCounts);
}

module.exports = {
	createDataTimer() {
		const dateFormat = {
			dateStyle: 'medium',
			timeStyle: 'medium',
			timeZone: 'Asia/Seoul',
			hour12: false,
		};
		let callCounts = 0;
		schedule.scheduleJob('0 * * * * *', () => {
			createSchedulesFromApiData('apiData.json', callCounts);
			const date = new Intl.DateTimeFormat('ko-KR', dateFormat).format(new Date(Date.now()));
			console.log(`[${date}] ${callCounts++}: Generate schedule data files by gamemode.`);
		});
	},
};