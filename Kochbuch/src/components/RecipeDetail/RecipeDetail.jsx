import "./RecipeDetail.css"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../axiosURL"
import { Clock4 } from "lucide-react";
import { loadCategories } from "../../reducer/categoriesReducer";
import { useDispatch, useSelector } from "react-redux";
import useRecipes from "../../hooks/useRecipes";
import {Heart, Trash2} from "lucide-react"
import { Navigate, useNavigate } from "react-router-dom";
import Comments from "../Comments/Comments";
import { AverageRating } from "../Comments/Comments";
import { deleteRecipes } from "../../reducer/recipesReducer";

const RecipeDetail =()=>{

    const dispatch = useDispatch()
    const {id} = useParams()
    const [recipe, setRecipe] = useState(null)
    const [portionAmount, setPortionAmount] = useState([])
    const [inputPortion, setInputPortion] = useState("");
    const allCategories = useSelector(state => state.categories?.categories || [])
    const userId = useSelector(state => state.user.userId);
    const navigate = useNavigate();
    const { savedRecipes, onSavedChange} = useRecipes();

    

    const loadRecipe = () => {
        axios.get(`cookbook/recipe/${id}`, {withCredentials:true})
        .then(res=>setRecipe(res.data))
        .catch(err=>{
            console.log(err)
        })
    }
    
    useEffect(()=>{
        loadRecipe();
    }, [id]);

    useEffect(()=>{
        dispatch(loadCategories())
    });

    if(!recipe){
        return <p>Lade Rezept...</p>
    };

    const isSaved = savedRecipes.includes(recipe._id);

    const categories = allCategories.filter(r => recipe.categories.includes(r._id))
    
    const calculatePortion = (p) => {
        const factor = p / recipe.portion

        const newAmount = recipe.ingredients.map(ingredient => ({
            ...ingredient,
            amount: (ingredient.amount * factor).toFixed(2)
        }));
        setPortionAmount(newAmount)
    };

   
    return(
        <div className="RecipeDetail">
            <div className="RecipeDetail__Header">
                <img src={recipe.href} alt={recipe.name}/>
                <div className="RecipeDetail__Header__TitleRow">
                    <div className="RecipeDetail__Header__TitleRow__Rating">
                        <AverageRating ratings={recipe.rating}/>
                    </div>
                    <h1 className="RecipeDetail__Header__TitleRow__TitleText">{recipe.name}</h1>
                    <div className="RecipeDetail__Header__TitleRow__Buttons">
                        <button className="RecipeDetail__Header__TitleRow__Button__Red" onClick={(e) => {
                            e.stopPropagation();
                            onSavedChange(recipe._id)}
                        }>  
                            {isSaved ? <Heart fill="red" size={35}/> : <Heart size={35}/>}
                        </button>
                        {recipe.user === userId && (
                            <button className="RecipeDetail__Header__TitleRow__Button" onClick={async ()  => {
                            const confirmed = window.confirm("Sind Sie sicher, dass Sie dieses Rezept löschen möchten?");
                            if(confirmed){
                                const action = await dispatch(deleteRecipes(recipe._id));
                                console.log("Delete Action:", action);
                                if(action.meta.requestStatus === "fulfilled"){
                                    navigate(`/`)}
                                }
                            }
                            }>  
                            <Trash2 size={35}/>
                        </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="RecipeDetail__Content">
                <div className="RecipeDetail__Content__Section">
                    <div className="RecipeDetail__Content__Section__Title">
                        <h3>Zutaten für</h3>
                        <input name="p" type="Number" placeholder={recipe.portion} onChange={(e)=> {
                            const value = e.target.value;
                            setInputPortion(value);
                            calculatePortion(value);
                        }}/>
                        <h3>Portionen</h3>
                    </div>
                    <div className="RecipeDetail__Content__Section__Content">
                        {recipe.ingredients.map((ingredient, index) => (
                            <div className="RecipeDetail__Content__Section__Content__Table__Row" key={index}>
                                
                                    <span className="RecipeDetail__Content__Section__Content__Table__Column1">{inputPortion ? portionAmount[index]?.amount : ingredient.amount} {ingredient.unit}</span>
                                    <span className="RecipeDetail__Content__Section__Content__Table__Column2">{ingredient.ingredient}</span>
                                
                            </div>
                        ))}
                    </div>
                </div>
                <div className="RecipeDetail__Content__Section">
                    <div className="RecipeDetail__Content__Section__Title">
                        <h3>Zubereitung</h3>
                    </div>
                    <div className="RecipeDetail__Content__Section__Content">
                        <p className="RecipeDetail__Content__Section__Content__Time"><Clock4 size={16} className="RecipeDetail__Content__Directions__Clock"/> {recipe.time} Min.</p> 
                        <p className="RecipeDetail__Content__Section__Content__Text">{recipe.directions}</p>
                        {categories.map((category, index) => (
                            <div className="RecipeDetail__Content__Section__Content__Categories">
                                <p>{category.name}</p>
                            </div>
                    ))}
                    </div>
                </div>
                <div className="RecipeDetail__Content__Section">
                    <div className="RecipeDetail__Content__Section__Title">
                        <h3>Nährwertangaben</h3>
                    </div>
                    <div className="RecipeDetail__Content__Section__Content">
                        <div className="RecipeDetail__Content__Section__Content__Table__Row">
                            <span className="RecipeDetail__Content__Section__Content__Table__Column1">Kalorien</span>
                            <span className="RecipeDetail__Content__Section__Content__Table__Column2">{recipe.nutritionalValues[0].kcal} kcal</span>
                        </div>
                        <div className="RecipeDetail__Content__Section__Content__Table__Row">
                            <span className="RecipeDetail__Content__Section__Content__Table__Column1">Kohlenhydrate</span>
                            <span className="RecipeDetail__Content__Section__Content__Table__Column2">{recipe.nutritionalValues[0].carbohydrates} g</span>
                        </div>
                        <div className="RecipeDetail__Content__Section__Content__Table__Row">
                            <span className="RecipeDetail__Content__Section__Content__Table__Column1">Eiweiß</span>
                            <span className="RecipeDetail__Content__Section__Content__Table__Column2">{recipe.nutritionalValues[0].protein} g</span>
                        </div>
                        <div className="RecipeDetail__Content__Section__Content__Table__Row">
                            <span className="RecipeDetail__Content__Section__Content__Table__Column1">Fette</span>
                            <span className="RecipeDetail__Content__Section__Content__Table__Column2">{recipe.nutritionalValues[0].fat} g</span>
                        </div>
                    </div>
                </div>
                <div className="RecipeDetail__Content__Section">
                    <div className="RecipeDetail__Content__Section__Title">
                        <h3>Kommentare</h3>
                    </div>
                    <div className="RecipeDetail__Content__Section__Content">
                        <Comments recipe={recipe} loadRecipe={loadRecipe}/>
                    </div>
                </div>
            </div>
        </div>
    )
    

    

}
    

export default RecipeDetail;