const _ = require('lodash');
const fs = require('node:fs');
const path = require('node:path');
// eslint-disable-next-line no-undef
const mainPath = path.dirname(path.dirname(__dirname));

function Schedule(nodeNum, mode, st, et, rule, stages) {
	this.node = nodeNum;
	this.mode = mode;
	this.startTime = st;
	this.endTime = et;
	this.rule = rule;
	this.stages = stages;
};

module.exports = {
	createScheduleJsonFile(apiData, gamemode) {
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
			.map((x, i) => x = new Schedule(i, gamemode.id, startTimes[i], endTimes[i], rules[i], stagesArr[i]));

		const dataFilePath = path.join(mainPath, `resources/data/schedules/${gamemode.id}.json`);
		fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
	},
	loadScheduleJson(modeId) {
		const scheduleFilePath = path.join(mainPath, `resources/data/schedules/${modeId}.json`);

		try {
			const schedulesFile = fs.readFileSync(scheduleFilePath);
			const schedules = JSON.parse(schedulesFile);
			return schedules;
		}
		catch (error) {
			console.error(error);
			return undefined;
		}
	},
	getScheduleNow(schedules) {
		const timeNow = Date.now();
		const scheduleNow = schedules.find((schedule) => timeNow >= new Date(schedule.startTime) && timeNow < new Date(schedule.endTime));
		return scheduleNow;
	},
};