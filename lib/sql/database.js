var Table = require('./table');

var Database = function Database(name) {
	this.name = name;
	this._tables = {}
}

Database.prototype.toObject = function() {
	var result = {};
	var db = this;
	Object.keys(this._tables)
	.forEach(function(tableName) {
		result[tableName] = db._tables[tableName].toObject()
	})
	return result;
}

Database.prototype.addTable = function addTable(tableOrName) {
	if (tableOrName instanceof Table) {
		this._tables[tableOrName.name] = tableOrName;
	} else {
		var table = new Table(tableOrName);
		this._tables[table.name] = table;
	}
}

Database.prototype.getTable = function getTable(tableName) {
	return this._tables[tableName];
}

module.exports = Database;