import "./SavedRecipes.css"
import useRecipes from "../../hooks/useRecipes"
import Recipes from "../Recipes/Recipes"


const SavedRecipes=()=>{
    const{recipes, savedRecipes, onSavedChange} = useRecipes(true);
    
    const Items = recipes.map(recipe => (
        <Recipes
            key={recipe._id}
            recipe={recipe}
            isSaved={savedRecipes.includes(recipe._id)}
            onSavedChange={onSavedChange}
        />
    ))

    return(
        <div className="SavedRecipes">
            <h1 className="SavedRecipes__Title">Gemerkte Rezepte</h1>
            <div className="SavedRecipes__Grid">
                {Items}
            </div>
        </div>
        
    )
}

export default SavedRecipes;