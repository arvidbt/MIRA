// Creates express app
var express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
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

// Get all completed tasks from certain id
app.get("/api/completed/:id", (req, res, next) => {
	var sql = "SELECT * FROM completed_task WHERE task_id = ?"
	params = [req.params.id, req.params.task_info];
	console.log(req.params);
	db.all(sql, params, (err, rows) => {
		if(err) {
			res.status(400).json({"error":err.message});
			return;
		}
		res.json({
			"message":"success",
			"data":rows
		});
	});
})

// Get all tasks from certain id
app.get("/api/task/:id", (req, res, next) => {
	var sql = "SELECT * FROM task WHERE task_id = ?"
	params = [req.params.id, req.params.task_info];
	console.log(req.params);
	db.all(sql, params, (err, rows) => {
		if(err) {
			res.status(400).json({"error":err.message});
			return;
		}
		res.json({
			"message":"success",
			"data":rows
		});
	});
})

// Get a single user from DB.
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
app.post("/api/task", (req, res, next) => {
	var data = {
		task_id: req.body.task_id,
		task_info: req.body.task_info
	}
	var sql = 'INSERT INTO task (task_id, task_info) VALUES (?,?)'
	var params = [data.task_id, data.task_info]
	db.run(sql, params, function(err, result) {
		if(err) {
			res.status(400).json({"error":err.message})
			return
		}
		res.json({
			"message":"success",
			"data":data,
		})
	});
})


// Adds task completed task to database.
app.post("/api/completed", (req, res, next) => {
	var data = {
		task_id: req.body.task_id,
		task_info: req.body.task_info
	}
	var sql = 'INSERT INTO completed_task (task_id, task_info) VALUES (?,?)'
	var params = [data.task_id, data.task_info]
	db.run(sql, params, function(err, result) {
		if(err) {
			res.status(400).json({"error":err.message})
			return
		}
		res.json({
			"message":"success",
			"data":data,
		})
	});
})

// Adds user to database.
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
app.patch("/api/user/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
    }
    db.run(
        `UPDATE user 
           name = coalesce(?,name), 
           WHERE id = ?`,
        [data.name, req.params.id],
        (err, result) => {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data
            })
    });
})


// Updates a user
app.patch("/api/task/:id", (req, res, next) => {
    var data = {task_info: req.body.name}
    db.run(
        `UPDATE task set 
           task_info = COALESCE(?,task_info), 
           WHERE id = ?`,
        [data.task_info, req.params.id],
        function (err, result) {
            if (err){
				console.log(err);
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                "message": "success",
                "data": data,
				changes: this.changes
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

app.delete("/api/task/:id", (req, res) => {
	console.log("Hehe");
	db.run(
		'DELETE FROM task WHERE id = ?',
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

