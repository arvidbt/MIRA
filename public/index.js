
const BASE_URL = "http://localhost:8000/api"


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

const addEntryToCompleted = (task_id, task_info) => {
	axios.post(`${BASE_URL}/completed`, {
		task_id: task_id,
		task_info: task_info
	}).then(function(response) {
		console.log(response);
	})
}


const entryEdit = async (id) => {
	const res = await axios.patch(`${BASE_URL}/task/${id}`, {task_info: "Det funkar!"}).then(function(response) {
		console.log(response);
	})
	// var taskEdited = new FormData(taskform);
	// for(const [name, value] of taskEdited) {
	// 	axios.patch(`${BASE_URL}/task`, {
	// 		task_info: value
	// 	}).then(function(response) {
	// 		console.log(response);
	// 	})
	// };

	// Ändra submit form text till edit
	// ändra destination för submit
	// patcha result?
	// ändra tillbaka submit till add	

}

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

		taskEdit.textContent = "Edit Task";
		taskComplete.textContent = "Complete Task";
		taskEntry.innerHTML = task.task_info;

		taskComplete.addEventListener("click", (event) => {
			addEntryToCompleted(task.task_id, task.task_info);
			entryCompleted(task.id);
		});
		taskEdit.addEventListener("click", (event) => {
			entryEdit(task.id);
			document.getElementById("taskbutton").innerText = "Add task";
		})

		taskEntry.appendChild(taskEdit);
		taskEntry.appendChild(taskComplete);
		userTasks.appendChild(taskEntry)
	})
}

/**
 * Loads all completed tasks for a user.
 * @param {*} id 
 */
const getCompletedUserTasks = async (id) => {
	const res = await axios.get(`${BASE_URL}/completed/${id}`);
	task = res.data;
	const userTasks = document.getElementById("completedTasks");
	res.data.data.forEach(task => {
		const hehe = document.createElement("li");
		hehe.innerHTML = task.task_info;
		userTasks.appendChild(hehe)
	})
	console.log(res.data);
}


const createOption = (user) => {
	const option = document.createElement("option");
	option.addEventListener("change", () => {
		getUserTasks(user.id)
	});
	option.innerHTML = user.name;
	option.value = user.id;
	return option;
}

const deleteUserTasks = (id) => {
	const res = axios.delete(`${BASE_URL}/task/${id}`)
}

const deleteUserCompletedTasks = async (id) => {

}

const appendUsers = async  () => {
	const selectUsersElem = document.getElementById("usersDropdown");
	const res = await axios.get(`${BASE_URL}/users`);
	const users = res.data;
	users.data.forEach(user => {
		console.log(user)
		const userOption = createOption(user)
		selectUsersElem.appendChild(userOption);
	});
}

const clearDropdown = () => {
	document.getElementById("usersDropdown").options.length = 0;
	
}

const clearUserTasks = () => {
	document.getElementById("userTasks").innerHTML = "";
	document.getElementById("completedTasks").innerHTML = "";
}

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
		clearUserTasks();
		getUserTasks(userID);
		getCompletedUserTasks(userID);
		document.getElementById("taskform").value = "";
	});
}

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
		clearDropdown();
		appendUsers();
	});
}

const main = async () => {
	const selectUsersElem = document.getElementById("usersDropdown");
	const form = document.getElementById("form");
	const deleteUser = document.getElementById("getUsersButton");
	const optionValue = document.getElementById("usersDropdown").value;
	onAddUser();
	appendUsers();
	onSubmitTask();
	getUserTasks(optionValue);
	getCompletedUserTasks(optionValue);

	selectUsersElem.addEventListener("input", (event) => {
		const optionValue = document.getElementById("usersDropdown").value;
		clearUserTasks();

		getUserTasks(optionValue);
		getCompletedUserTasks(optionValue);
	});

	deleteUser.addEventListener("click", (event) =>  {
		const optionValue = document.getElementById("usersDropdown").value;
		console.log(optionValue);
		axios.delete(`${BASE_URL}/user/${optionValue}`);
		// TRIGGER TO DELETE ALL TASKS
	})
}

main();


