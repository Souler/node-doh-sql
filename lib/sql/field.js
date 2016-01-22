var Field = function Field(name, type, properties) {

	if (typeof name != 'string')
		throw new Error('Field name must be a String');

	if (!(type instanceof Field.Type)) {
		if (typeof type == 'string')
			type = new Field.Type(name);
		else
			throw new Error('Field type must be a String');
	}

	if (properties && !(properties instanceof Array))
		throw new Error('Field properties must be an Array');

	this.name = name;
	this.type = type;
	this.properties = properties || [];
}

Field.Type = function FieldType(name, length) {
	this.name = name;
	this.length = length;
}

// TODO: Place this somewhere else
Field.parseProperties = function(str) {
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

module.exports = Field;