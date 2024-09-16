const schedule = require('node-schedule');

const { GAMEMODE } = require('../../scripts/data/schema/api-data-mapping.js');
const schedHandler = require('../../scripts/data/schedule-data-handler.js');

module.exports = {
	fetchApiData(url) {
		fetch(url)
			.then(response => response.json())
			.then(apiData => {
				schedHandler.createScheduleJsonFile(apiData.data, GAMEMODE.REGULAR);
				schedHandler.createScheduleJsonFile(apiData.data, GAMEMODE.OPEN);
				schedHandler.createScheduleJsonFile(apiData.data, GAMEMODE.CHALLENGE);
				schedHandler.createScheduleJsonFile(apiData.data, GAMEMODE.X);
				console.log(`Update schedule data files by gamemode from ${url}.`);
			})
			.catch((error) => {
				console.error(error);
			});
	},
	createFetchApiTimer(url) {
		console.log('Register api-fetch timer.');
		// 홀수 시 1분마다 API 데이터 가져옴
		const rule = new schedule.RecurrenceRule();
		rule.hour = Array.from({ length: 24 }).map((x, i) => i).filter((x) => x % 2 === 0);
		rule.minute = 1;
		rule.tz = 'Etc/UTC';
		schedule.scheduleJob(rule, () => {
			this.fetchApiData(url);
		});
	},
};