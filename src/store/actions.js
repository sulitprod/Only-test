const addTask = (text) => ({
	type: "ADD_TASK",
	text
});
const removeTask = (id) => ({
	type: "REMOVE_TASK",
	id
});
const completeTask = (id) => ({
	type: "COMPLETE_TASK",
	id
});
const changeTask = (info) => ({
	type: "CHANGE_TASK",
	...info
});

export {
	addTask,
	removeTask,
	completeTask,
	changeTask
}