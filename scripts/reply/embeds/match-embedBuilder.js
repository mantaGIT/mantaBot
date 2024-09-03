const _ = require("lodash");
const path = require("node:path");
// eslint-disable-next-line no-undef
const mainPath = path.dirname(path.dirname(path.dirname(__dirname)));

const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");

const { GAMEMODE } = require("../../../configs/gamemode.json");
const { stages, rules } = require("../../../configs/ko-KR.json");

module.exports = {
    /**
     * PVP 매치 스케줄 객체를 출력하는 임베드 메시지를 생성합니다.
     */
    async embedMatchBuilder(schedule) {
        const mode = _.get(GAMEMODE, `${schedule.mode.toUpperCase()}.name`);
        const [startTime, endTime] = getFormattedTimes(schedule);
        const rule = _.get(rules, `${schedule.rule}.name`);
        const [stage1, stage2] = schedule.stages.map((x) =>
            _.get(stages, `${x}.name`),
        );

        const [stageUrl1, stageUrl2] = schedule.stages.map((x) =>
            path.join(mainPath, `resources/images/stages/${x}.png`),
        );
        const modeImage = await attachModeImage(schedule.mode);
        const stagesImage = await attachStagesImage(stageUrl1, stageUrl2);

        const scheduleInfoEmbed = new EmbedBuilder()
            .setColor(0x568ea8)
            .setTitle(mode)
            .setDescription(`${startTime} ~ ${endTime}`)
            .setThumbnail(`attachment://${modeImage.name}`)
            .addFields({ name: "룰", value: `${rule}` })
            .addFields({ name: "스테이지", value: `${stage1} / ${stage2}` })
            .setImage(`attachment://${stagesImage.name}`)
            .setTimestamp()
            .setFooter({ text: "Data access @splatoon3.ink" });

        return { embeds: [scheduleInfoEmbed], files: [stagesImage, modeImage] };
    },
};

async function attachModeImage(mode) {
    const canvas = Canvas.createCanvas(40, 40);
    const context = canvas.getContext("2d");
    try {
        const modeImg = await Canvas.loadImage(
            path.join(mainPath, `resources/images/mode/${mode}.svg`),
        );
        context.drawImage(modeImg, 0, 0, canvas.width, canvas.height);
    } catch (error) {
        console.error(error);
    }
    return new AttachmentBuilder(await canvas.encode("png"), {
        name: "mode-image.png",
    });
}

async function attachStagesImage(url1, url2) {
    const canvas = Canvas.createCanvas(800, 200);
    const context = canvas.getContext("2d");
    try {
        const stage1 = await Canvas.loadImage(url1);
        const stage2 = await Canvas.loadImage(url2);

        context.drawImage(stage1, 0, 0, 400, 200);
        context.drawImage(stage2, 400, 0, 400, 200);
    } catch (error) {
        console.error(error);
    }
    return new AttachmentBuilder(await canvas.encode("png"), {
        name: "stages-image.png",
    });
}

function getFormattedTimes(schedule) {
    const dateFormat = {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Seoul",
    };
    const startTime = new Intl.DateTimeFormat("en-US", dateFormat).format(
        new Date(schedule.startTime),
    );
    const endTime = new Intl.DateTimeFormat("en-US", dateFormat).format(
        new Date(schedule.endTime),
    );
    return [startTime, endTime];
}
