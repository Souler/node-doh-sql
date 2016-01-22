var dohSQL = require('./lib');

dohSQL(process.argv.pop())
.then(console.log)
