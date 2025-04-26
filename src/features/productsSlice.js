import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiInstance";
import { userApis } from "../api/userEndpoints";

const initialState =  {
    products : [],
    productLoading : false,
    productError : null
}

export const handleFetchProducts = createAsyncThunk("productsSlice/handleFetchProducts",async() => {
    const response = await fetchData({url :userApis.routes.fetchProducts});
    return response;
})

export const productsSlice = createSlice({
    name:"productsSlice",
    initialState ,
    extraReducers:(builder) => {
        builder
        .addCase(handleFetchProducts.pending , (state, action) => {
            state.productLoading = true,
            state.productError = null
        })
        .addCase(handleFetchProducts.fulfilled , (state, action) => {
            state.products = action.payload,
            state.productLoading = false
        })
        .addCase(handleFetchProducts.rejected ,(state,action) => {
            state.productError = action.payload,
            state.productLoading = false
        })
    }
})

export default productsSlice.reducer;