const { paths } = require('../../../config/paths.json');
const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('현재스케줄')
		.setDescription('현재 카오폴리스 오픈 스케줄 정보를 알려줍니다.'),
	async execute(interaction) {
		const schedulesFilePath = path.join(paths.resources, 'data/schedules.json');
		const schedulesFile = fs.readFileSync(schedulesFilePath);
		const schedules = JSON.parse(schedulesFile);

		function Schedule(st, et, rule, maps) {
			this.startTime = st;
			this.endTime = et;
			this.rule = rule;
			this.maps = maps;
		}

		const schedulesOpen = [];
		for (const node of schedules.data.bankaraSchedules.nodes) {
			const maps = node.bankaraMatchSettings[1].vsStages.map(x => x.vsStageId);
			const schedule = new Schedule(node.startTime, node.endTime, node.bankaraMatchSettings[1].vsRule.name, maps);
			// console.log(schedule);
			schedulesOpen.push(schedule);
		}

		const curr = schedulesOpen[0];
		const msg = `${new Date(curr.startTime)} ~ ${new Date(curr.endTime)}\n룰: ${curr.rule}\n맵: ${curr.maps[0]}, ${curr.maps[1]}`;
		// console.log(msg);
		await interaction.reply(msg);
	},
};