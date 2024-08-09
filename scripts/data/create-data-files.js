const process = require('node:process');
require('dotenv').config();

const { loadLocalApiData } = require('./api-data.js');
const { createScheduleData } = require('./schedule-data.js');

const { GAMEMODE } = require(process.env.API_DATA_SCHEMA);


const schedules = loadLocalApiData('schedules.json').data;
// console.log(schedules);
createScheduleData(schedules, GAMEMODE.REGULAR);
createScheduleData(schedules, GAMEMODE.CHALLENGE);
createScheduleData(schedules, GAMEMODE.OPEN);
createScheduleData(schedules, GAMEMODE.X);

console.log('Generate schedule data files by gamemode.');
