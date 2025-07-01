import "./AddRecipe.css"
import { useState, useEffect } from "react"
import axios from "../../axiosURL"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";


const AddRecipe =()=>{

    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const userId = useSelector(state => state.user.userId);
    const [recipeData, setRecipeData] = useState({
        name: "",
        ingredients: [{ingredient: "", amount: "", unit:""}],
        portion: "",
        nutritionalValues: [{kcal: "", protein: "", fat: "", carbohydrates: ""}],
        directions: "",
        href: "",
        time: "",
        categories: "",
        tags: [""],
        user: userId
    });
    const [allCategories, setAllCategories] = useState([])
    const [newCategory, setNewCategory] = useState("");
    const navigate = useNavigate();

    const onRecipeDataChange = (e) => {
        setRecipeData({...recipeData, [e.target.name]: e.target.value,})
    };

    
    const onIngredientChange = (index, field, value) => {
        const newIngredients = [...recipeData.ingredients]
        newIngredients[index][field] = value
        setRecipeData({...recipeData, ingredients: newIngredients})
    };

    const addIngredientField = () => {
        setRecipeData({
            ...recipeData,
            ingredients: [...recipeData.ingredients, {ingredient: "", amount: "", unit: ""}]
        })
    };

    const removeIngredientField = (index) => {
        const newIngredients = recipeData.ingredients.filter((v, i) => i !== index)
        setRecipeData({
            ...recipeData,
            ingredients: newIngredients
        })
    };

    useEffect(()=>{
        getAllCategories();
    },[])

    const getAllCategories =()=>{
        axios.get("cookbook/categories",{withCredentials:true}).then((res)=>{
            setAllCategories(res.data)
            if(res.data.length > 0) {
                setRecipeData((prev) => ({...prev, categories: [res.data[0]._id]}))    
            }
        }).catch(err=>{
            console.log(err)
        })
    };

    const onNewCategoryChange =(e)=>{
        setNewCategory(e.target.value);
    };

    const updateNutritionalValue = (field, value) => {
        const newValues = { ...recipeData.nutritionalValues[0], [field]: value };
        setRecipeData({
            ...recipeData,
            nutritionalValues: [newValues]
    });
};

    const onSave =()=>{
        if(!isLoggedIn){
            alert("Bitte anmelden um Rezepte hinzuzufügen");
            return;
        }
        let recipeObj={
            ...recipeData,
            time: parseInt(recipeData.time),
            portion: parseInt(recipeData.portion),
            tags: [...recipeData.tags, recipeData.name.toLowerCase()]
        }

        axios.post("cookbook/recipe/", recipeObj, {withCredentials:true})
            .then((res)=>{
            if (res.status === 201 && res.data === "successfully added!") {
                navigate("/");
            } else {
                alert("Rezept wurde nicht erfolgreich gespeichert.");
            }
        }).catch(err=>{
            console.log(err)
            alert("Rezept wurde nicht gespeichert. \nFehler: " + err.response.data);
        })
    };

    const onSaveCategory=()=>{
        if(!isLoggedIn){
            alert("Bitte anmelden um Kategorien hinzuzufügen")
        }
        axios.post("cookbook/category/", {name:newCategory}, {withCredentials:true}).then((res)=>{
            getAllCategories();
        }).catch(err=>{
            console.log(err);
        })
    };

    const ingredients = recipeData.ingredients.map((ingredient, index) => (
        <div key={index} className="AddRecipe__Inputs__Ingredients__Row">
            <input
                type="Number"
                className="AddRecipe__Inputs__Ingredients__Row__Amount"
                value={recipeData.ingredients[index].amount}
                onChange={(e) =>
                    onIngredientChange(index, "amount", e.target.value)
                }
                placeholder="Menge"
            />
            <select
                className="AddRecipe__Inputs__Ingredients__Row__Unit"
                value={recipeData.ingredients[index].unit}
                onChange={(e) => onIngredientChange(index, "unit", e.target.value)}
            >
                <option value="">Einheit</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="TL">TL</option>
                <option value="EL">EL</option>
                <option value="Stück">Stück</option>
                <option value="Prise">Prise</option>
                <option value="Dose">Dose</option>
            </select>
            <input
                type="text"
                className="AddRecipe__Inputs__Ingredients__Row__Name"
                value={recipeData.ingredients[index].ingredient}
                onChange={(e) =>
                    onIngredientChange(index, "ingredient", e.target.value)
                }
                placeholder={`Zutat ${index + 1}`}
            />
            <button className="AddRecipe__Button" onClick={() => removeIngredientField(index)}>
                Entfernen
            </button>
        </div>
    ))

    const categories = allCategories.map((v)=>{
        return(
            <option key={v._id} value={v._id}>{v.name}</option>
        )
    })

    const tags = recipeData.tags.map((tag, index) => (
        <div key={index} className="AddRecipe__Inputs__Tags__Row">
            <input
                type="Text"
                value={recipeData.tags[index]}
                onChange={(e) => (
                    onTagChange(index, e.target.value)
                )}
                placeholder={`Tag ${index + 1}`}
            />
            <button className="AddRecipe__Button" onClick={() => removeTagField(index)}>
                Entfernen
            </button>
        </div>
    ))

    const removeTagField = (index) => {
        const newTags = recipeData.tags.filter((v, i) => i !== index)
        setRecipeData({
            ...recipeData,
            tags: newTags
        })
    };

    const onTagChange = (index, value) => {
        const newTags = [...recipeData.tags]
        newTags[index] = value
        setRecipeData({...recipeData, tags: newTags})
    };

    const addTagField = () => {
        setRecipeData({
            ...recipeData,
            tags: [...recipeData.tags, ""]
        })
    };

    return(
        <div className="AddRecipe">
            <div className="AddRecipe__Title">
                <h1>Neues Rezept hinzufügen</h1>
            </div>
            <div className="AddRecipe__Inputs">
                <div className="AddRecipe__Inputs__Name">
                    <h3>Name</h3>
                    <input name="name" type="Text" value={recipeData.name} placeholder="Name für das Rezept" onChange={(onRecipeDataChange)}></input>
                </div>
                <div className="AddRecipe__Inputs__Href">
                    <h3>Titelbild</h3>
                    <input name="href" type="Text" value={recipeData.href} placeholder="Link zum Titelbild" onChange={(onRecipeDataChange)}></input>
                </div>
                <div className="AddRecipe__Inputs__Ingredients">
                    <h3>Zutaten</h3>
                    {ingredients}
                    <button className="AddRecipe__Button" onClick={addIngredientField}>
                        + Zutat hinzufügen
                    </button>
                </div>
                <div className="AddRecipe__Inputs__Portion">
                    <h3>Portionen</h3>
                    <input name="portion" type="Number" value={recipeData.portion} placeholder="Für wie viele Portionen" onChange={(onRecipeDataChange)}></input>
                </div>
                <div className="AddRecipe__Inputs__NutritionalValues">
                    
                </div>
                <div className="AddRecipe__Inputs__Directions">
                    <h3>Beschreibung</h3>
                    <textarea name="directions" value={recipeData.directions} placeholder="Wie wird das Rezept zubereitet" onChange={onRecipeDataChange} rows={5} cols={70}></textarea>
                </div>
                <div className="AddRecipe__Inputs__Time">
                    <h3>Zeit in Minuten</h3>
                    <input name="time" type="Number" value={recipeData.time} placeholder="z.B. 30" onChange={(onRecipeDataChange)}></input>
                </div>
                <div className="AddRecipe__Inputs__Categories">
                    <div className="AddRecipe__Inputs__Categories_SelectCategory">
                        <h3>Kategorie</h3>
                    <select value={recipeData.categories} onChange={(e)=>{
                        setRecipeData({...recipeData, categories: [e.target.value]})
                    }} >
                        {categories}
                    </select>
                    </div>
                    <div className="AddRecipe__Inputs__Categories_AddCategory">
                        <h3>Neue Kategorie hinzufügen</h3>
                        <input type="text" value={newCategory} placeholder="z.B. Dessert" onChange={(onNewCategoryChange)}/>
                    </div>
                    <div className="AddRecipe__Inputs__Categories_SaveCategory">
                        <button className="AddRecipe__Button" onClick={onSaveCategory}>Hinzufügen</button>
                    </div>
                </div>
                <div className="AddRecipe__Inputs__NutritionalValues">
                    <h3>Nährwerte (pro Portion)</h3>
                    <div className="AddRecipe__Inputs__NutritionalValues__Values">
                        <input
                            type="text"
                            name="kcal"
                            placeholder="Kalorien (kcal)"
                            value={recipeData.nutritionalValues[0].kcal}
                            onChange={(e) => updateNutritionalValue("kcal", e.target.value)}
                        />
                        <input
                            type="text"
                            name="carbohydrates"
                            placeholder="Kohlenhydrate (g)"
                            value={recipeData.nutritionalValues[0].carbohydrates}
                            onChange={(e) => updateNutritionalValue("carbohydrates", e.target.value)}
                        />   
                        <input
                            type="text"
                            name="protein"
                            placeholder="Eiweiß (g)"
                            value={recipeData.nutritionalValues[0].protein}
                            onChange={(e) => updateNutritionalValue("protein", e.target.value)}
                        />
                        <input
                            type="text"
                            name="fat"
                            placeholder="Fette (g)"
                            value={recipeData.nutritionalValues[0].fat}
                            onChange={(e) => updateNutritionalValue("fat", e.target.value)}
                        />
                    </div>
                </div>
                <div className="AddRecipe__Inputs__Tags">
                    <h3>Tags</h3>
                    {tags}
                    <button className="AddRecipe__Button" onClick={addTagField}>
                        + Tag hinzufügen
                    </button>
                </div>
                <div className="AddRecipe__Inputs__Save">
                    <button className="AddRecipe__Button" onClick={(onSave)}>Speichern</button>
                </div>

            </div>
        </div>
    )
}

export default AddRecipe;