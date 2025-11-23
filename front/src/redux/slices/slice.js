const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  todos: [],
};

const slice = createSlice({
  name: "todosSlice",
  initialState,
  reducers: {
    addTodo: () => {},
    removeTodo: () => {},
  },
});

export const { addTodo, removeTodo } = slice.actions;
export default slice.reducer;
