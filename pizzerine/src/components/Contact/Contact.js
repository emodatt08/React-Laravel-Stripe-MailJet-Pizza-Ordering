import React from 'react';
import PizzaLeft from "../../Icons/pizzaLeft.jpg";
import './Contact.css';

export default function Contact() {
    return (
        <div className='contact'>
            <div className='leftSide' style={{ backgroundImage: `url(${PizzaLeft})`}}></div>
            <div className='rightSide'>
                <h1>Contact Us</h1>
                <form id="contact-form" method="POST">
                    <label htmlFor='name'>Full Name</label>
                    <input name="name" placeholder="Enter Full name..." type="text" />
                    <label htmlFor='email'>Email</label>
                    <input name="email" placeholder="Enter email" type="email" />
                    <label htmlFor="message"></label>
                    <textarea rows="6" placeholder='Enter message...' name="message" required></textarea>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}
