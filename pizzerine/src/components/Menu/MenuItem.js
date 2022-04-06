import React from 'react'



export default function MenuItem({ menuData }) {
    return (
        <div>
            <div style={{ backgroundImage: `url(${menuData.image})`}}> </div>
            <h4 className='menu-name'> {menuData.name} </h4>
            <p>  {menuData.price} </p>          
        </div>
    )
}
