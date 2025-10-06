import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookSearchState } from "./BookSearch.types";

const initialState: BookSearchState = {
  // define initial state
};

const BookSearchSlice = createSlice({
  name: "booksearch",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any>) => {
      // update state logic
    }
  }
});

export const { setData } = BookSearchSlice.actions;
export default BookSearchSlice.reducer;
