import { createAction, createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../axiosURL"

// Kategorien vom Server laden
export const loadCategories = createAsyncThunk("cookbook/loadCategories", async () => {
    const res = await axios.get("cookbook/categories", {withCredentials:true})
    return res.data
})

const initState = {
    categories: []
}


const categoriesReducer = createReducer(initState, (builder) => {
    builder
        .addCase(loadCategories.fulfilled, (state, action) => {
            state.categories = action.payload
        })
})

export default categoriesReducer;