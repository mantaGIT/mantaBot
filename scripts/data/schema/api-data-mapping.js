// API 호출로 가져온 데이터로부터 원하는 정보만 추출하기 위한 맵핑
module.exports = {
    GAMEMODE: Object.freeze({
        REGULAR: {
            id: "regular",
            tag: "regularSchedules",
            setting: "regularMatchSetting",
            mode: undefined,
        },
        CHALLENGE: {
            id: "challenge",
            tag: "bankaraSchedules",
            setting: "bankaraMatchSettings",
            mode: "CHALLENGE",
        },
        OPEN: {
            id: "open",
            tag: "bankaraSchedules",
            setting: "bankaraMatchSettings",
            mode: "OPEN",
        },
        X: {
            id: "x",
            tag: "xSchedules",
            setting: "xMatchSetting",
            mode: undefined,
        },
    }),
};
