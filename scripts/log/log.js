const process = require('node:process');
require('dotenv').config();

const fs = require('node:fs');

module.exports = {
	dateFormat : {
		dateStyle: 'medium',
		timeStyle: 'medium',
		timeZone: 'Asia/Seoul',
		hour12: false,
	},
	printError(error) {
		const date = new Intl.DateTimeFormat('ko-KR', this.dateFormat).format(Date.now());
		console.error(`[${date}]`, error);
		this.writeLog(error);
	},
	printLog(msg) {
		const date = new Intl.DateTimeFormat('ko-KR', this.dateFormat).format(Date.now());
		console.log(`[${date}] ${msg}`);
		this.writeLog(msg);
	},
	// 로그파일 생성 후 경로를 사전에 환경변수 LOG로 지정해야 함
	writeLog(msg) {
		const logFile = fs.readFileSync(process.env.LOG);
		const date = new Intl.DateTimeFormat('ko-KR', this.dateFormat).format(Date.now());
		fs.writeFileSync(process.env.LOG, [logFile.toString(), `[${date}] ${msg}`].join('\n'));
	},
};