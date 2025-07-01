import { useState } from "react";
import "./User.css";
import axios from "../../axiosURL"
import { login, logout } from "../../reducer/userSlice.js"; 
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const User = (props)=>{

    const dispatch = useDispatch();

    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const user = useSelector(state => state.user);

    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        firstname: "",
        lastname: "",
        street: "",
        postcode: "",
        city: "",
        country: "",
        phone: "",
        email: "",
        password: ""
    })

    const onUserDataChange = (e)=>{
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const onSignup = ()=>{
        console.log("Signup-Daten:", userData);
        let newUser = {
            ...userData
        };

        axios.post("/signup",newUser,{withCredentials:true}).then((res)=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)
        })
    };

    const onLogin = ()=>{
        axios.post("/login",{email: userData.email, password: userData.password},{withCredentials:true}).then((res)=>{
            console.log(res)
            alert("Angemeldet! User: "+userData.email)
            dispatch(login({
                userId: res.data.userId,
                email: userData.email
            }))
            navigate("/");
        }).catch(err=>{
            console.log(err)
            alert("Anmeldedaten nicht korrekt.")
        })
    };

    const onLogout = ()=>{
        axios.post("logout").then((res)=>{
            console.log(res)
            alert("Ausgeloggt!")
            dispatch(logout())
            window.sessionStorage.clear()
            window.location.reload()
        }).catch(err=>{
            console.log(err)
        })
    };


    return(
        <div className="Account">
            {isLoggedIn ? (
                <div className="Account__Logout">
                    <p> Eingeloggt als: {user.email} </p>
                    <h1>Logout</h1>
                    <div className="Account__Buttons">
                        <button className="Account__Button" onClick={onLogout}>Logout</button>
                    </div>
                </div>
            ) : (

            <>
                <div className="Account__Login">
                    <h1>Login</h1>
                    <div className="Account__Row">
                        <h3>Email</h3>
                        <input type="text" name="email" value={userData.email} onChange={onUserDataChange}/>
                    </div>
                    <div className="Account__Row">
                        <h3>Passwort</h3>
                        <input type="password" name="password" value={userData.password} onChange={onUserDataChange}/>
                    </div>
                    <div>
                        <div className="Account__Buttons">
                            <button className="Account__Button" onClick={onLogin}>Login</button>
                        </div>
                    </div>
                </div>
                
                <div className="Account__Signup">
                    <h1>Registrieren</h1>
                    <div className="Account__Row">
                        <h3>Vorname</h3>
                        <input type="text" name="firstname" value={userData.firstname} onChange={onUserDataChange} />
                    </div>
                    <div className="Account__Row">
                        <h3>Nachname</h3>
                        <input type="text" name="lastname" value={userData.lastname} onChange={onUserDataChange} />
                    </div>
                    <div className="Account__Row">
                        <h3>Straße</h3>
                        <input type="text" name="street" value={userData.street} onChange={onUserDataChange} />
                    </div>
                    <div className="Account__Row">
                        <h3>PLZ</h3>
                        <input type="text" name="postcode" value={userData.postcode} onChange={onUserDataChange} />
                    </div>
                    <div className="Account__Row">
                        <h3>Stadt</h3>
                        <input type="text" name="city" value={userData.city} onChange={onUserDataChange} />
                    </div>
                    <div className="Account__Row">
                        <h3>Land</h3>
                        <input type="text" name="country" value={userData.country} onChange={onUserDataChange} />
                    </div>
                    <div className="Account__Row">
                        <h3>Telefon</h3>
                        <input type="text" name="phone" value={userData.phone} onChange={onUserDataChange} />
                    </div>
                    <div className="Account__Row">
                        <h3>Email</h3>
                        <input type="text" name="email" value={userData.email} onChange={onUserDataChange} />
                    </div>
                    <div className="Account__Row">
                        <h3>Passwort</h3>
                        <input type="password" name="password" value={userData.password} onChange={onUserDataChange} />
                    </div>
                    <div className="Account__Buttons">
                        <button className="Account__Button" onClick={onSignup}>Registrieren</button>
                    </div>
                </div>
            </>
            )}
        </div>
    )
}

export default User;
