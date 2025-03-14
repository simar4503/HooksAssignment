import React, { useReducer, useEffect, useContext, useRef, useMemo, useCallback } from "react";
import "../styles/TaskManagerStyles.css";
import { ThemeContext } from "../context/ThemeContext";

// Define actions
const ACTIONS = {
  ADD_TASK: "add-task",
  DELETE_TASK: "delete-task",
  TOGGLE_TASK: "toggle-task",
  LOAD_TASKS: "load-tasks",
};

// Reducer function
const taskReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_TASKS:
      return action.payload;
    case ACTIONS.ADD_TASK:
      return [...state, action.payload];
    case ACTIONS.DELETE_TASK:
      return state.filter((task) => task.id !== action.payload);
    case ACTIONS.TOGGLE_TASK:
      return state.map((task) =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
    default:
      return state;
  }
};

const TaskManager = () => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");

  // Create a ref for the title input
  const titleInputRef = useRef(null);

  // Access the theme context
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    dispatch({ type: ACTIONS.LOAD_TASKS, payload: savedTasks });

    // Auto-focus on title input when component mounts
    titleInputRef.current.focus();
  }, []);

  // Autosave tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      alert("Task list updated and saved!");
    }
  }, [tasks]);

  // useCallback to prevent re-creation of functions on each render
  const addTask = useCallback(() => {
    if (!title.trim() || !description.trim()) return;

    const newTask = {
      id: Date.now(),
      title,
      description,
      completed: false,
    };

    dispatch({ type: ACTIONS.ADD_TASK, payload: newTask });
    setTitle("");
    setDescription("");

    // Re-focus on title input after adding a task
    titleInputRef.current.focus();
  }, [title, description]);

  const deleteTask = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_TASK, payload: id });
  }, []);

  const toggleTaskCompletion = useCallback((id) => {
    dispatch({ type: ACTIONS.TOGGLE_TASK, payload: id });
  }, []);

  // Memoized filtered tasks to optimize performance
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filterStatus === "completed") return task.completed;
      if (filterStatus === "incomplete") return !task.completed;
      return true;
    });
  }, [tasks, filterStatus]);

  return (
    <div className={`task-manager ${isDarkMode ? "dark" : "light"}`}>
      <h2>Task Manager</h2>
      <div className="task-input">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          ref={titleInputRef}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
        <button onClick={toggleTheme}>
          Toggle {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="task-filters">
        <button onClick={() => setFilterStatus("all")}>All</button>
        <button onClick={() => setFilterStatus("completed")}>Completed</button>
        <button onClick={() => setFilterStatus("incomplete")}>Incomplete</button>
      </div>

      <div className="task-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-item">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <button onClick={() => toggleTaskCompletion(task.id)}>
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
