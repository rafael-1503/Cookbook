import { useState, useEffect } from "react"
import { useDispatch, useSelector,} from "react-redux"
import { loadRecipes, deleteRecipes } from "../reducer/recipesReducer"
import axios from "../axiosURL"


const useRecipes=(onlySaved = false)=>{
    const dispatch = useDispatch()
    const allRecipes = useSelector(state => state.recipes?.recipes || [])
    const [savedRecipes, setSavedRecipes] = useState([])
    const userId = useSelector((state) => state.user.userId);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    useEffect(()=>{
        dispatch(loadRecipes())

        if(!isLoggedIn){
            setSavedRecipes([]);
            return;
        }

        axios.get("cookbook/saved/", {withCredentials:true}).then(res=>{
            const savedIDs = res.data.savedRecipes.map((r)=>r._id)
            setSavedRecipes(savedIDs)
        }).catch(err=>{
            console.log(err)
        })
    }, [dispatch, isLoggedIn, userId])

    const onSavedChange = (id) =>{
        if(!isLoggedIn){
            alert("Bitte anmelden, um Rezept zu merken!")
            return;
        }

        const isSaved = savedRecipes.includes(id)
        const url = isSaved ? "cookbook/save/delete/recipe" : "cookbook/save/recipe"

        axios.put(url, {recipe: id}, {withCredentials:true}).then((res)=>{
            console.log("Marked state updated:", res.data)
            setSavedRecipes(prev=>
                isSaved ? prev.filter(rid=>rid!==id)    //entfernen
                : [...prev, id]                         //hinzufügen
            )                        
        }).catch(err=>{
            console.log(err)
        })        
    }

    const recipes = onlySaved 
        ? allRecipes.filter(r => savedRecipes.includes(r._id))
        : allRecipes

    return { recipes, savedRecipes, onSavedChange }
};

export default useRecipes;