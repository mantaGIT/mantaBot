const fs = require('node:fs');
const path = require('node:path');

const pathsObj = {
	paths : {
		main : undefined,
		config : undefined,
		src : undefined,
		resources : undefined,
	},
};

// eslint-disable-next-line no-undef
const projectFolderPath = path.dirname(__dirname);

pathsObj.paths.main = projectFolderPath;
pathsObj.paths.config = path.join(projectFolderPath, 'config');
pathsObj.paths.src = path.join(projectFolderPath, 'src');
pathsObj.paths.resources = path.join(projectFolderPath, 'resources');
console.log(JSON.stringify(pathsObj, null, 4));

const pathFilePath = path.join(pathsObj.paths.config, 'paths.json');
fs.writeFileSync(pathFilePath, JSON.stringify(pathsObj, null, 4));
