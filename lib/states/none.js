var State = require('./base');

NoneState = function NoneState() {
	State.call(this);
}

NoneStateprototype = Object.create(State.prototype);
NoneStateprototype.constructor = NoneState;

module.exports = NoneState;
