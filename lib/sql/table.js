var Schema = require('./schema');
var Field = require('./field');

var Table = function Table(name) {
	if (typeof name != 'string')
		throw new Error('Table name must be a String');

	this.name = name;
	this.schema = new Schema();
}

Table.prototype.addField = function(fieldOrName, type, properties) {
	if (fieldOrName instanceof Field) {
		this.schema.fields.push(fieldOrName);
		return;
	}

	this.schema.fields.push(new Field(fieldOrName, type, properties));
}

module.exports = Table;