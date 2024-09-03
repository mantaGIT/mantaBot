const schedule = require("node-schedule");

const { GAMEMODE } = require("../../configs/gamemode.json");
const schedHandler = require("./schedule-data-handler.js");

module.exports = {
    /**
     * API 호출 및 API 데이터를 처리한다.
     */
    fetchApiData(url) {
        fetch(url)
            .then((response) => response.json())
            .then((apiData) => {
                // update match schedules
                schedHandler.createSchedulesFile(apiData, GAMEMODE.REGULAR);
                schedHandler.createSchedulesFile(apiData, GAMEMODE.CHALLENGE);
                schedHandler.createSchedulesFile(apiData, GAMEMODE.OPEN);
                schedHandler.createSchedulesFile(apiData, GAMEMODE.X);
                // update salmon run schedules
                schedHandler.createSchedulesFile(apiData, GAMEMODE.SALMON);
                console.log(
                    `Update schedule data files by gamemode from ${url}.`,
                );
            })
            .catch((error) => {
                console.error(error);
            });
    },
    /**
     * API 호출 모듈을 원하는 시간마다 동작하도록 스케줄링한다.
     */
    createFetchApiTimer(url) {
        console.log("Register api-fetch timer.");
        // 홀수 시 1분마다 API 데이터 가져온다
        const rule = new schedule.RecurrenceRule();
        rule.hour = Array.from({ length: 24 })
            .map((x, i) => i)
            .filter((x) => x % 2 === 0);
        rule.minute = 1;
        rule.tz = "Etc/UTC";
        schedule.scheduleJob(rule, () => {
            this.fetchApiData(url);
        });
    },
};
