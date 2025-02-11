import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTasks,
  addTask,
  removeTask,
  toggleComplete,
  editTask,
} from "../store/taskStore";
import "../index.css";
import { FaEdit, FaTrash, FaCheck, FaMoon, FaSun } from "react-icons/fa";
import { MdSave } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const dispatch = useDispatch();
  const { items: tasks } = useSelector((state) => state.tasks);
  const [newTask, setNewTask] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      dispatch(setTasks(JSON.parse(savedTasks)));
    } else {
      fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
        .then((res) => res.json())
        .then((data) => {
          dispatch(setTasks(data));
          localStorage.setItem("tasks", JSON.stringify(data));
        });
    }
  }, [dispatch]);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTaskObj = { id: Date.now(), title: newTask, completed: false };
      dispatch(addTask(newTaskObj));
      setNewTask("");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900"
      } p-5`}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`${
          darkMode ? "bg-gray-800" : "bg-pink-100"
        } rounded-xl shadow-md p-5 w-full max-w-md`}
      >
        {/* زر الوضع الليلي */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">📋 TODO</h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-300 text-gray-800 p-2 rounded-lg hover:bg-gray-400"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </motion.button>
        </div>

        {/* إدخال مهمة جديدة */}
        <div className="flex items-center gap-2 mb-4">
          <input
            className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter TODO"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-500"
            onClick={handleAddTask}
          >
            Add TODO
          </motion.button>
        </div>

        {/* الفلترة */}
        <div className="flex justify-between mb-4">
          {["all", "completed", "incomplete"].map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className={`px-3 py-1 rounded-lg ${
                filter === type ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
              onClick={() => setFilter(type)}
            >
              {type === "all"
                ? "All Tasks"
                : type === "completed"
                ? "Tasks Completed"
                : "Tasks Not Completed"}
            </motion.button>
          ))}
        </div>

        <ul className="space-y-2">
          <AnimatePresence>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    task.completed
                      ? "bg-gray-500 line-through text-gray-300"
                      : "bg-gray-300"
                  }`}
                >
                  {editMode === task.id ? (
                    <input
                      className="p-1 border border-gray-300 rounded-lg text-gray-700"
                      type="text"
                      value={editedTask}
                      onChange={(e) => setEditedTask(e.target.value)}
                    />
                  ) : (
                    <span className="flex items-center gap-2">
                      {task.completed ? "✅" : "📌"} {task.title}
                    </span>
                  )}

                  <div className="flex gap-2">
                    {editMode === task.id ? (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                        onClick={() => {
                          dispatch(
                            editTask({ id: task.id, newTitle: editedTask })
                          );
                          setEditMode(null);
                        }}
                      >
                        <MdSave />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600"
                        onClick={() => {
                          setEditMode(task.id);
                          setEditedTask(task.title);
                        }}
                      >
                        <FaEdit />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600"
                      onClick={() => dispatch(toggleComplete(task.id))}
                    >
                      <FaCheck />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                      onClick={() => dispatch(removeTask(task.id))}
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </motion.li>
              ))
            ) : (
              <p className="text-gray-500 text-center">No Tasks Available</p>
            )}
          </AnimatePresence>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
