const {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

const { GAMEMODE } = require("../../data/schema/api-data-mapping.js");
const schedHandler = require("../../data/schedule-data-handler.js");
const schedEmbedBuilder = require("../../reply-builders/schedule-embedBuilder.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("챌린지")
        .setDescription(
            "선택한 시간대의 카오폴리스 매치(챌린지) 스케줄을 알려줍니다.",
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const schedules = schedHandler.loadScheduleJson(GAMEMODE.CHALLENGE);
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

        // 응답 가능 시간 : 10분 (time: ms) => 10 * 60 * 1000
        const collector = response.createMessageComponentCollector({
            time: 600_000,
        });

        let currNode = schedNow.node;
        const schedNodeList = schedules.map((schedule) => schedule.node);

        collector.on("collect", async (i) => {
            if (i.member.id !== interaction.user.id) {
                return i.reply({
                    content: "스케줄 시간 선택은 명령어 사용자만 가능합니다.",
                    ephemeral: true,
                });
            }
            if (i.customId === "scheduleTime") {
                currNode = parseInt(i.values[0]);
            } else if (i.customId === "prev") {
                currNode = currNode - 1;
            } else if (i.customId === "next") {
                currNode = currNode + 1;
            }
            const [prevNode, nextNode] = [currNode - 1, currNode + 1];
            buttonRow.components[0].setDisabled(
                schedNodeList.find((node) => node === prevNode) === undefined,
            );
            buttonRow.components[1].setDisabled(
                schedNodeList.find((node) => node === nextNode) === undefined,
            );
            const selectedSched = schedHandler.getScheduleByNode(
                schedules,
                currNode,
            );
            const editEmbed =
                await schedEmbedBuilder.embedScheduleBuilder(selectedSched);
            i.deferUpdate();
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
