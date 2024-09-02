const fs = require("node:fs");
const path = require("node:path");
// eslint-disable-next-line no-undef
const mainPath = path.dirname(path.dirname(__dirname));
const { stages } = require("../../configs/ko-KR.json");

const stageIds = Object.keys(stages);

const images = fs
    .readdirSync(path.join(mainPath, "resources/images/stages"))
    .filter((file) => file.endsWith(".png"));
const imageIds = images.map((file) => file.split(".")[0]);

const diff = (a, b) => {
    return a.filter((x) => !b.includes(x));
};

console.log(">>> stages");
console.log(diff(stageIds, imageIds));

console.log(">>> images");
console.log(diff(imageIds, stageIds));

console.log("------------------------");

const diffIds = diff(stageIds, imageIds);
for (const [key, value] of Object.entries(stages)) {
    if (diffIds.includes(key)) console.log(`${key}: ${value.name}`);
}
