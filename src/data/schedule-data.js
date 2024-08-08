const _ = require('lodash');
const fs = require('node:fs');
const path = require('node:path');
const { paths } = require('../../config/paths.json');


function Schedule(mode, st, et, rule, stages) {
	this.mode = mode;
	this.startTime = st;
	this.endTime = et;
	this.rule = rule;
	this.stages = stages;
};

module.exports = {
	MODE: Object.freeze({
		REGULAR: { id: 'regular', tag: 'regularSchedules', setting: 'regularMatchSetting', mode: undefined },
		CHALLENGE: { id: 'challenge', tag: 'bankaraSchedules', setting: 'bankaraMatchSettings', mode: 'CHALLENGE' },
		OPEN: { id: 'open', tag: 'bankaraSchedules', setting: 'bankaraMatchSettings', mode: 'OPEN' },
		X: { id: 'x', tag: 'xSchedules', setting: 'xMatchSetting', mode: undefined },
	}),

	generateData(apiData, mode) {
		const nodes = _.get(apiData, mode.tag).nodes;
		const startTimes = _.map(nodes, 'startTime');
		const endTimes = _.map(nodes, 'endTime');
		let setting = _.map(nodes, mode.setting);
		if (mode.mode !== undefined) {
			setting = _.filter(_.flattenDeep(setting), ['bankaraMode', mode.mode]);
		}
		const rules = _.map(setting, 'vsRule');
		const stagesArr = _.map(setting, 'vsStages');
		const data = Array.from({ length: nodes.length })
			.map((x, i) => x = new Schedule(mode.id, startTimes[i], endTimes[i], rules[i], stagesArr[i]));

		const dataFilePath = path.join(paths.resources, `data/${mode.id}.json`);
		fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 4));
		return data;
	},
};