var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"
const CREATE_USER_DB = "CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, name text UNIQUE, CONSTRAINT name_unique UNIQUE(name))";
const CREATE_TASK_DB = "CREATE TABLE task (id INTEGER PRIMARY KEY, task_info text)";
const CREATE_COMPLETED_TASK_DB = "CREATE TABLE completed_task (id INTEGER PRIMARY KEY, task_info text)";

let db = new sqlite3.Database(DBSOURCE, (err) => {
	if(err) {
		console.log(err.message)
		throw err
	} else {

		console.log('Connected to SQLite user database.')
		db.run(CREATE_USER_DB,
		(err) => {
			if(err) { /* Table already created */
				var insert = 'INSERT INTO user (name) VALUES(?)'
			}
			else {
				var insert = 'INSERT INTO user (name) VALUES(?)'
			}
			console.log(err)
		});


		console.log('Connected to SQLite task database.')
		db.run(CREATE_TASK_DB,
		(err) => {
			if(err) { /* Table already created */
			}
			else {
			}
			console.log(err)
		});


		console.log('Connected to SQLite completed tasks database.')
		db.run(CREATE_COMPLETED_TASK_DB,
		(err) => {
			if(err) { /* Table already created */
			}
			else {
			}
			console.log(err)
		});

	}
});

module.exports = db
