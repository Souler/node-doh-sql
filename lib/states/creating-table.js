var State = require('./base');

CreatingTableState = function CreatingTableState(table) {
	State.call(this);
	this.table = table;
}

CreatingTableState.prototype = Object.create(State.prototype);
CreatingTableState.prototype.constructor = CreatingTableState;

module.exports = CreatingTableState;