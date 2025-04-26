import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiInstance";
import { userApis } from "../api/userEndpoints";

const initialState = {
  colors: [],
  colorsLoading: false,
  colorsError: null,
};

export const handleFetchColors = createAsyncThunk(
  "colorsSlice/handleFetchColors",
  async () => {
    const response = await fetchData({ url: userApis.routes.fetchColors });
    return response;
  }
);

export const colorsSlice = createSlice({
  name: "colorsSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(handleFetchColors.pending, (state, action) => {
        (state.colorsLoading = true), (state.colorsError = null);
      })
      .addCase(handleFetchColors.fulfilled, (state, action) => {
        (state.colors = action.payload), (state.colorsLoading = false);
      })
      .addCase(handleFetchColors.rejected, (state, action) => {
        (state.colorsError = action.payload), (state.colorsLoading = false);
      });
  },
});

export default colorsSlice.reducer;
