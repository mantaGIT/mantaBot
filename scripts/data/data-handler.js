// const _ = require("lodash");
const fs = require("node:fs");
const path = require("node:path");
const {
    parseMatchData,
    parseSalmonData,
} = require("../../scripts/data/api-data-parser.js");

// eslint-disable-next-line no-undef
const mainPath = path.dirname(path.dirname(__dirname));

module.exports = {
    createScheduleJsonFile(apiData, gamemode) {
        let data = undefined;
        console.log(gamemode.mode);
        if (gamemode.mode == "salmon") {
            data = parseSalmonData(apiData, gamemode);
        } else {
            data = parseMatchData(apiData, gamemode);
        }

        const dataFilePath = path.join(
            mainPath,
            `resources/data/schedules/${gamemode.mode}.json`,
        );
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    },
    // 아래부터 리팩토링 다시 해야함
    loadScheduleJson(mode) {
        const scheduleFilePath = path.join(
            mainPath,
            `resources/data/schedules/${mode.id}.json`,
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
    getScheduleByNode(schedules, node) {
        return schedules.find((schedule) => schedule.node === node);
    },
};
