const process = require('node:process');
require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	loadLocalApiData(fileName) {
		const dataFolderPath = path.join(process.env.RESOURCES, 'data');
		const dataFilePath = path.join(dataFolderPath, fileName);
		const dataFile = fs.readFileSync(dataFilePath);
		const data = JSON.parse(dataFile);
		return data;
	},
};