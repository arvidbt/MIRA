
const BASE_URL = "http://localhost:8000/api"

// Completes a entry. Deletes from task table and reload the users list.
const entryCompleted = (id) => {
	const userID = document.getElementById("usersDropdown").value;
	console.log(id);
	axios.delete(`${BASE_URL}/task/${id}`).then(function(response) {
		console.log(response);
	});
	clearUserTasks();
	getCompletedUserTasks(userID);
	getUserTasks(userID);
}

// Adds entry to completed_task table.
const addEntryToCompleted = (task_id, task_info) => {
	axios.post(`${BASE_URL}/completed`, {
		task_id: task_id,
		task_info: task_info
	}).then(function(response) {
		console.log(response);
	})
}

// Edits a entry from task_table.
const entryEdit = async (id) => {
	const userID = document.getElementById("usersDropdown").value;
	var editResponse = prompt("Edit task: ", "");
	const res = await axios.patch(`${BASE_URL}/task/${id}`,
		{task_info: editResponse})
		.then(function(response) {
			console.log(response)
		});
	console.log(id);
	clearUserTasks();
	getUserTasks(userID);
	getCompletedUserTasks(userID);
}

// Loads all users from user table. 
/**
 * Loads all non-completed tasks for a user.
 * @param {*} id 
 */
const getUserTasks = async (id) => {
	const res = await axios.get(`${BASE_URL}/task/${id}`);
	const userTasks = document.getElementById("userTasks");
	task = res.data;
	res.data.data.forEach(task => {
		const taskEntry = document.createElement("li");
		const taskComplete = document.createElement("button");
		const taskEdit = document.createElement("button");
		const taskName = document.createElement("h5");

		taskEdit.textContent = "Edit";
		taskEdit.className = "edit-btn col";
		taskComplete.textContent = "Complete";
		taskComplete.className = "complete-btn col";
		taskName.textContent = task.task_info;
		taskName.className = "col-8";
		taskEntry.className = "row align-items-center";

		taskComplete.addEventListener("click", (event) => {
			addEntryToCompleted(task.task_id, task.task_info);
			entryCompleted(task.id);
		});
		taskEdit.addEventListener("click", (event) => {
			entryEdit(task.id);
		})

		taskEntry.appendChild(taskName);
		taskEntry.appendChild(taskEdit);
		taskEntry.appendChild(taskComplete);
		userTasks.appendChild(taskEntry)
	})
}

// Gets all entries from completed_task table
const getCompletedUserTasks = async (id) => {
	const res = await axios.get(`${BASE_URL}/completed/${id}`);
	task = res.data;
	const userTasks = document.getElementById("completedTasks");
	res.data.data.forEach(task => {
		const completedEntry = document.createElement("li");
		const deleteCompleteBtn = document.createElement("button");
		deleteCompleteBtn.className = "delete-btn col";
		const cTaskName = document.createElement("h5");
		completedEntry.className = "row align-items-center";
		cTaskName.className = "col-10";
		cTaskName.textContent = task.task_info;
		deleteCompleteBtn.textContent = "Delete";

		deleteCompleteBtn.addEventListener("click", (event) => {
			deleteCompletedTask(task.id);
		})

		completedEntry.appendChild(cTaskName);
		completedEntry.appendChild(deleteCompleteBtn);
		userTasks.appendChild(completedEntry)
	})
	console.log(res.data);
}

// Deletes a task from completed_task table.
const deleteCompletedTask = (id) => {
	const userID = document.getElementById("usersDropdown").value;
	console.log(id);
	axios.delete(`${BASE_URL}/completed/${id}`).then(function(response) {
		console.log(response);
	});
	clearUserTasks();
	getCompletedUserTasks(userID);
	getUserTasks(userID);
}


// Creates a user option.
const createOption = (user) => {
	const option = document.createElement("option");
	option.addEventListener("change", () => {
		getUserTasks(user.id)
	});
	option.innerHTML = user.name;
	option.value = user.id;
	return option;
}

// Deletes a task from task_table.
const deleteUserTasks = (id) => {
	const res = axios.delete(`${BASE_URL}/task/${id}`)
}

// Adds users to a dropdown list.
const appendUsers = async  () => {
	const selectUsersElem = document.getElementById("usersDropdown");
	const res = await axios.get(`${BASE_URL}/users`);
	console.log(res);
	const users = res.data;
	users.data.forEach(user => {
		console.log(user)
		const userOption = createOption(user)
		selectUsersElem.appendChild(userOption);
	});
}

// Clears the dropdown list.
const clearDropdown = () => {
	document.getElementById("usersDropdown").options.length = 0;
	
}

// Clears the UL with all user tasks.
const clearUserTasks = () => {
	document.getElementById("userTasks").innerHTML = "";
	document.getElementById("completedTasks").innerHTML = "";
}

// Adds task to task table.
const onSubmitTask = () => {
	const taskform = document.getElementById("taskform");
	taskform.addEventListener("submit", function(e) {
		e.preventDefault();
		const userID = document.getElementById("usersDropdown").value;
		var data = new FormData(taskform);
		for(const [name, value] of data) {
			axios.post(`${BASE_URL}/task`, {
				task_id: userID,
				task_info: value
			}).then(function(response) {
				console.log(response);
			})
		}
		taskform.reset();
		clearUserTasks();
		getUserTasks(userID);
		getCompletedUserTasks(userID);
		document.getElementById("taskform").value = "";
	});
}

// Adds user to user table.
const onAddUser = () => {
	const form = document.getElementById("form");
	form.addEventListener("submit", function(e) {
		e.preventDefault();
		var data = new FormData(form);
		for( const [name, value ] of data) {
			if(value != null || value != "") {
				axios.post(`${BASE_URL}/user`, {
					name: value
				});
			}
		}
		form.reset();
		clearDropdown();
		appendUsers();
	});
}

// Deletes user from user table. This triggers a trigger, and all users tasks are removed aswell.
const onDeleteUser = () => {
	const deleteUser = document.getElementById("deleteuser");
	deleteUser.addEventListener("click", (event) =>  {
		const id = document.getElementById("usersDropdown").value;
		const res = axios.delete(`${BASE_URL}/user/${id}`).then(function(response) {
			console.log(response);
			console.log("wiho");
		}).catch((error) => {
			console.log("test test");
			console.log(error);
		})
		document.getElementById("usersDropdown").innerHTML = "";
		console.log(res);
		appendUsers();
		clearUserTasks(id);
	});
}

// Loads all tasks and completed tasks when user chosen.
const onLoadUser = () => {
	const selectUsersElem = document.getElementById("usersDropdown");
	selectUsersElem.addEventListener("input", (event) => {
		const id = document.getElementById("usersDropdown").value;
		clearUserTasks();
		getUserTasks(id);
		getCompletedUserTasks(id);
	});
}

// Loads the first user.
const loadInitialUser = async () => {
	const res = await axios.get(`${BASE_URL}/users`);
	console.log(res);
	getUserTasks(res.data.data[0].id);
	getCompletedUserTasks(res.data.data[0].id);
}

// mainy painy
const main = async () => {
	clearUserTasks();
	onAddUser();
	appendUsers();
	onSubmitTask();
	onLoadUser();
	onDeleteUser();
	loadInitialUser();
}

main();


