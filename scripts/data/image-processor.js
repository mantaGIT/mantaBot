const process = require('node:process');
require('dotenv').config();

const path = require('node:path');

const { AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');


module.exports = {
	async createStagesImg(url1, url2) {
		// Create a 800x200 pixel canvas and get its context
		// The context will be used to modify the canvas
		const canvas = Canvas.createCanvas(800, 200);
		const context = canvas.getContext('2d');

		const stage1 = await Canvas.loadImage(url1);
		const stage2 = await Canvas.loadImage(url2);

		// This uses the canvas dimensions to stretch the image onto the entire canvas
		context.drawImage(stage1, 0, 0, 400, 200);
		context.drawImage(stage2, 400, 0, 400, 200);

		// Use the helpful Attachment class structure to process the file for you
		return new AttachmentBuilder(await canvas.encode('png'), { name: 'stages-image.png' });
	},
	async createModeImg(mode) {
		const canvas = Canvas.createCanvas(50, 50);
		const context = canvas.getContext('2d');

		const modeImg = await Canvas.loadImage(path.join(process.env.RESOURCES, `images/mode/${mode}.svg`));
		context.drawImage(modeImg, 0, 0, canvas.width, canvas.height);
		return new AttachmentBuilder(await canvas.encode('png'), { name: 'mode-image.png' });
	},
};