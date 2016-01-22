var Column = function Column(name, type, properties) {

	if (typeof name != 'string')
		throw new Error('Column name must be a String');

	if (!(type instanceof Column.Type)) {
		if (typeof type == 'string')
			type = new Column.Type(name);
		else
			throw new Error('Column type must be a String');
	}

	if (properties && !(properties instanceof Array))
		throw new Error('Column properties must be an Array');

	this.name = name;
	this.type = type;
	this.properties = properties || [];
}

Column.Type = function ColumnType(name, length) {

	if (typeof name != 'string')
		throw new Error('ColumnType name must be a String');
	if (length && isNaN(length))
		throw new Error('ColumnType length must be a Number');

	this.name = name;
	this.length = length ? Number(length) : undefined;
}

// TODO: Place this somewhere else
Column.parseProperties = function(str) {
	return str
	.split(' ')
	.reduce((v, c, i, a) => {
		if (c == 'NOT' || c == 'DEFAULT')
			a[i+1] = c + ' ' + a[i+1];
		else
			v.push(c);
		return v;
	}, []);
}

module.exports = Column;