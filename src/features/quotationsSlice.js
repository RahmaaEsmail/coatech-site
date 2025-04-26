import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiInstance";
import { userApis } from "../api/userEndpoints";

const initialState = {
    quotations : [],
    isLoading : false,
    error:null,
}

export const handleCreateQuote = createAsyncThunk("qoutationSlice/handleCreateQuote",async({body}) => {
  const response = await fetchData({url : userApis?.routes?.createQuotation, body , method : "POST"});
  return response;
})

export const qoutationSlice = createSlice({
  name:'qoutationSlice',
  initialState,
  extraReducers : (builder) => {
    builder
    .addCase(handleCreateQuote.pending ,(state,action) => {
        state.isLoading = true,
        state.error = null
    })
    .addCase(handleCreateQuote.fulfilled ,(state, action) => {
        state.quotations = action.payload ,
        state.isLoading = false
    })
    .addCase(handleCreateQuote.rejected ,(state,action) => {
        state.isLoading = false,
        state.error = action.payload
    })
  }
})

export default qoutationSlice.reducer;