const { configureStore } = require("@reduxjs/toolkit");
import todosReducer from "./slices/slice";
import newsReducer from "./features/newsSlice";
import galleryReducer from "./features/gallerySlice"

const store = configureStore({
  reducer: {
    todos: todosReducer,
    news: newsReducer,
    gallery: galleryReducer
  },
});

export default store;
