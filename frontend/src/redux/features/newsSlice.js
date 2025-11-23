import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  date: "",
  content: "",
  image: null,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setContent: (state, action) => {
      state.content = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    resetNews: () => initialState,
  },
});

export const { setTitle, setDate, setContent, setImage, resetNews } =
  newsSlice.actions;
export default newsSlice.reducer;
