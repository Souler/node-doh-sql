var Table = require('./table');

var Database = function Database(name) {
	this.name = name;
	this.tables = {}
}

Database.prototype.addTable = function(tableOrName) {
	if (tableOrName instanceof Table) {
		this.tables[tableOrName.name] = tableOrName;
	} else {
		var table = new Table(tableOrName);
		this.tables[table.name] = table;
	}
}

module.exports = Database;