var sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite"
const CREATE_USER_DB = "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name text UNIQUE, CONSTRAINT name_unique UNIQUE(name))";
const CREATE_TASK_DB = "CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY AUTOINCREMENT, task_id INTEGER, task_info text)";
const CREATE_COMPLETED_TASK_DB = "CREATE TABLE IF NOT EXISTS completed_task (id INTEGER PRIMARY KEY AUTOINCREMENT, task_id INTEGER, task_info text)";
const CREATE_TASK_DELETE_TRIGGER = "CREATE TRIGGER IF NOT EXISTS deleteTaskTrigger BEFORE DELETE ON user FOR EACH ROW BEGIN DELETE FROM task WHERE OLD.id = task_id; END";
const CREATE_COMPLETED_TASK_DELETE_TRIGGER = "CREATE TRIGGER IF NOT EXISTS deleteCompletedTaskTrigger BEFORE DELETE ON user FOR EACH ROW BEGIN DELETE FROM completed_task WHERE OLD.id = task_id; END";

let db = new sqlite3.Database(DBSOURCE, (err) => {
	if(err) {
		console.log(err.message)
		throw err
	} else {
		db.serialize(function() {
			db.run(CREATE_USER_DB, (err) => {
				if(err) { console.log(err) };
			});
			db.run(CREATE_TASK_DB);
			db.run(CREATE_COMPLETED_TASK_DB);
			db.run(CREATE_TASK_DELETE_TRIGGER);
			db.run(CREATE_COMPLETED_TASK_DELETE_TRIGGER);
		});
	}
});

module.exports = db
