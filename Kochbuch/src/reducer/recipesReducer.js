import { createAction, createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../axiosURL"

// Rezepte vom Server laden
export const loadRecipes = createAsyncThunk("cookbook/loadRecipes", async () => {
    const res = await axios.get("cookbook/recipes", {withCredentials:true})
    return res.data
})

// Ein Rezept löschen
export const deleteRecipes = createAsyncThunk("cookbook/deleteRecipe", async (recipeID) => {
  try {
    await axios.delete("cookbook/delete/" + recipeID, { withCredentials: true });
    return recipeID;
  } catch (err) {
    console.error("Fehler beim Löschen des Rezepts:", err);
  }
});

const initState = {
    recipes: []
}

const recipesReducer = createReducer(initState, (builder) => {
    builder
        .addCase(loadRecipes.fulfilled, (state, action) => {
            state.recipes = action.payload
        })
        .addCase(deleteRecipes.fulfilled, (state, action) => {
            state.recipes = state.recipes.filter(recipe => recipe._id !== action.payload)
        })
})

export default recipesReducer;