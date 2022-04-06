import React from 'react';
import {Link} from "react-router-dom";
import BackGroundImage from "../../Icons/pizza.jpeg";
import './Home.css';

export default function Home() {
    return (
        <div class="home" style={{ backgroundImage: `url(${BackGroundImage})`}}>
           <div className="headerContainer" >
               <h1> Sadat's Pizzaria </h1>
               <p>BEST PIZZA IN TOWN</p>
               <Link to="/menu">
                    <button>ORDER ONLINE</button>
               </Link>
               
           </div>
        </div>
    )
}