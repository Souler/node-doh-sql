var State = require('./base');
State.None = require('./none');
State.CreatingTable = require('./creating-table');
State.InsertingIntoTable = require('./inserting');

module.exports = State;