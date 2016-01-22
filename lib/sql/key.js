var Key = function Key(name, type, columns) {
	this.name = name;
	this.type = type;
	this.columns = columns || [];
}

module.exports = Key;
