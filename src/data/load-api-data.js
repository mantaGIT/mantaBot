const fs = require('node:fs');
const path = require('node:path');
const { paths } = require('../../config/paths.json');

module.exports = {
	API_DATA: Object.freeze({
		LANG: 'ko-KR.json',
		SCHED: 'schedules.json',
	}),
	loadData(fileName) {
		const dataFolderPath = path.join(paths.resources, 'data');
		const dataFilePath = path.join(dataFolderPath, fileName);
		const dataFile = fs.readFileSync(dataFilePath);
		const data = JSON.parse(dataFile);
		return data;
	},
};