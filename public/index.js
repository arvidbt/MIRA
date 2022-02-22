const BASE_URL = "http://localhost:8000/api"

const test = async () => {
	console.log("runs this shit");
	const res = await axios.get("http://localhost:8000/api/users");
	console.log(res.data);
}

const userButton = document.getElementById("getUsersButton");
userButton.addEventListener("click", test);

const getUserTasks = async (id) => {
	const res = await axios.get(`${BASE_URL}/tasks`);
	const userTasks = document.getElementById("userTasks");

	task = res.data;

	res.data.data.forEach(task => {
		const hehe = document.createElement("li");
		hehe.innerHTML = task.task_info;
		userTasks.appendChild(hehe)
	})
	console.log(res.data);
	console.log(`GETTING TASKS FOR USER: ${id}`);
}

const getCompletedUserTasks = async (id) => {
	const res = await axios.get(`${BASE_URL}/completed`); // Lägg till /id när det funkar i REST API:et

	task = res.data;
	const userTasks = document.getElementById("completedTasks");
	res.data.data.forEach(task => {
		const hehe = document.createElement("li");
		hehe.innerHTML = task.task_info;
		userTasks.appendChild(hehe)
	})
	console.log(res.data);
	console.log(`GETTING TASKS FOR USER: ${id}`);
}

const createOption = (user) => {
	const option = document.createElement("option");
	option.addEventListener("change", () => getUserTasks(user.id));
	option.innerHTML = user.name;
	option.value = user.id;
	return option;
}


const main = async () => {
	const selectUsersElem = document.getElementById("usersDropdown");

	const res = await axios.get(`${BASE_URL}/users`);
	const users = res.data;
	console.log(users);
	users.data.forEach(user => {
		const userOption = createOption(user)
		selectUsersElem.appendChild(userOption);
	});
	selectUsersElem.addEventListener("input", (event) => {
		const optionValue = document.getElementById("usersDropdown").value;
		document.getElementById("userTasks").innerHTML = "";
		document.getElementById("completedTasks").innerHTML = "";

		getUserTasks(optionValue);
		getCompletedUserTasks(optionValue);
	})

}

main();


