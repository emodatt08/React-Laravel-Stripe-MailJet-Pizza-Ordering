import React, {useEffect, useState, useCallback} from 'react';
import MenuItem from './MenuItem';
import settings from '../../Helpers/Url';
import axios from 'axios';
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import OrderMap from '../../Helpers/OrderMap';
import Modal from 'react-modal';
import "bootstrap/dist/css/bootstrap.min.css"
import './Menu.css';

export default function Menu() {

    const [pizzaData, setPizzaData] = useState([]);
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#ffffff");
    let [getLatitude, setLatitude] = useState("");
    let [getLongitude, setLongitude] = useState("");
    const [recordData, setMapData] = useState({});
    const [modalIsOpen, setIsOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");


    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        }
      };

      const override = css`
      display: block;
      margin: 0 auto;
      border-color: red;
    `;
   
    function setRecordData(data){
        setMapData(data);
    }

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function getPosition(){
        console.log("Im here");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(loc){
                console.log("getCurrentPosition");
                console.log('The location in lat lon format is: [', loc.coords.latitude, ',', loc.coords.longitude, ']');
                setLatitude(loc.coords.latitude);
                setLongitude(loc.coords.longitude);
              },function(error) {
                  console.log(error)
                
            },{timeout:150000, enableHighAccuracy:true})
        } else {
            
            console.log("Geolocation is not supported by this browser.");
        }
      }

   
    const fetchPizzaData = useCallback(() => {
        setLoading(true);
        const baseurl = `${settings.baseUrl}/pizza_type`
         axios.get(baseurl, {headers:settings.headers})
        .then((response) => {
            setLoading(false);
            if(response.data.responseCode === '200'){
                setPizzaData(response.data.data.data)
            }else{

            }
        })      
      }, [])

      useEffect(() => {
        fetchPizzaData()
        getPosition()
      }, [])
    
    return (
        <div className='menu'>
            <h1 className='menuTitle'>Our Menu</h1>
            <div className='menuList'>
                {pizzaData.map((menuItem, key) =>{
                    return <div className="menuItem" key={key}> 
                        <MenuItem   menuData={menuItem}/>
                       <p> <button className="order-modal-button" onClick={(event) => { openModal(); setRecordData(menuItem);}}>Order</button> </p>
                    </div>
                })}
            </div>
                <div className="sweet-loading">
                        <ClipLoader color={color} loading={loading} css={override} size={150} />
                </div>

                        <Modal
                            isOpen={modalIsOpen}
                            
                            onRequestClose={closeModal}
                            style={customStyles}
                        >
                            <h2>{responseMessage}</h2>
                            <button className="modal-close-button" onClick={closeModal}>close</button>
                           

                            <form>
                            <OrderMap
                                google={"google"}
                                center={{ lat: getLatitude ?? '52.1579' , lng: getLongitude ?? '106.6702' }}
                                height="300px"
                                pizza={recordData}
                                zoom={15}
                            />
                           
                            </form>
                        </Modal>
        </div>
    )
}