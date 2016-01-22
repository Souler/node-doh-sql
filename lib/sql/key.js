var Key = function Key(name, type, fields) {
	this.name = name;
	this.type = type;
	this.fields = fields || [];
}

module.exports = Key;
