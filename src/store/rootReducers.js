import { combineReducers } from "@reduxjs/toolkit";
import productsReducer from '../features/productsSlice';
import colorsReducer from '../features/colorSlice';
import authReducer from '../features/authSlice';
import quotationsReducer from '../features/quotationsSlice';

export const rootReducers = combineReducers({
    products : productsReducer,
    colors :  colorsReducer,
    auth:  authReducer,
    quotations :quotationsReducer
})