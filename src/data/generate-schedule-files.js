const { API_DATA, loadData } = require('./load-api-data.js');
const { MODE, generateData } = require('./schedule-data.js');

const schedules = loadData(API_DATA.SCHED).data;
generateData(schedules, MODE.REGULAR);
generateData(schedules, MODE.CHALLENGE);
generateData(schedules, MODE.OPEN);
generateData(schedules, MODE.X);