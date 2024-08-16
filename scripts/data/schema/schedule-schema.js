// API 원본 데이터를 바탕으로 원하는 정보만 가져와 새로운 데이터 구조 생성
class Schedule {
	constructor(mode, st, et, rule, stages) {
		this.mode = mode;
		this.startTime = st;
		this.endTime = et;
		this.rule = rule;
		this.stages = stages;
	}
};
module.exports = { Schedule };