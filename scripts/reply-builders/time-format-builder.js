module.exports = {
	getFormatTimes(schedule) {
		const dateFormat = {
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
			timeZone: 'Asia/Seoul',
		};
		const startTime = new Intl.DateTimeFormat('en-US', dateFormat).format(new Date(schedule.startTime));
		const endTime = new Intl.DateTimeFormat('en-US', dateFormat).format(new Date(schedule.endTime));
		return [ startTime, endTime ];
	},
};