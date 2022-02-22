// Creates express app
var express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const cors = require("cors");
const path = require("path");
var app = express()
var db = require("./database.js")
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set server port
var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
	console.log("Server running on port %PORT%."
	.replace("%PORT%", HTTP_PORT))
});


// Get all users from DB.
// Ex. http://localhost:8000/api/users
app.get("/api/users", (req, res, next) => {
	var sql = "SELECT * FROM user"
	var params = []
	db.all(sql, params, (err, rows) => {
		if (err) {
		res.status(400).json({"error":err.message});
		return;
		}
		res.json({
			"message":"success",
			"data":rows
		})
	});
});

// Get all tasks
app.get("/api/tasks", (req, res, next) => {
	var sql = "SELECT * FROM task"
	var params = []
	db.all(sql, params, (err, rows) => {
		if (err) {
		res.status(400).json({"error":err.message});
		return;
		}
		res.json({
			"message":"success",
			"data":rows
		})
	});
});

// Get all completed tasks
app.get("/api/completed", (req, res, next) => {
	var sql = "SELECT * FROM completed_task"
	var params = []
	db.all(sql, params, (err, rows) => {
		if (err) {
		res.status(400).json({"error":err.message});
		return;
		}
		res.json({
			"message":"success",
			"data":rows
		})
	});
});

// Get all tasks from certain id
app.get("/api/task/:id", (req, res, next) => {
	var sql = "SELECT * FROM task WHERE id = ?"
	db.get(sql, params, (err, row) => {
		if(err) {
			res.status(400).json({"error":err.message});
			return;
		}
		res.json({
			"message":"success",
			"data":row
		});
	});
})

// Get a single user from DB.
// Ex. http://localhost:8000/api/user/8
app.get("/api/user/:id", (req, res, next) => {
	var sql = "SELECT * FROM user WHERE id = ?"
	var params = [req.params.id]
	db.get(sql, params, (err, row) => {
		if(err) {
			res.status(400).json({"error":err.message});
			return;
		}
		res.json({
			"message":"success",
			"data":row
		});
	});
})

// Adds task to database.
// // Ex. curl -d "name=testing" -X POST http://localhost:8000/api/task/
// app.post("/api/tasks", (req, res, next) => {
// 	var data = {
// 		id = req.body.id,
// 		task_info = req.body.task_info
// 	}
// 	var sql = 'INSERT INTO task (id, task_info) VALUES (?,?)'
// 	var params = [data.id, data.task_info]
// 	db.run(sql, params, function(err, result) {
// 		if(err) {
// 			res.status(400).json({"error":err.message})
// 			return
// 		}
// 		res.json({
// 			"message":"success",
// 			"data":data,
// 		})
// 	});
// })


// Adds user to database.
// Ex. curl -d "name=testing" -X POST http://localhost:8000/api/user/
app.post("/api/user", (req, res, next) => {
	var data = {
		name: req.body.name
	}
	var sql = 'INSERT INTO user (name) VALUES (?)'
	var params = [data.name]
	db.run(sql, params, function(err, result) {
		if(err) {
			res.status(400).json({"error":err.message})
			return
		}
		res.json({
			"message":"success",
			"data":data,
			"id":this.lastID
		})
	});
})



// Updates a user
app.put("/api/user/:id", (req, res, next) => {
    var data = {name: req.body.name}
    db.run(
        `UPDATE user set 
           name = COALESCE(?,name), 
           WHERE id = ?`,
        [data.name, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                "message": "success",
                "data": data
            })
    });
})

// delete a user
// Ex: curl -X "DELETE" http://localhost:8000/api/user/x
app.delete("/api/user/:id", (req, res) => {
	db.run(
		'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

app.use(express.static(path.join(__dirname, 'public')));


app.get("/", (_, res) => {
	res.sendFile("main.html");
});


// Default response for any other request
app.use(function(req, res) {
	res.status(404)
});

