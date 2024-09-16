const fs = require('node:fs');
const path = require('node:path');
// eslint-disable-next-line no-undef
const mainPath = path.dirname(path.dirname(__dirname));

const { inlineCode } = require('discord.js');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');


module.exports = {
	async botInfoEmbedBuilder() {
		const botCommandsPath = path.join(mainPath, 'resources/data/info/commands.json');
		const botCommandsFile = fs.readFileSync(botCommandsPath);
		const botCommandList = JSON.parse(botCommandsFile);
		const botCmdDescriptions = botCommandList.map((info) => `${inlineCode(info.cmd)} : ${info.description}`);

		const botInfoEmbed = new EmbedBuilder()
			.setColor(0x568ea8)
			.setTitle('만타봇')
			.setDescription('아직 개발 중이라 명령어가 변경될 수 있어요.\n사용 가능 명령어 목록은 아래 확인해주세요.')
			.addFields(
				{ name: '명령어', value: `${botCmdDescriptions.join('\n')}` },
			)
			.setTimestamp()
			.setFooter({ text: '만타봇 관련 문의는 서버에서 만타를 찾아주세요.' });

		return { embeds: [ botInfoEmbed ] };
	},

	async attachInfoImage(relativePath) {
		const canvas = Canvas.createCanvas(300, 300);
		const context = canvas.getContext('2d');
		try {
			const modeImg = await Canvas.loadImage(path.join(mainPath, relativePath));
			context.drawImage(modeImg, 0, 0, canvas.width, canvas.height);
		}
		catch (error) {
			console.error(error);
		}
		return new AttachmentBuilder(await canvas.encode('png'), { name: 'info-image.png' });
	},
};
