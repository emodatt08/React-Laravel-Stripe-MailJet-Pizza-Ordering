import React from 'react';
import BannerImage from "../../Icons/multiplePizzas.jpeg";
import './About.css';

export default function About() {
    return (
        <div className="about">
            <div className='aboutTop'  style={{ backgroundImage: `url(${BannerImage})`}}></div>
            <div className='aboutBottom'>
                <h1>About Us</h1>
                <p>Sadat's Pizzaria is one of the best </p>
            </div>
        </div>
    )
}
