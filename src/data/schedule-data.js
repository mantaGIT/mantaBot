const process = require('node:process');
require('dotenv').config();

const _ = require('lodash');
const fs = require('node:fs');
const path = require('node:path');

const { Schedule } = require(process.env.SCHED_DATA_SCHEMA);

module.exports = {
	generateData(apiData, gamemode) {
		const nodes = _.get(apiData, gamemode.tag).nodes;
		const startTimes = _.map(nodes, 'startTime');
		const endTimes = _.map(nodes, 'endTime');
		let setting = _.map(nodes, gamemode.setting);
		if (gamemode.mode !== undefined) {
			setting = _.filter(_.flattenDeep(setting), ['bankaraMode', gamemode.mode]);
		}
		const rules = _.map(setting, 'vsRule');
		const stagesArr = _.map(setting, 'vsStages');
		const data = Array.from({ length: nodes.length })
			.map((x, i) => x = new Schedule(gamemode.id, startTimes[i], endTimes[i], rules[i], stagesArr[i]));

		const dataFilePath = path.join(process.env.RESOURCES, `data/${gamemode.id}.json`);
		fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
		return data;
	},
};