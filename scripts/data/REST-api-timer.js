const process = require('node:process');
require('dotenv').config();

const schedule = require('node-schedule');

const { createScheduleData } = require('./schedule-data.js');

const { GAMEMODE } = require(process.env.API_DATA_SCHEMA);
const log = require(process.env.LOGMSG);


module.exports = {
	fetchApiData(url) {
		fetch(url)
			.then(response => response.json())
			.then(apiData => {
				createScheduleData(apiData.data, GAMEMODE.REGULAR);
				createScheduleData(apiData.data, GAMEMODE.OPEN);
				createScheduleData(apiData.data, GAMEMODE.CHALLENGE);
				createScheduleData(apiData.data, GAMEMODE.X);
				log.printLog('Update schedule data files by gamemode.');
			})
			.catch((error) => {
				log.printError(error);
			});
	},
	createFetchApiTimer(url) {
		log.printLog('Register fetch-api-data timer.');
		// 홀수 시 3분마다 API 데이터 가져옴
		schedule.scheduleJob('3 1-23/2 * * *', () => {
			this.fetchApiData(url);
		});
	},
};