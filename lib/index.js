var fs = require('fs');
var rl = require('readline');
var util = require('util');

var State = require('./states');
var SQL = require('./sql');

var inputfile = '/some/file/sql/dump.sql';

var lineReader = rl.createInterface({
  input: fs.createReadStream(inputfile)
});

var currentState = null;
var db = new SQL.Database();

var parsers = [
	{
		regex: /;$/,
		handle: function() {
			currentState = new State.None();
			return false;
		}
	},
	{
		regex: /^CREATE TABLE .*`(.*)`.*?\(/,
		handle: function(match) {
			var name = match[1];
			var table = new SQL.Table(name);
			db.addTable(table);
			currentState = new State.CreatingTable(table);
			return true;
		}
	},
	{
		// Handle fields definition on table creation
		regex: /^`(.+?)`\s+(.+?)\s+(.*)/,
		state: State.CreatingTable,
		handle: function(match) {
			var rgxType = /^([a-zA-Z0-9]+)(?:\(([0-9,]+)\))?$/;

			var typeRaw = match[2];
			var propertiesRaw = match[3] || '';
			
			var typeMatch = rgxType.exec(typeRaw);

			var name = match[1];
			var type = new SQL.Field.Type(typeMatch[1], typeMatch[2]);
			var properties = SQL.Field.parseProperties(propertiesRaw);

			currentState.table.addField(new SQL.Field(name, type, properties));
			return true;
		}
	},
];

lineReader.on('line', function (line) {
	line = line.trim();

	/* Ignore empty lines */
	if (line.length == 0)
		return;

	/* Ignore one line comments */
	if (line.indexOf('--') == 0) // Starts with 
		return;

	/* Ignore one line block comment. TODO: Should this support multine comments? */
	if (line.indexOf('/*') == 0 &&
		((line.length - line.lastIndexOf('*/;')) - '*/;'.length) == 0)
		return;


	for (i in parsers) {
		var p = parsers[i];

		if (p.states || p.state) { // This state requires a specific state, check it
			if (p.states) {

			} else if (p.state && !(currentState instanceof p.state))
				continue;

		}

		var rgx = p.regex.exec(line);
		if (rgx != null) 
			if (p.handle(rgx))
				break;
	}
});

lineReader.on('close', function() {
	console.log(util.inspect(db, { depth: null,  colors: true }))
})