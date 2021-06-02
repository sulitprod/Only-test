import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import store from "./store/store";
import { addTask, removeTask, completeTask, changeTask } from "./store/actions";

const Header = styled.header`
	margin-top: 20px;
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: space-between;
`;
const Title = styled.p`
	font-family: Gilroy-Extrabold, serif;	
	line-height: 40px;
	font-size: 28px;
`;
const ButtonTemp = styled.div`
	border-radius: ${p => p.size === "small" ? 4 : 10}px;
	line-height: ${p => p.size === "small" ? 28 : 40}px;
	font-size: 14px;
	padding: 0 14px;
	cursor: pointer;
	transition: .4s background ease;
	text-align: center;
`;
const MainButton = styled(ButtonTemp)`
	background: #23A3FF;
	color: white;
`;
const SubButton = styled(ButtonTemp)`
	background: #F2F2F2;

	&:hover {
		background: #d0d0d0;
	}
`;
const StyledApp = styled.div`
	padding: 40px;
`;
const Content = styled.div`
	margin-top: 40px;
`;
const StyledTask = styled.div`
	display: flex;

	& + & {
		padding-top: 30px;
	}
`;
const Text = styled.p`
	cursor: pointer;
	opacity: ${p => p.completed ? "0.6" : "1"};
	overflow: hidden;
	text-overflow: ellipsis;
`;
const RadioTemp = styled.div`
	width: 20px;
	height: 20px;
	flex-shrink: 0;
	margin-right: 14px;
	cursor: pointer;
	border-radius: 50%;
`;
const Remove = styled(RadioTemp)`
	background: #E85C5C;
	color: white;
	text-align: center;
`;
const AddTask = styled.div`
	position: fixed;
	right: 40px;
	bottom: 40px;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	font-size: 60px;
	line-height: 60px;
	text-align: center;
	box-shadow: 0px 10px 40px 0 rgb(0 0 0 / 10%);
	background: white;
	cursor: pointer;
	color: #23A3FF;
	transition: .4s box-shadow ease;

	&:hover {
		box-shadow: 0px 10px 20px 0 rgb(0 0 0 / 10%);
	}
`;
const Radio = styled(RadioTemp)`
	border: 2px solid #D9D9D9;
	padding: 3px;
	margin-right: 14px;
	transition: .4s border-color ease;

	&:hover {
		border-color: #d0d0d0;
	}
	> div {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		transition: .4s background ease;
		background: ${p => p.completed ? "#23A3FF" : "transparent"};
	}
`;
const AddTaskWindow = styled.div`
	box-shadow: 0px 10px 40px 0 rgb(0 0 0 / 10%);
	position: fixed;
	width: 100%;
	height: calc(100% - 130px);
	top: ${p => p.windowOpen ? "130px" : "100%"};
	left: 0;
	background: white;
	padding: 40px;
	transition: .4s top ease;
	z-index: 2;
	border-radius: 40px 40px 0 0;
`;
const Textarea = styled.textarea`
	font-size: 16px;
	line-height: 18px;
	width: 100%;
	border: 2px solid #D9D9D9;
	border-radius: 10px;
	padding: 14px 20px;
	transition: .4s border-color ease;
	overflow: hidden;
	resize: none;
	height: 50px;

	&:hover {
		border-color: #d0d0d0;
	}
	&:focus {
		border-color: #23A3FF;
	}
`;
const Buttons = styled.div`
	display: flex;
	max-width: 400px;
	margin-top: 30px;

	> div {
		flex-grow: 1;
	}

	> div + div {
		margin-left: 20px;
	}
`;

const App = () => {
	const textarea = useRef(null);
	const [edit, setEdit] = useState(false);
	const [windowOpen, setWindowOpen] = useState(false);
	const [currentTask, setCurrentTask] = useState({
		text: "",
		edit: false
	});
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		store.subscribe(() => {
			const storage = store.getState();
			setTasks(storage.tasks);
		});
	}, []);

	const completeTaskL = (id) => {
		store.dispatch(completeTask(id));
	};
	const addTaskL = () => {
		const { text } = currentTask;

		store.dispatch(addTask(text));
		setCurrentTask({
			...currentTask,
			text: ""
		})
	}
	const removeTaskL = (id) => {
		store.dispatch(removeTask(id));
	};
	const changeTaskL = () => {
		const { id, text } = currentTask;

		store.dispatch(changeTask({ id, text }));
	}

	const closeWindow = async () => {
		setWindowOpen(false);
		await setCurrentTask({
			text: "",
			edit: false
		});
		resize();
	}
	const resize = () => {
		const { current: { style } } = textarea;
		
		style.height = "";

		const { current: { offsetHeight, clientHeight, scrollHeight } } = textarea;
		const update = offsetHeight - clientHeight;

		style.height = `${scrollHeight + update}px`;
	}
	const textAnalyze = ({ target }) => {
		resize();

		const newValue = target.value;

		setCurrentTask({
			...currentTask,
			text: newValue
		})
	}
	const startChange = async (id) => {
		for (const task of tasks) {
			if (task.id === id) {
				await setCurrentTask({
					id,
					text: task.text,
					edit: true
				});
				setWindowOpen(true);
				resize();
				break;
			}
		}
	}

	return (
		<StyledApp>
			<Header>
				<Title>Сегодня</Title>
				{tasks.length ? <SubButton size="small" onClick={() => setEdit(!edit)}>{edit ? "Отменить" : "Править"}</SubButton> : ""}
			</Header>
			<Content>
				{tasks.length ? tasks.map(({ id, completed, text }) => (
					<Task {...{ key: id, completed, id, text, edit, startChange, onClick: () => edit ? removeTaskL(id) : completeTaskL(id) }} />
				)) : "Список задач пуст"}
			</Content>
			<AddTaskWindow {...{ windowOpen }}>
				<Textarea ref={textarea} onChange={textAnalyze} placeholder="Введите текст задачи" value={currentTask.text}></Textarea>
				<Buttons>
					<SubButton onClick={closeWindow}>Закрыть</SubButton>
					{ currentTask.edit ? 
					<MainButton onClick={changeTaskL}>Сохранить</MainButton> :
					<MainButton onClick={addTaskL}>Добавить</MainButton>
					}
				</Buttons>
			</AddTaskWindow>
			{ windowOpen || edit ? 
			"" :
			<AddTask onClick={() => setWindowOpen(true)}>+</AddTask>
			}
		</StyledApp>
	);
}

const Task = ({ completed, text, onClick, edit, id, startChange }) => (
	<StyledTask>
		{ edit ?
		<Remove {...{ onClick }}>-</Remove> :
		<Radio {...{ completed, onClick }}><div /></Radio>
		}
		<Text {...{ completed, onClick: edit ? () => startChange(id) : onClick }}>{text}</Text>
	</StyledTask>
);

export default App;
