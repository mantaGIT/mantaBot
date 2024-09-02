// API 호출로 가져온 데이터로부터 원하는 정보만 추출
const _ = require("lodash");
const { MatchSchedule, SalmonSchedule, ApiDataMap } = require("./_schema.js");

module.exports = {
    // ex. gamemode = GAMEMODE.REGULAR
    parseMatchData(apiData, gamemode) {
        const apiDataMap = ApiDataMap[gamemode.mode];
        console.log(apiDataMap);
        const nodes = _.get(apiData, `data.${apiDataMap.group}.nodes`);

        const data = nodes
            .map((node) => {
                const startTime = node.startTime;
                const endTime = node.endTime;
                const setting =
                    apiDataMap.settingMode === undefined
                        ? _.get(node, apiDataMap.setting)
                        : _.find(_.get(node, apiDataMap.setting), {
                              bankaraMode: `${apiDataMap.settingMode}`,
                          });
                const rule = _.get(setting, "vsRule.id");
                const stages = _.map(_.get(setting, "vsStages"), "id");
                return MatchSchedule(
                    new Date(startTime).getTime(),
                    gamemode.mode,
                    startTime,
                    endTime,
                    rule,
                    stages,
                );
            })
            .sort((a, b) => a.no - b.no);
        return data;
    },
    // ex. gamemode = GAMEMODE.SALMON
    parseSalmonData(apiData, gamemode) {
        const apiDataMap = ApiDataMap[gamemode.mode];
        // debug
        console.log(apiDataMap);

        let data = [];
        // subgroup : regularSchedules, bigRunSchedules
        for (const subgroup of apiDataMap.subgroups) {
            const nodes = _.get(
                apiData,
                `data.${apiDataMap.group}.${subgroup}.nodes`,
            );
            if (nodes.length === 0) break;

            const salmonSchedules = nodes.map((node) => {
                const startTime = node.startTime;
                const endTime = node.endTime;
                const setting = _.get(node, apiDataMap.setting);
                const stage = _.get(setting, "coopStage.id");
                const boss = _.get(setting, "boss.id");
                const weapons = _.map(
                    _.get(setting, "weapons"),
                    "__splatoon3ink_id",
                );
                return SalmonSchedule(
                    new Date(startTime).getTime(),
                    gamemode.mode,
                    subgroup,
                    startTime,
                    endTime,
                    stage,
                    boss,
                    weapons,
                );
            });
            data = [...data, ...salmonSchedules];
        }
        data = data.sort((a, b) => a.no - b.no);
        return data;
    },
};
