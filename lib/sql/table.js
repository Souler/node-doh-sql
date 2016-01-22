var util = require('util');
var Schema = require('./schema');
var Column = require('./column');
var Key = require('./key');

var Table = function Table(name) {
	if (typeof name != 'string')
		throw new Error('Table name must be a String');

	this.name = name;
	this.schema = new Schema();
	this.rows = [];
}

Table.prototype.toObject = function() {
	var table = this;
	return this.rows.map(function(row) {
		var _row = {};
		row.forEach(function(columnValue, idx) {
			var columnName = table.schema.columns[idx].name;
			_row[columnName] = columnValue;
		})
		return _row;
	})
}

Table.prototype.addColumn = function(columnOrName, type, properties) {
	if (columnOrName instanceof Column) {
		this.schema.columns.push(columnOrName);
		return;
	}

	this.schema.columns.push(new Column(columnOrName, type, properties));
}

Table.prototype.addKey = function(keyOrName, type, columns) {
	if (keyOrName instanceof Key) {
		this.schema.keys.push(keyOrName);
		return;
	}

	this.schema.keys.push(new Key(keyOrName, type, columns));
}

Table.prototype.insert = function(row) {
	if (this.schema.columns.length != row.length)
		throw new Error(util.format('Column count of the row(%d) and the schema(%d) doesn\'t match', row.length, this.schema.columns.length));

	this.rows.push(row);
}

module.exports = Table;