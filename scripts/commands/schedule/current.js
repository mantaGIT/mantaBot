const { SlashCommandBuilder } = require("discord.js");
const {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
} = require("discord.js");

const {
    GAMEMODE,
} = require("../../../scripts/data/schema/api-data-mapping.js");
const schedHandler = require("../../../scripts/data/schedule-data-handler.js");
const schedEmbedBuilder = require("../../../scripts/reply-builders/schedule-embedBuilder.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("스케줄")
        .setDescription("현재 스플래툰3 스케줄 정보를 알려줍니다.")
        .addStringOption((option) =>
            option
                .setName("mode")
                .setDescription("원하는 게임 모드를 선택합니다.")
                .setRequired(true)
                .addChoices(
                    { name: "레귤러", value: "REGULAR" },
                    { name: "챌린지", value: "CHALLENGE" },
                    { name: "오픈", value: "OPEN" },
                    { name: "엑매", value: "X" },
                ),
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const option = GAMEMODE[interaction.options.getString("mode")];
        const schedules = schedHandler.loadScheduleJson(option);
        if (schedules === undefined)
            throw new Error("cannot load schedule json file.");

        const schedNow = schedHandler.getScheduleNow(schedules);
        if (schedNow === undefined)
            throw new Error("cannot find schedule now.");

        const schedEmbed =
            await schedEmbedBuilder.embedScheduleBuilder(schedNow);

        const prev = new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("이전 스케줄")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const next = new ButtonBuilder()
            .setCustomId("next")
            .setLabel("다음 스케줄")
            .setStyle(ButtonStyle.Primary);

        const actionRow = new ActionRowBuilder().addComponents(prev, next);

        const response = await interaction.editReply({
            embeds: schedEmbed.embeds,
            files: schedEmbed.files,
            components: [actionRow],
        });

        const minNode = schedNow.node;
        const maxNode = schedules.at(-1).node;
        let currNode = schedNow.node;

        // debug
        // console.log(new Date(Date.now()));

        // 응답 가능 시간 : 10분 (time: ms) => 10 * 60 * 1000
        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 600_000,
        });

        collector.on("collect", async (i) => {
            if (i.member.id !== interaction.user.id) {
                return i.reply({
                    content: "버튼 사용은 명령어 사용자만 가능합니다.",
                    ephemeral: true,
                });
            } else if (i.customId === "prev") {
                currNode = currNode - 1;
            } else if (i.customId === "next") {
                currNode = currNode + 1;
            }
            actionRow.components[0].setDisabled(currNode === minNode);
            actionRow.components[1].setDisabled(currNode === maxNode);

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
                components: [actionRow],
            });
        });
        collector.on("end", () => {
            // debug
            // console.log(new Date(Date.now()));
            interaction.editReply({
                content: "스케줄 선택 가능 시간이 만료되었습니다.",
            });
        });
    },
};
