import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'

import App from './App.jsx'
import AllRecipes from './components/AllRecipes/AllRecipes.jsx'
import SavedRecipes from './components/SavedRecipes/SavedRecipes.jsx'
import User from './components/User/User.jsx'
import recipesReducer from './reducer/recipesReducer.js'
import AddRecipe from './components/AddRecipe/AddRecipe.jsx'
import RecipeDetail from './components/RecipeDetail/RecipeDetail.jsx'
import userReducer from "./reducer/userSlice.js"
import categoriesReducer from './reducer/categoriesReducer.js'
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import MyRecipes from './components/MyRecipes/MyRecipes.jsx'


const store = configureStore({
  reducer: {
    user: userReducer,
    recipes: recipesReducer,
    categories: categoriesReducer
  }
})

const Protected =({children})=>{
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
  if(!isLoggedIn){
    alert("Bitte melden Sie sich an oder erstellen Sie sich ein Konto!")
    return <Navigate to="/users" replace />
  }
  else return children
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <AllRecipes />
      },
      {
        path: "/users",
        element: <User />
      },
      {
        path: "/addRecipe",
        element: (
          <Protected>
            <AddRecipe />
          </Protected>
        )
      },
      {
        path: "/savedRecipes",
        element:(
          <Protected>
            <SavedRecipes />
          </Protected>
        )
      },
      {
        path: "/recipe/:id",
        element: <RecipeDetail/>
      },
      {
        path: "/myRecipes",
        element: (
          <Protected>
            <MyRecipes/>
          </Protected>
        )
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)