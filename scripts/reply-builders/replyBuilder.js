const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

const schedHandler = require("../data/schedule-data-handler.js");
const schedEmbedBuilder = require("./schedule-embedBuilder.js");
const botInfoEmbedBuilder = require("../../scripts/reply-builders/botInfo-embedBuilder.js");

module.exports = {
    async botInfoReply(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const botInfoEmbed = await botInfoEmbedBuilder.botInfoEmbedBuilder();
        await interaction.editReply(botInfoEmbed);
    },
    async scheduleReply(interaction, gamemode) {
        await interaction.deferReply();

        const schedules = schedHandler.loadScheduleJson(gamemode);
        if (schedules === undefined)
            throw new Error("cannot load schedule json file.");

        const schedNow = schedHandler.getScheduleNow(schedules);
        if (schedNow === undefined)
            throw new Error("cannot find schedule now.");

        const schedEmbed =
            await schedEmbedBuilder.embedScheduleBuilder(schedNow);

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
                return { node: String(schedule.node), time: `${startTime}` };
            })
            .filter((schedTime) => schedTime.node >= schedNow.node);

        const schedTimeMenu = new StringSelectMenuBuilder()
            .setCustomId("scheduleTime")
            .setPlaceholder("스케줄 시작 시간을 선택해주세요.")
            .addOptions(
                schedTimeList.map((schedTime) => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(schedTime.time)
                        .setValue(schedTime.node);
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

        let currNode = schedNow.node;
        const schedNodeList = schedTimeList.map((schedTime) =>
            parseInt(schedTime.node),
        );

        collector.on("collect", async (i) => {
            menuRow.components.forEach((menu) => menu.setDisabled(true));
            buttonRow.components.forEach((btn) => btn.setDisabled(true));
            i.update({ components: [menuRow, buttonRow] });

            if (i.customId === "scheduleTime") {
                currNode = parseInt(i.values[0]);
            } else if (i.customId === "prev") {
                currNode = currNode - 1;
            } else if (i.customId === "next") {
                currNode = currNode + 1;
            }

            const selectedSched = schedHandler.getScheduleByNode(
                schedules,
                currNode,
            );
            const editEmbed =
                await schedEmbedBuilder.embedScheduleBuilder(selectedSched);

            const [prevNode, nextNode] = [currNode - 1, currNode + 1];
            menuRow.components.forEach((menu) => menu.setDisabled(false));
            buttonRow.components[0].setDisabled(
                schedNodeList.find((node) => node === prevNode) === undefined,
            );
            buttonRow.components[1].setDisabled(
                schedNodeList.find((node) => node === nextNode) === undefined,
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
};
