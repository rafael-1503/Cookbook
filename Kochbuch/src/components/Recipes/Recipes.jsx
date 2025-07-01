import { Navigate, useNavigate } from "react-router-dom";
import "./Recipes.css"
import { Heart, HeartOff } from "lucide-react"

const Recipes = ({recipe, isSaved, onSavedChange}) => {
const navigate = useNavigate();

    return(
        <div className="Recipes__Wrapper">
            <div key={recipe._id} className="Recipes__Item" onClick={()=>navigate(`/recipe/${recipe._id}`)}>
                <div className="Recipes__Item__Image">
                    <img src={recipe.href} alt={recipe.name} />
                </div>
                <div className="Recipes__Item__Footer">
                    <div className="Recipes__Item__Title">{recipe.name}</div>
                    <button className="Recipes__Item__Saved" onClick={(e) => {
                        e.stopPropagation();
                        onSavedChange(recipe._id)}
                    }>  
                        {isSaved ? <Heart fill="red"/> : <Heart/>}
                    </button>
                </div>
            </div>
        </div>
    )
};

export default Recipes;