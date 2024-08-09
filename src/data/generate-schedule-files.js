const process = require('node:process');
require('dotenv').config();

const { loadLocalApiData } = require('./load-api-data.js');
const { generateData } = require('./schedule-data.js');

const { GAMEMODE } = require(process.env.API_DATA_SCHEMA);


const schedules = loadLocalApiData('schedules.json').data;
// console.log(schedules);
generateData(schedules, GAMEMODE.REGULAR);
generateData(schedules, GAMEMODE.CHALLENGE);
generateData(schedules, GAMEMODE.OPEN);
generateData(schedules, GAMEMODE.X);

console.log('Generate schedule data files by gamemode.');
