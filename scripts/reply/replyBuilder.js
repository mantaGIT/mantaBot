const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

const schedHandler = require("../data/schedule-data-handler.js");
const { GAMEMODE } = require("../../configs/gamemode.json");
const { embedMatchBuilder } = require("./embeds/match-embedBuilder.js");
const { embedSalmonBuilder } = require("./embeds/salmon-embedBuilder.js");
const { embedInfoBuilder } = require("./embeds/info-embedBuilder.js");

module.exports = {
    // ex. gamemode = GAMEMODE.REGULAR
    async scheduleReply(interaction, gamemode) {
        await interaction.deferReply();

        const schedules = schedHandler.loadSchedules(gamemode);
        if (schedules === undefined)
            throw new Error("cannot load schedule json file.");

        const schedNow = schedHandler.getScheduleNow(schedules);
        if (schedNow === undefined)
            throw new Error("cannot find schedule now.");

        const embedBuilder =
            gamemode.mode === GAMEMODE.SALMON.mode
                ? embedSalmonBuilder
                : embedMatchBuilder;

        const schedEmbed = await embedBuilder(schedNow);

        // 스케줄의 시작 시간만 표시, 2024년 08월 20일 21:00와 같은 형식
        const dateFormat = {
            dateStyle: "long",
            timeStyle: "short",
            hour12: false,
            timeZone: "Asia/Seoul",
        };
        const schedTimeList = schedules
            .map((schedule) => {
                const startTime = new Intl.DateTimeFormat(
                    "ko-KR",
                    dateFormat,
                ).format(new Date(schedule.startTime));
                return { id: String(schedule.id), time: `${startTime}` };
            })
            .filter((schedTime) => schedTime.id >= schedNow.id);

        const schedTimeMenu = new StringSelectMenuBuilder()
            .setCustomId("scheduleTime")
            .setPlaceholder("스케줄 시작 시간을 선택해주세요.")
            .addOptions(
                schedTimeList.map((schedTime) => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(schedTime.time)
                        .setValue(schedTime.id);
                }),
            );

        const menuRow = new ActionRowBuilder().addComponents(schedTimeMenu);

        const prev = new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("이전 스케줄")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const next = new ButtonBuilder()
            .setCustomId("next")
            .setLabel("다음 스케줄")
            .setStyle(ButtonStyle.Primary);

        const buttonRow = new ActionRowBuilder().addComponents(prev, next);

        const response = await interaction.editReply({
            embeds: schedEmbed.embeds,
            files: schedEmbed.files,
            components: [menuRow, buttonRow],
        });

        const filter = (i) => i.user.id === interaction.user.id;
        // 응답 가능 시간 : 10분 (time: ms) => 10 * 60 * 1000
        const collector = response.createMessageComponentCollector({
            filter,
            time: 600_000,
        });

        const schedIdList = schedTimeList.map((schedTime) =>
            parseInt(schedTime.id),
        );
        // debug
        console.log(schedIdList);
        const selected = { index: 0, schedId: schedNow.id };

        collector.on("collect", async (i) => {
            menuRow.components.forEach((menu) => menu.setDisabled(true));
            buttonRow.components.forEach((btn) => btn.setDisabled(true));
            i.update({ components: [menuRow, buttonRow] });

            if (i.customId === "scheduleTime") {
                selected.schedId = parseInt(i.values[0]);
                selected.index = schedIdList.findIndex(
                    (id) => id === selected.schedId,
                );
            } else if (i.customId === "prev") {
                selected.schedId = schedIdList[--selected.index];
            } else if (i.customId === "next") {
                selected.schedId = schedIdList[++selected.index];
            }

            // debug
            console.log(selected.index, selected.schedId);

            const selectedSched = schedHandler.getScheduleById(
                schedules,
                selected.schedId,
            );
            const editEmbed = await embedBuilder(selectedSched);

            menuRow.components.forEach((menu) => menu.setDisabled(false));
            buttonRow.components[0].setDisabled(selected.index === 0);
            buttonRow.components[1].setDisabled(
                selected.index === schedIdList.length - 1,
            );

            await interaction.editReply({
                embeds: editEmbed.embeds,
                files: editEmbed.files,
                components: [menuRow, buttonRow],
            });
        });
        collector.on("end", () => {
            interaction.editReply({
                content: "스케줄 선택 가능 시간이 만료되었습니다.",
            });
        });
    },
    async infoReply(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const botInfoEmbed = await embedInfoBuilder();
        await interaction.editReply(botInfoEmbed);
    },
};
