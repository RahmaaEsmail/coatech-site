import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiInstance";
import { userApis } from "../api/userEndpoints";

const initialState= {
    data:[],
    isLoading: false,
    error : null,
}

export const handleCheckEmail = createAsyncThunk("authSlice/handleCheckEmail",async({body}) => {
  const response = await fetchData({url : userApis.routes.checkEmail, body , method : "POST"});
  return response ;
})

export const authSlice = createSlice({
    name:"authSlice",
    initialState,
    extraReducers:(builder) => {
        builder
        .addCase(handleCheckEmail.pending , (state, action) => {
            state.isLoading = true,
            state.error = null
        })
        .addCase(handleCheckEmail.fulfilled , (state, action) => {
            state.data = action.payload ,
            state.isLoading= false
        })
        .addCase(handleCheckEmail.rejected , (state, action) => {
            state.error= action.payload,
            state.isLoading =false
        })
    }
})

export default authSlice.reducer;