import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecommendedBooksState } from "./RecommendedBooks.types";

const initialState: RecommendedBooksState = {
  // define initial state
};

const RecommendedBooksSlice = createSlice({
  name: "recommendedbooks",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any>) => {
      // update state logic
    }
  }
});

export const { setData } = RecommendedBooksSlice.actions;
export default RecommendedBooksSlice.reducer;
