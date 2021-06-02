const reducer = (state, action) => {
	const { tasks } = state;
	const { type, text, id } = action;
	let newTasks;

	switch(type) {
		case "ADD_TASK":
				newTasks = tasks.slice(0);
				newTasks.push({
					id: tasks.length,
					text,
					completed: false
				});
				state.tasks = newTasks;

				return state;
		case "REMOVE_TASK":
				newTasks = [];
				for (const task of tasks)
					if (task.id !== id) newTasks.push(task);
				state.tasks = newTasks;

				return state;
		case "COMPLETE_TASK": 
				newTasks = tasks.slice(0);
				for (const task of newTasks) {
					if (task.id === id) {
						task.completed = !task.completed;
						break;
					}
				}
				state.tasks = newTasks;

				return state;
		case "CHANGE_TASK": 
				newTasks = tasks.slice(0);
				for (const task of newTasks) {
					if (task.id === id) {
						task.text = text;
						break;
					}
				}
				state.tasks = newTasks;
				
				return state;
		default: return state;
	}
}

export default reducer;