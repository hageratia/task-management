import { configureStore, createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: { items: [] },
  reducers: {
    setTasks: (state, action) => {
      state.items = action.payload;
    },
    addTask: (state, action) => {
      state.items.push(action.payload);
    },
    removeTask: (state, action) => {
      state.items = state.items.filter((task) => task.id !== action.payload);
    },
    toggleComplete: (state, action) => {
      const task = state.items.find((task) => task.id === action.payload);
      if (task) task.completed = !task.completed;
    },
    editTask: (state, action) => {
      const { id, newTitle } = action.payload;
      const task = state.items.find((task) => task.id === id);
      if (task) task.title = newTitle;
    },
  },
});

export const { setTasks, addTask, removeTask, toggleComplete, editTask } =
  tasksSlice.actions;

const store = configureStore({ reducer: { tasks: tasksSlice.reducer } });

export default store;
