const path = require('node:path');
// eslint-disable-next-line no-undef
const mainPath = path.dirname(path.dirname(__dirname));

const { AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');


module.exports = {
	async attachStages(url1, url2) {
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
	async attachMode(mode) {
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