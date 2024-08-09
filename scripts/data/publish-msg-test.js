const process = require('node:process');
require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const schedule = require('node-schedule');

module.exports = {
	publishMSG_terminal() {
		const dateFormat = {
			dateStyle: 'long',
			timeStyle: 'medium',
			timeZone: 'Asia/Seoul',
		};

		// 매 0초에 아래 함수가 실행된다. ex) 8:30:00, 8:31:00, ...
		schedule.scheduleJob('0 * * * * *', () => {
			const date = new Intl.DateTimeFormat('ko-KR', dateFormat).format(new Date(Date.now()));
			console.log(`[${date}] execute publishMSG_termial()`);
		});
	},
	publishMSG_file() {
		const dateFormat = {
			dateStyle: 'long',
			timeStyle: 'medium',
			timeZone: 'Asia/Seoul',
		};

		// 매 0초에 아래 함수가 실행된다. ex) 8:30:00, 8:31:00, ...
		schedule.scheduleJob('0 * * * * *', () => {
			const date = new Intl.DateTimeFormat('ko-KR', dateFormat).format(new Date(Date.now()));
			const msg = `[${date}] execute publishMSG_file()`;
			console.log(msg);

			const filePath = path.join(process.env.SCRIPTS, 'data/test.txt');
			const fileData = fs.readFileSync(filePath);
			const result = [fileData.toString(), msg].join('\n');
			fs.writeFileSync(filePath, result);
		});
	},
};