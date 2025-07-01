import "./MyRecipes.css"
import { useEffect, useState } from "react";
import axios from "../../axiosURL";
import Recipes from "../Recipes/Recipes";
import useRecipes from "../../hooks/useRecipes";

const MyRecipes = () => {
    const [myRecipes, setMyRecipes] = useState([]);
    const {savedRecipes, onSavedChange} = useRecipes();

    useEffect(() => {
        axios.get("cookbook/user/recipe", {withCredentials: true}
        ).then(res => setMyRecipes(res.data)
            ).catch(err => console.error("Fehler beim Laden: ", err))
    }, [])

    const Items = myRecipes.map(recipe => (
        <Recipes
            key={recipe._id}
            recipe={recipe}
            isSaved={savedRecipes.includes(recipe._id)}
            onSavedChange={onSavedChange}
        />
    ))

    return(
        <div className="MyRecipes">
            <h1 className="MyRecipes__Title">Meine Rezepte</h1>
            <div className="MyRecipes__Grid">
                {Items}
            </div>
        </div>
    )
}

export default MyRecipes;