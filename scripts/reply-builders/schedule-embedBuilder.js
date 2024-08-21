const path = require('node:path');
// eslint-disable-next-line no-undef
const mainPath = path.dirname(path.dirname(__dirname));

const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');

const { stages: stagesKR, rules: rulesKR } = require('../../configs/ko-KR.json');
const { gamemode: gamemodeKR } = require('../../configs/gamemodeKR.json');
const _ = require('lodash');

const { getFormatTimes } = require('./timeFormat-setter.js');


module.exports = {
	async embedScheduleBuilder(schedule) {
		const mode = _.get(gamemodeKR, `${schedule.mode}.name`);
		const [ startTime, endTime ] = getFormatTimes(schedule);
		const rule = _.get(rulesKR, `${schedule.rule.id}.name`);
		const [ stage1, stage2 ] = schedule.stages.map(x => _.get(stagesKR, `${x.id}.name`));

		const [ stageUrl1, stageUrl2 ] = schedule.stages.map(x => path.join(mainPath, `resources/images/stages/${x.id}.png`));
		const stagesImage = await this.attachStagesImage(stageUrl1, stageUrl2);
		const modeImage = await this.attachModeImage(schedule.mode);

		const scheduleInfoEmbed = new EmbedBuilder()
			.setColor(0x568ea8)
			.setTitle(mode)
			.setDescription(`${startTime} ~ ${endTime}`)
			.setThumbnail(`attachment://${modeImage.name}`)
			.addFields({ name: '룰', value: `${rule}` })
			.addFields({ name: '스테이지', value: `${stage1} / ${stage2}` })
			.setImage(`attachment://${stagesImage.name}`)
			.setTimestamp()
			.setFooter({ text: 'Data access @splatoon3.ink' });

		return { embeds: [ scheduleInfoEmbed ], files: [ stagesImage, modeImage ] };
	},

	async attachStagesImage(url1, url2) {
		const canvas = Canvas.createCanvas(800, 200);
		const context = canvas.getContext('2d');
		try {
			const stage1 = await Canvas.loadImage(url1);
			const stage2 = await Canvas.loadImage(url2);

			context.drawImage(stage1, 0, 0, 400, 200);
			context.drawImage(stage2, 400, 0, 400, 200);
		}
		catch (error) {
			console.error(error);
		}
		return new AttachmentBuilder(await canvas.encode('png'), { name: 'stages-image.png' });
	},

	async attachModeImage(mode) {
		const canvas = Canvas.createCanvas(40, 40);
		const context = canvas.getContext('2d');
		try {
			const modeImg = await Canvas.loadImage(path.join(mainPath, `resources/images/mode/${mode}.png`));
			context.drawImage(modeImg, 0, 0, canvas.width, canvas.height);
		}
		catch (error) {
			console.error(error);
		}
		return new AttachmentBuilder(await canvas.encode('png'), { name: 'mode-image.png' });
	},
};
