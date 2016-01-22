var Schema = require('./schema');
var Column = require('./column');
var Key = require('./key');

var Table = function Table(name) {
	if (typeof name != 'string')
		throw new Error('Table name must be a String');

	this.name = name;
	this.schema = new Schema();
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

module.exports = Table;