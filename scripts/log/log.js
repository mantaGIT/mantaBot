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
	},
	printLog(msg) {
		const date = new Intl.DateTimeFormat('ko-KR', this.dateFormat).format(Date.now());
		console.log(`[${date}] ${msg}`);
	},
};