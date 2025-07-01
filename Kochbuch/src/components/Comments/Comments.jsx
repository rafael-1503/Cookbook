import "./Comments.css"
import { Pencil,CircleUserRound } from "lucide-react";
import { useState } from "react";
import { Star } from "lucide-react";
import axios from "../../axiosURL";

const Comments = ({ recipe, loadRecipe }) => {

    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(0);

    const onNewCommentChange = (e) =>{
        setNewComment(e.target.value)
    };


    const onSaveComment=()=>{
        const id = recipe._id;

        if(rating === 0){
            axios.put("cookbook/comment/recipe", {recipe: id, comment: newComment}, {withCredentials:true}).then((res)=>{
                loadRecipe();
            }).catch(err=>{
                console.log(err);
            })
        }

        else if(!newComment){
            axios.put("cookbook/rate/recipe", {recipe: id, rating: rating}, {withCredentials:true}).then((res)=>{
                loadRecipe();
            }).catch.log(err);
        }

        else{
            axios.put("cookbook/commentrate/recipe", {recipe: id, comment: newComment, rating: rating}, {withCredentials:true}).then((res)=>{
                loadRecipe();
            }).catch.log(err);
        }

    };

    return(
        <div className="Comments">
            <div className="Comments__Rating">
                {[1,2,3,4,5].map((value) => (
                    <button key={value} onClick={() => setRating(value)}> 
                        <Star
                        size={30}
                        fill={value <= rating ? "gold" : "none"}
                        stroke={value <= rating ? "gold" : "gray"}
                        /> 
                    </button>
                ))}

            </div>
            <div className="Comments__AddComment">
                <input name="newComment" type="Text" placeholder="Kommentar schreiben... " onChange={onNewCommentChange}/>
                <button onClick={onSaveComment}><Pencil size={20} strokeWidth={2.5}/></button>
            </div>
            {recipe.comments.map((comment) => (
                <div className="Comments__Comment">
                    <p className="Comments__User"><CircleUserRound />{comment.user?.firstname} {comment.user?.lastname}</p>
                    <p className="Comments__Text" >{comment.comment}</p>
                    <div className="HorizontalDivider__Comment"></div>
                </div>
            ))}
        </div>
    )
}

export const AverageRating = ({ratings}) => {

        if (!ratings || ratings.length === 0) return null;
        const averageRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : null

        return(
            
            <div className="Comments__AverageRating">
                {[1,2,3,4,5].map((value)=> (
                    <Star
                        key={value}
                        size={30}
                        fill={value <= averageRating ? "gold" : "none"}
                        stroke={value <= averageRating ? "gold" : "grey"}
                    />
                ))}
                <p className="Comments__AverageRating__Anzahl">
                        ({ratings.length})
                </p>
            </div>
                    
        )
    }

export default Comments;