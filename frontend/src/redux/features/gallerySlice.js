import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  date: "",
  image: [],
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    resetGallery: () => initialState,
  },
});

export const { setTitle, setDate, setImage, resetGallery } =
  gallerySlice.actions;
export default gallerySlice.reducer;
