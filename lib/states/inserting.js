var State = require('./base');

InsertingIntoTableState = function InsertingIntoTableState(table) {
	State.call(this);
	this.table = table;
}

InsertingIntoTableState.prototype = Object.create(State.prototype);
InsertingIntoTableState.prototype.constructor = InsertingIntoTableState;

module.exports = InsertingIntoTableState;