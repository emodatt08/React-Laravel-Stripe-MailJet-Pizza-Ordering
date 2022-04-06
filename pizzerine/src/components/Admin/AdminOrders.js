import axios from 'axios';
import React, { useEffect, useState, useCallback} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import settings from '../../Helpers/Url';
import Pagination from 'react-js-pagination';
import Modal from 'react-modal';
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

import Map from '../../Helpers/Maps';

import './Admin.css'
import { Link } from 'react-router-dom';

export default function AdminOrders() {

    
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
    body:{
        width:"400"
    }
  };
  Modal.setAppElement('#root');
    const [APIData, setAPIData] = useState([]);
    const [paginationItems, setPaginationItems] = useState({});
    const [recordData, setMapData] = useState({});
    const [responseMessage, setResponseMessage] = useState("");
    const [declineNote, setDeclineNote] = useState("");
    const [modalIsOpen, setIsOpen] = useState(false);
    const [declineModalIsOpen, setDeclineModalIsOpen] = useState(false);
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#ffffff");

    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;
    function openModal() {
        setIsOpen(true);
      }

    function setRecordData(data){
        setMapData(data);
    }

      function openDeclineModal() {
        setDeclineModalIsOpen(true);
      }
    


      function sendFulfilment() {
        console.log("In fulfilment",recordData)
        let fulfilData = {
            fulfil: "1"
        }

        updatePizzaOrder(fulfilData, "Fulfilment email sent")
       
      }


      function declineOrder(e) {
        e.preventDefault();
        let declineData = {
            fulfil: "2",
            declineNote:declineNote
        }

        updatePizzaOrder(declineData, "Pizza Order Declined!")
       
      }

      async function updatePizzaOrder(data, message){
        setLoading(true);
        const baseurl = `${settings.baseUrl}/pizza_order/${recordData.id}`
        console.log(baseurl, recordData);
        await axios.put(baseurl, data, {headers:settings.headers})
       .then((response) => {
        setLoading(false);
        if(response.data.responseCode === '200'){
            setResponseMessage(message)
            fetchPizzaOrder(1)
          }else{
            setResponseMessage("Something Went Wrong")
          }
       }) 
      }
    function setFulfilment(data){
       
        switch(data.fulfilment){
            case '1':
                return "Order fulfiled"
   
            case '0':
                return "Pending"

           default:
                return `Order declined, ${data.decline_note}`
       
        }
    }

    function setPayment(data){
       
        switch(data.payment){
            case 1:
                return "Paid"
   
            case 0:
                return "Pending"

           default:
                return "Payment cancelled"
       
        }
    }
    
    function closeModal() {
        setIsOpen(false);
    }

    function closeDeclineModal() {
        setDeclineModalIsOpen(false);
    }
      

    

     const fetchPizzaOrder = useCallback((pageNumber) => {
        setLoading(true);
        const baseurl = pageNumber ? `${settings.baseUrl}/pizza_order?page=${pageNumber}` : `${settings.baseUrl}/pizza_order`
         axios.get(baseurl, {headers:settings.headers})
        .then((response) => {
            setLoading(false);
            setAPIData(response.data.data.data);
            const paginationData = response.data.data.meta;
            setPaginationItems(paginationData);
            console.log(paginationItems)

        })      
      }, [paginationItems])

      useEffect(() => {
        fetchPizzaOrder(1)
    }, [])

    const handlePageClick = (pageNumber) => {
        fetchPizzaOrder(pageNumber)
      };

  return (
        <div>

            <div className="container">
            <h2> Pizza Orders</h2>
           
           
                <div className="row">
                <Link to={'/pizza/types'}>
                <button style={{float:"right", marginBottom:"10px"}}>Pizza Types</button>
            </Link>
                <div className="sweet-loading">
                        <ClipLoader color={color} loading={loading} css={override} size={150} />
                </div>
                    <div className='col-md-12 table-responsive'>
                    
                    <table className='table table-dark table-striped table-hover table-bordered'>
                   
                            <thead>
                                <tr>
                                    <th scope="col">Full name</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Location</th>
                                    <th scope="col">Pizza Type</th>
                                    <th scope="col">Total Price</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Residential Address</th>
                                    <th scope="col">Payment Status</th>
                                    <th scope="col">Order Status</th>
                                    <th></th>
                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                            {APIData.map((data, key) => {
                                    return (
                                        <tr key = {key}>
                                        <td>{data.full_name}</td>
                                        <td>{data.phone}</td>
                                        <td>{data.location}</td>
                                        <td><img src={data.pizza_type.image} alt=""
                                        /><p>{data.pizza_type.name}</p></td>
                                        <td>{data.total_price}</td>
                                        <td>{data.quantity}</td>
                                        <td>{data.residential_address}</td>
                                        <td>{setPayment(data)}</td>
                                        <td>{setFulfilment(data)}</td>
            
                                        <td> <button className="fulfil-button" onClick={(event) => { openModal(); setRecordData(data);}} >Fulfil</button></td>
                                        <td> <button  className="decline-button" onClick={ (event) => {openDeclineModal(); setRecordData(data);}}>Decline</button></td>
            
                                    </tr>
                                )})}
                            
                            </tbody>
                        
                        </table>


                        <div className='mt-3'>
                           <Pagination 
                            totalItemsCount={paginationItems.total ?? 5}
                            activePage={paginationItems.current_page}
                            itemsCountPerPage={paginationItems.per_page}
                            onChange={(pageNumber) => handlePageClick(pageNumber)}
                            itemClass="page-item"
                            linkClass='page-link'
                            firstPageText="first"
                            lastPageText="last"
                           />         
                        </div>

                        <Modal
                            isOpen={modalIsOpen}
                            
                            onRequestClose={closeModal}
                            style={customStyles}
                        >
                            <h2 style={{color: "red"}}>{responseMessage}</h2>
                            <button className="modal-close-button" onClick={closeModal}>close</button>
                            <button className="modal-fulfil-button" onClick={sendFulfilment}>Fulfil</button>

                            <form>
                            <Map
                                google={"google"}
                                center={{ lat: recordData.latitude, lng: recordData.longitude }}
                                height="300px"
                                order={recordData}
                                zoom={15}
                            />
                           
                            </form>
                        </Modal>

                        <Modal
                            isOpen={declineModalIsOpen}
                            onRequestClose={closeModal}
                            style={customStyles}
                            contentLabel="Decline Order"
                        >
                           <h2>{responseMessage}</h2>
                           <button className="modal-close-button" onClick={closeDeclineModal}>close</button>
                            <div>Decline order?</div>
                            <form>
                            <input placeholder='Reason for declining' onChange={(e) => setDeclineNote(e.target.value)}/>
                            <button className="decline-button" onClick={declineOrder}>Decline</button>
                            </form>
                        </Modal>
                    </div>

                </div>
                
            </div>
        </div>
  )
}
