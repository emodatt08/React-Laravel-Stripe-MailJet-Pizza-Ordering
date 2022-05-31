import React,  { useState } from 'react'
import LogoFile from '../../Icons/pizzaLogo.png';
import {Link} from 'react-router-dom';
import ReorderIcon from '@mui/icons-material/Reorder';
import "./Navbar.css";

export default function Navbar() {
    const [openLinks, setOpenLinks] = useState(false);

    const toggleNavBar = () =>{
        setOpenLinks(!openLinks);
    }

    function SetLoginDetails() {
        if(localStorage.getItem('pizzeria.sanctum') && localStorage.getItem('pizzeria.sanctum').length > 1){
           
          return <Link to="/logout">Log Out</Link> 
        }else{
          return <Link to="/admin">Admin</Link> 
        }

    }

    return (
        <div className='navbar'>
            <div className='leftSide' id={ openLinks ? 'open' : 'close'}>
                <img src={LogoFile} alt="pizza" />
                <div className='hiddenLinks'>
                    <Link to="/">Home</Link>
                    <Link to="/menu">Menu</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact Us</Link>
                    <SetLoginDetails />
                </div>
            </div>
               
            <div className='rightSide'>
                <Link to="/">Home</Link>
                <Link to="/menu">Menu</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact Us</Link>
                <SetLoginDetails />
               
                <button onClick={toggleNavBar} ><ReorderIcon /></button>
                
            </div>
        </div>
    )
}
