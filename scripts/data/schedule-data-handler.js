// const _ = require("lodash");
const fs = require("node:fs");
const path = require("node:path");
const { parseMatchData, parseSalmonData } = require("./api-data-parser.js");

// eslint-disable-next-line no-undef
const mainPath = path.dirname(path.dirname(__dirname));

module.exports = {
    createSchedulesFile(apiData, gamemode) {
        let data = undefined;
        if (gamemode.mode === "salmon") {
            data = parseSalmonData(apiData, gamemode.mode);
        } else {
            data = parseMatchData(apiData, gamemode.mode);
        }

        const dataFilePath = path.join(
            mainPath,
            `resources/data/schedules/${gamemode.mode}.json`,
        );
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    },
    loadSchedulesFile(gamemode) {
        const scheduleFilePath = path.join(
            mainPath,
            `resources/data/schedules/${gamemode.mode}.json`,
        );

        try {
            const schedulesFile = fs.readFileSync(scheduleFilePath);
            const schedules = JSON.parse(schedulesFile);
            return schedules;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    },
    getScheduleNow(schedules) {
        const timeNow = Date.now();
        const scheduleNow = schedules.find(
            (schedule) =>
                timeNow >= new Date(schedule.startTime) &&
                timeNow < new Date(schedule.endTime),
        );
        return scheduleNow;
    },
    getScheduleById(schedules, id) {
        return schedules.find((schedule) => schedule.id === id);
    },
};
