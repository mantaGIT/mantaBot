const schedule = require('node-schedule');
const path = require('node:path');
// eslint-disable-next-line no-undef
const mainPath = path.dirname(path.dirname(__dirname));

const { createScheduleData } = require(path.join(mainPath, 'scripts/data/create-schedule-data.js'));
const { GAMEMODE } = require(path.join(mainPath, 'scripts/data/schema/api-data-mapping.js'));


module.exports = {
	fetchApiData(url) {
		fetch(url)
			.then(response => response.json())
			.then(apiData => {
				createScheduleData(apiData.data, GAMEMODE.REGULAR);
				createScheduleData(apiData.data, GAMEMODE.OPEN);
				createScheduleData(apiData.data, GAMEMODE.CHALLENGE);
				createScheduleData(apiData.data, GAMEMODE.X);
				console.log(`Update schedule data files by gamemode from ${url}.`);
			})
			.catch((error) => {
				console.error(error);
			});
	},
	createFetchApiTimer(url) {
		console.log('Register fetch-api-data timer.');
		// 홀수 시 3분마다 API 데이터 가져옴
		schedule.scheduleJob('3 1-23/2 * * *', () => {
			this.fetchApiData(url);
		});
	},
};