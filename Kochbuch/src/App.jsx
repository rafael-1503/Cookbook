import { Outlet } from 'react-router-dom';
import './App.css'
import BurgerMenu from './components/BurgerMenu/BurgerMenu';
import {Link} from "react-router-dom";
import { User } from 'lucide-react';

const App=()=>{

  return (
      <div className='App'>
        <div className='Header'>
          <Link to={"/"} className='Title'>Kochbuch</Link>
        </div>
        <BurgerMenu/>
        <Link to={"/users"} className='User__Button'><User color="black" size={35}/></Link>
        <div className='Content'>
          <Outlet/>
        </div>
      </div>
  )
}

export default App;
