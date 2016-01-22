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
		regex: /^CREATE TABLE .*`(.+?)`.*?\(/,
		handle: function(match) {
			var name = match[1];
			var table = new SQL.Table(name);
			db.addTable(table);
			currentState = new State.CreatingTable(table);
			return true;
		}
	},
	{
		// Handle columns definition on table creation
		regex: /^`(.+?)`\s+(.+?)\s+(.*)/,
		state: State.CreatingTable,
		handle: function(match) {
			var rgxType = /^([a-zA-Z0-9]+)(?:\(([0-9,]+)\))?$/;

			var typeRaw = match[2];
			var propertiesRaw = match[3] || '';
			
			var typeMatch = rgxType.exec(typeRaw);

			var name = match[1];
			var type = new SQL.Column.Type(typeMatch[1], typeMatch[2]);
			var properties = SQL.Column.parseProperties(propertiesRaw);

			currentState.table.addColumn(new SQL.Column(name, type, properties));
			return true;
		}
	},
	{
		regex: /^(UNIQUE|PRIMARY|)\s*KEY\s*`(.+?)`\s*\((.+?)\),?/,
		state: State.CreatingTable,
		handle: function(match) {
			var name = match[2];
			var typeRaw = match[1];
			var columnsRaw = match[3];

			var type = typeRaw.length > 0 ? typeRaw : null;
			var columns = columnsRaw.replace(/^`/, '').replace(/`$/, '').split('`,`');
			// TODO: Make columns a reference to the actual table 
			// columns instead of simply a column name

			currentState.table.addKey(new SQL.Key(name, type, columns));
			return true;
		}

	},
	{
		regex: /^INSERT INTO `(.*?)` VALUES (.*)$/,
		handle: function(match) {
			var tableName = match[1];
			var table = db.getTable(tableName);
			currentState = new State.InsertingIntoTable(table);

			var valuesRaw = match[2];
			var valuesRgx = /(?:'(?:\\.|[^'])*'|[^,])+/g;

			var columnValues = null;
			var columnValue = null;
			var rowDone = false;

			while ((columnValue = valuesRgx.exec(valuesRaw)) !== null) {
				columnValue = columnValue[0];

				if (columnValue.charAt(0) == '(') {
					columnValues = [];
					columnValue = columnValue.substr(1);
					rownDone = false;
				}

				if (columnValue.charAt(columnValue.length - 1) == ')' || 
					columnValue.charAt(columnValue.length - 1) == ';') { // TODO: improve this
					columnValue = columnValue.replace(/\);?$/, '');
					rownDone = true;
				}

				if (columnValue == 'NULL')
					columnValue = null;
				else if (columnValue.charAt(0) == '\'' && columnValue.charAt(columnValue - 1) == '\'')
					columnValue = String(columnValue.substr(1, columnValue.length-2));
				else if (!isNaN(columnValue))
					columnValue = Number(columnValue);
				else
					throw new Error('Unown column value ' + columnValue);

				columnValues.push(columnValue)

				if (rownDone)
					table.insert(columnValues);
			}
		}
	}
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

		if (p.states || p.state) { // This parser requires a specific state, check it
			if (p.states) {
				var compatibleStates = p.states.filter((s) => (currentState instanceof s));
				if (compatibleStates.length <= 0)
					continue;
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