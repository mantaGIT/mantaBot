const process = require('node:process');
require('dotenv').config();

const schedule = require('node-schedule');

const { createScheduleData } = require('./schedule-data.js');

const { GAMEMODE } = require(process.env.API_DATA_SCHEMA);
const log = require(process.env.LOGMSG);
const { urlLocal } = require(process.env.CONFIG);
// const { url } = require(process.env.CONFIG);


module.exports = {
	fetchCounts: 0,
	fetchApiData() {
		const url = urlLocal;
		fetch(url)
			.then(response => response.json())
			.then(apiData => {
				createScheduleData(apiData.data, GAMEMODE.REGULAR, this.fetchCounts);
				createScheduleData(apiData.data, GAMEMODE.OPEN, this.fetchCounts);
				createScheduleData(apiData.data, GAMEMODE.CHALLENGE, this.fetchCounts);
				createScheduleData(apiData.data, GAMEMODE.X, this.fetchCounts);
				log.printLogMsg('Update schedule data files by gamemode.');
				this.fetchCounts++;
			});
	},
	createFetchApiTimer() {
		log.printLogMsg('Register fetch-api-data timer.');
		schedule.scheduleJob('*/30 * * * * *', () => {
			this.fetchApiData();
		});
	},
};