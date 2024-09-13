const process = require('node:process');
// require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

// eslint-disable-next-line no-undef
const mainPath = path.dirname(path.dirname(path.dirname(__dirname)));

const { stages, rules } = require(path.join(mainPath, 'configs/ko-KR.json'));
const { gamemode } = require(path.join(mainPath, 'configs/gamemodeKR.json'));
const _ = require('lodash');

const { SlashCommandBuilder, EmbedBuilder, userMention } = require('discord.js');

const { GAMEMODE } = require(path.join(mainPath, 'scripts/data/schema/api-data-mapping.js'));
const { attachStages, attachMode } = require(path.join(mainPath, 'scripts/data/img-attachmentBuilder.js'));


module.exports = {
	data: new SlashCommandBuilder()
		.setName('현재스케줄')
		.setDescription('현재 스플래툰3 스케줄 정보를 알려줍니다.')
		.addStringOption(option =>
			option.setName('mode')
				.setDescription('원하는 게임 모드를 선택합니다. ex.레귤러, 오픈')
				.setRequired(true)
				.addChoices(
					{ name: '레귤러', value: 'REGULAR' },
					{ name: '챌린지', value: 'CHALLENGE' },
					{ name: '오픈', value: 'OPEN' },
					{ name: '엑매', value: 'X' },
				)),
	async execute(interaction) {
		await interaction.deferReply();

		try {
			const optionValue = GAMEMODE[interaction.options.getString('mode')];
			const schedulesFilePath = path.join(mainPath, `resources/data/schedules/${optionValue.id}.json`);

			const schedulesFile = fs.readFileSync(schedulesFilePath);
			const schedules = JSON.parse(schedulesFile);

			const timeNow = Date.now();
			// const curr = schedules[0];
			const curr = schedules.find((schedule) => timeNow >= new Date(schedule.startTime) && timeNow < new Date(schedule.endTime));
			const dateFormat = {
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
				timeZone: 'Asia/Seoul',
			};
			const mode = _.get(gamemode, `${curr.mode}.name`);
			const startTime = new Intl.DateTimeFormat('en-US', dateFormat).format(new Date(curr.startTime));
			const endTime = new Intl.DateTimeFormat('en-US', dateFormat).format(new Date(curr.endTime));
			const rule = _.get(rules, `${curr.rule.id}.name`);
			const [ stage1, stage2 ] = curr.stages.map(x => _.get(stages, `${x.id}.name`));

			// const msg = `모드: ${mode}\n${startTime} ~ ${endTime}\n룰: ${rule}\n맵: ${stage1}, ${stage2}`;
			const [ stageImgUrl1, stageImgUrl2 ] = curr.stages.map(x => path.join(mainPath, `resources/images/stages/${x.id}.png`));
			const stagesImg = await attachStages(stageImgUrl1, stageImgUrl2);
			const modeImg = await attachMode(curr.mode);

			const scheduleInfoEmbed = new EmbedBuilder()
				.setColor(0x568ea8)
				.setTitle(mode)
				.setDescription(`${startTime} ~ ${endTime}`)
				.setThumbnail(`attachment://${modeImg.name}`)
				.addFields({ name: '룰', value: `${rule}` })
				.addFields({ name: '스테이지', value: `${stage1} / ${stage2}` })
				.setImage(`attachment://${stagesImg.name}`)
				.setTimestamp()
				.setFooter({ text: 'Data access @splatoon3.ink' });

			await interaction.editReply({
				embeds: [ scheduleInfoEmbed ],
				files: [ stagesImg, modeImg ],
			});
		}
		catch (error) {
			console.error(error);
			await interaction.editReply({ content: `${userMention(process.env.DEV_ID)} 명령어 처리에 에러가 발생하였습니다.` });
		}
	},
};