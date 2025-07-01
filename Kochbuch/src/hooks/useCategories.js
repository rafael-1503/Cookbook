import { useEffect, useState } from "react";
import axios from "../axiosURL";

const useCategories = () => {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const getCategories = async () => {
            try{
                const res = await axios.get("cookbook/categories")
                setCategories(res.data)
            } catch(err){
                console.error("Fehler beim Laden: ", err)
            }
        }
        getCategories()
    }, [])

    return{categories}
}

export default useCategories;