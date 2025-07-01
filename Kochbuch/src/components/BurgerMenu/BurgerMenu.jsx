import "./BurgerMenu.css"
import Hamburger from "hamburger-react"
import { useState, useEffect, useRef } from "react"
import {Link} from "react-router-dom";


const BurgerMenu = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setOpen(false)
        }
        }

        if (open) {
            document.addEventListener("pointerdown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("pointerdown", handleClickOutside)
        }
    }, [open])


    return (
        <div>
            <div className={`burger-button${open ? ' shifted' : ''}`}>
                <Hamburger
                    size={30}
                    toggled={open}
                    toggle={setOpen}
                />
            </div>

            <div ref={menuRef} className={`menu${open ? ' open' : ''}`}>
                <ul>
                    <li><Link to={""} className="Button" onClick={() => setOpen(false)}>Rezepte</Link></li>
                    <li><Link to={"/myRecipes"} className="Button" onClick={() => setOpen(false)}>Meine Rezepte</Link></li>
                    <li><Link to={"/savedRecipes"} className="Button" onClick={() => setOpen(false)}>Gemerkte Rezepte</Link></li>
                    <li><Link to={"/addRecipe"} className="Button" onClick={() => setOpen(false)}>Rezept hinzufügen</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default BurgerMenu;