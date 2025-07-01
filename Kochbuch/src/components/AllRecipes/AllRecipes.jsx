import "./AllRecipes.css"
import useRecipes from "../../hooks/useRecipes"
import Recipes from "../Recipes/Recipes"
import { useState, useEffect } from "react"
import useCategories from "../../hooks/useCategories"
import axios from "../../axiosURL"
import { Search } from "lucide-react";

const AllRecipes=()=>{
    const [inputValue, setInputValue] = useState("")
    const {recipes, savedRecipes, onSavedChange} = useRecipes();
    const [selectedCategory, setSelectedCategory] = useState("Alle");
    const {categories} = useCategories();
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        onSearch();
    }, [selectedCategory, query]);

    const onSearch = async () => {
        try{
            console.log("onSearch aufgerufen")
            console.log("Query: ", query)
            console.log("Category", selectedCategory)
            let res = recipes;
            if(query && selectedCategory !== "Alle"){
                res = await axios.get(`cookbook/search?tags=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}`, {withCredentials:true})
                console.log("If 1")
            }
            else if(query && selectedCategory === "Alle"){
                res = await axios.get(`cookbook/search?tags=${encodeURIComponent(query)}`, {withCredentials:true})
                console.log("If 2")
            }
            else if(selectedCategory !== "Alle"){
                res = await axios.get(`cookbook/search?category=${encodeURIComponent(selectedCategory)}`, {withCredentials:true})
                console.log("If 3")
            }
            console.log("Ergebnis: ", res.data)
            setResults(res.data)
        }catch(err){
            console.error("Fehler beim Laden: ", err)
        }
    } 

    const filteredRecipes = (selectedCategory === "Alle" && query ==="") ? (recipes || []) : (results || [])

    const Items = filteredRecipes.map(recipe => (
        <Recipes
            key={recipe._id}
            recipe={recipe}
            isSaved={savedRecipes.includes(recipe._id)}
            onSavedChange={onSavedChange}
        />
    ))

    return(
        <div className="AllRecipes">
            <h1 className="AllRecipes__Title">Rezepte</h1>
            <div className="AllRecipes__Filters">
                <div className="AllRecipes__Filter"> 
                    <label>Kategorie</label>
                    <select id="selectCategory" 
                        value={selectedCategory} 
                        onChange={e => setSelectedCategory(e.target.value)}>
                            <option value="Alle">Alle</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                    </select>
                </div>
                <div className="AllRecipes__Search">
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={(e)=> setInputValue(e.target.value)} 
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                            setQuery(inputValue);
                            }
                        }} 
                        placeholder="Suche nach Rezepten..."/>
                    <button onClick={() => setQuery(inputValue)}><Search /></button>
                </div>
            </div>
            <div className="AllRecipes__Grid">
                {Items}
            </div>
        </div>
        
    )
}


export default AllRecipes;