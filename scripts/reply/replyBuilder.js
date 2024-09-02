const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

const schedHandler = require("../data/schedule-data-handler.js");
const { embedMatchBuilder } = require("./embeds/match-embedBuilder.js");
const { embedInfoBuilder } = require("./embeds/info-embedBuilder.js");

module.exports = {
    async scheduleReply(interaction, gamemode) {
        await interaction.deferReply();

        const schedules = schedHandler.loadSchedules(gamemode);
        if (schedules === undefined)
            throw new Error("cannot load schedule json file.");

        const schedNow = schedHandler.getScheduleNow(schedules);
        if (schedNow === undefined)
            throw new Error("cannot find schedule now.");

        const schedEmbed = await embedMatchBuilder(schedNow);

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

        // 스케줄 시간 간격 : 2 h = 2 * 60 * 60 * 1000 ms
        const TIME_INTERVAL = 7200000;
        const filter = (i) => i.user.id === interaction.user.id;
        // 응답 가능 시간 : 10분 (time: ms) => 10 * 60 * 1000
        const collector = response.createMessageComponentCollector({
            filter,
            time: 600_000,
        });

        let currSchedId = schedNow.id;
        const schedIdList = schedTimeList.map((schedTime) =>
            parseInt(schedTime.id),
        );

        collector.on("collect", async (i) => {
            menuRow.components.forEach((menu) => menu.setDisabled(true));
            buttonRow.components.forEach((btn) => btn.setDisabled(true));
            i.update({ components: [menuRow, buttonRow] });

            if (i.customId === "scheduleTime") {
                currSchedId = parseInt(i.values[0]);
            } else if (i.customId === "prev") {
                currSchedId = currSchedId - TIME_INTERVAL;
            } else if (i.customId === "next") {
                currSchedId = currSchedId + TIME_INTERVAL;
            }

            const selectedSched = schedHandler.getScheduleById(
                schedules,
                currSchedId,
            );
            const editEmbed = await embedMatchBuilder(selectedSched);

            const [prevSchedId, nextSchedId] = [
                currSchedId - TIME_INTERVAL,
                currSchedId + TIME_INTERVAL,
            ];
            menuRow.components.forEach((menu) => menu.setDisabled(false));
            buttonRow.components[0].setDisabled(
                !schedIdList.includes(prevSchedId),
            );
            buttonRow.components[1].setDisabled(
                !schedIdList.includes(nextSchedId),
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
