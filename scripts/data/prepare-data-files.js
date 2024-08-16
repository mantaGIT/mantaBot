// 서버에 배포하기 전에 필요한 파일 미리 생성해두기
const fs = require('fs');
const path = require('node:path');
// eslint-disable-next-line no-undef
const mainPath = path.dirname(path.dirname(__dirname));

const scheduleDataPath = path.join(mainPath, 'resources/data/schedules/');
const imageDataPath = path.join(mainPath, 'resources/images/stages/');

const { GAMEMODE } = require(path.join(mainPath, 'scripts/data/schema/api-data-mapping.js'));
const { stages } = require(path.join(mainPath, 'configs/ko-KR.json'));
const _ = require('lodash');

const modeList = _.map(GAMEMODE, 'id');
modeList.forEach((mode) => {
	fs.writeFileSync(path.join(scheduleDataPath, `${mode}.json`), '');
});

const stageIdList = _.keys(stages);
stageIdList.forEach((stageId) => {
	fs.writeFileSync(path.join(imageDataPath, `${stageId}.png`), '');
});