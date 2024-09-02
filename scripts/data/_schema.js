module.exports = {
    // 매치 스케줄 데이터 구조 (레귤러, 챌린지, 오픈, X매치)
    MatchSchedule: (no, mode, startTime, endTime, rule, stages) => {
        return {
            no: no,
            mode: mode,
            startTime: startTime,
            endTime: endTime,
            rule: rule,
            stages: stages,
        };
    },
    // 연어런 스케줄 데이터 구조
    SalmonSchedule: (
        no,
        mode,
        subgroup,
        startTime,
        endTime,
        stage,
        boss,
        weapons,
    ) => {
        return {
            no: no,
            mode: mode,
            subgroup: subgroup,
            startTime: startTime,
            endTime: endTime,
            stage: stage,
            boss: boss,
            weapons: weapons,
        };
    },
    // API 데이터 파싱을 위한 맵핑
    ApiDataMap: {
        regular: {
            group: "regularSchedules",
            subgroups: [],
            setting: "regularMatchSetting",
            settingMode: undefined,
        },
        challenge: {
            group: "bankaraSchedules",
            subgroups: [],
            setting: "bankaraMatchSettings",
            settingMode: "CHALLENGE",
        },
        open: {
            group: "bankaraSchedules",
            subgroups: [],
            setting: "bankaraMatchSettings",
            settingMode: "OPEN",
        },
        x: {
            group: "xSchedules",
            subgroups: [],
            setting: "xMatchSetting",
            settingMode: undefined,
        },
        salmon: {
            group: "coopGroupingSchedule",
            subgroups: ["regularSchedules", "bigRunSchedules"],
            setting: "setting",
            settingMode: undefined,
        },
    },
};
