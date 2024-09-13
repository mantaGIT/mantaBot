const _ = require('lodash');
const fs = require('node:fs');
const path = require('node:path');
const { Buffer } = require('node:buffer');

// eslint-disable-next-line no-undef
const mainPath = path.dirname(path.dirname(__dirname));

const { Schedule } = require(path.join(mainPath, 'scripts/data/schema/schedule-schema.js'));

function createStageImages(stageObj) {
	const imgURL = stageObj.image.url;
	const imgPath = path.join(mainPath, `resources/images/stages/${stageObj.id}.png`);

	fs.stat(imgPath, (error, stats) => {
		if (error) {
		  console.error(error);
		}
		else if (stats.size === 0) {
			console.log(`${stageObj.id} stage image is not exist. create a image`);
			fetch(imgURL)
				.then(response => response.arrayBuffer())
				.then(buffer => {
					fs.writeFileSync(imgPath, Buffer.from(buffer));
				})
				.catch((err) => {
					console.error(err);
				});
		}
		else {
			console.log(`${stageObj.id} stage image is exist.`);
		}
	  });
};

module.exports = {
	createScheduleData(apiData, gamemode, slice = 0) {
		const nodes = _.get(apiData, gamemode.tag).nodes;
		const startTimes = _.map(nodes, 'startTime');
		const endTimes = _.map(nodes, 'endTime');
		let setting = _.map(nodes, gamemode.setting);
		if (gamemode.mode !== undefined) {
			setting = _.filter(_.flattenDeep(setting), ['bankaraMode', gamemode.mode]);
		}
		const rules = _.map(setting, 'vsRule');
		const stagesArr = _.map(setting, 'vsStages');

		_.flattenDeep(stagesArr).forEach((stageObj) => {
			createStageImages(stageObj);
		});

		const data = Array.from({ length: nodes.length })
			.map((x, i) => x = new Schedule(gamemode.id, startTimes[i], endTimes[i], rules[i], stagesArr[i]))
			.slice(slice);

		const dataFilePath = path.join(mainPath, `resources/data/schedules/${gamemode.id}.json`);
		fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
		return data;
	},
};