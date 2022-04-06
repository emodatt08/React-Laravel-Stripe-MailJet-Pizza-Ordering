import React, { useEffect, useState, useCallback } from 'react'
import settings from '../../Helpers/Url';
import Pagination from 'react-js-pagination';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';
import Modal from 'react-modal';

import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

import './Admin.css'
import { Link } from 'react-router-dom';

export default function AdminPizzaTypes() {
  
    const [recordData, setMapData] = useState({});
    const [APIData, setAPIData] = useState([]);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [Id, setId] = useState("");
    const [status, setStatus] = useState("");

    const [paginationItems, setPaginationItems] = useState({});
    const [responseMessage, setResponseMessage] = useState("");
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#ffffff");
    const [modalIsOpen, setIsOpen] = useState(false);
    Modal.setAppElement('#root');

    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

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
    function openModal() {
        setIsOpen(true);
      }
    function closeModal() {
        setIsOpen(false);
    }

    function setRecordData(data){
        setResponseMessage("");
        setName(data.name ?? "");
        setPrice(data.price ?? "");
        setDescription(data.description ?? "");
        setStatus(data.status ?? "");
        setMapData(data);
    }

    const handlePageClick = (pageNumber) => {
        fetchPizzaTypes(pageNumber)
      };

    const fetchPizzaTypes = useCallback((pageNumber) => {
        setLoading(true);
        const baseurl = pageNumber ? `${settings.baseUrl}/pizza_type?page=${pageNumber}` : `${settings.baseUrl}/pizza_order`
         axios.get(baseurl, {headers:settings.headers})
        .then((response) => {
            setLoading(false);
            console.log(response.data.data);
            setAPIData(response.data.data.data);
            const paginationData = response.data.data.meta;
            setPaginationItems(paginationData);
            console.log(paginationItems)

        })      
      }, [paginationItems])


      function editPizzaType() {
        const formData = new FormData() 
        formData.append('image', image);
        sendPizzaImage(formData,"edit");
       
      }

      async function updatePizzaType(data, message){
        setLoading(true);
        const baseurl = `${settings.baseUrl}/pizza_type/${recordData.id}/update`
        await axios.put(baseurl, data, {headers:settings.headers})
       .then((response) => {
        setLoading(false);
        if(response.data.responseCode === '200'){
            setResponseMessage(message)
            fetchPizzaTypes(1)
            setTimeout(function() {
                closeModal();
            }, 2000);
          }else{
            setResponseMessage("Something Went Wrong")
          }
       }) 
      }

      function setModalFunctionType(type){
        if(type === "edit"){
            return  <button className="modal-fulfil-button" onClick={editPizzaType}>Edit</button>
        }else{
            return  <button className="modal-fulfil-button" onClick={addPizzaType}>Add</button>
        }
      }

      function addPizzaType(){
        const formData = new FormData() 
        formData.append('image', image);
        sendPizzaImage(formData, "add");
      }

      async function sendPizzaImage(formData, apiType){
        setLoading(true);
        const baseurl = `${settings.baseUrl}/pizza_type/image`
        await axios.post(baseurl, formData, {headers:settings.imageHeaders})
        .then((response) => {
            setLoading(false);
            if(response.data.responseCode === '200'){
                let imageName = response.data.data;
                let dataParams = jsonParams(imageName)
                console.log(dataParams)
                if(apiType==="edit"){
                    updatePizzaType(dataParams, "Pizza Type Updated Successfully")
                }else{
                    addPizzaTypeToDB(dataParams, "Pizza Type Added Successfully")
                }
              }else{
                return false;
              }
        }) 
      }

      function jsonParams(imageData){
        const data = {
            name: name,
            price: price,
            image: imageData,
            description: description,
            status: status
        }
        return data;
      }

      function addPizzaTypeToDB(data, message){
        setLoading(true);
        const baseurl = `${settings.baseUrl}/pizza_type/store`
        axios.post(baseurl, data, {headers:settings.headers})
       .then((response) => {
        setLoading(false);
        if(response.data.responseCode === '200'){
            setResponseMessage(message)
            fetchPizzaTypes(1)
            setTimeout(function() {
                closeModal();
            }, 2000);
          }else{
            setResponseMessage("Something Went Wrong")
          }
       }) 
      }

      function deletePizzaType() {
        const baseurl = `${settings.baseUrl}/pizza_type/${recordData.id}`
        deletePizza(baseurl, "Pizza type deleted")
      }

      function deletePizza(baseUrl, message) {
        setLoading(true);
        axios.delete(baseUrl, {headers:settings.headers})
        .then((response) => {
            setLoading(false);
            if(response.data.responseCode === '200'){
                setResponseMessage(message)
                fetchPizzaTypes(1)
                setTimeout(function() {
                   alert(message);
                }, 2000);
              }else{
                setResponseMessage("Something Went Wrong")
              }
        })
      }

      function setPizzaType(data){
       
        switch(data.status){
            case "1":
                return "Activated"
           default:
                return "Archived"
       
        }
    }

      useEffect(() => {
        fetchPizzaTypes(1)
    }, [])
  return (
    <div>
        <div className="container">
            <h2> Pizza Types</h2>
           
           
                <div className="row">
                
                <div className="sweet-loading">
                        <ClipLoader color={color} loading={loading} css={override} size={150} />
                </div>
                    <div className='col-md-12 table-responsive'>
                    <Link to={'/all/orders'}>
                        <button className="modal-fulfil-button" style={{float:"right", marginBottom:"10px"}}>Pizza Orders</button>
                    </Link>
            
                <button onClick={(event) => { openModal(); setRecordData("");}} className="modal-close-button" style={{float:"left",backgroundColor: "red"}}>Add</button>
                    <table className='table table-dark table-striped table-hover table-bordered'>
                   
                            <thead>
                                <tr>
                                    <th scope="col">Image</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Pizza Status</th>
                                    <th></th>
                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                            {APIData.map((data, key) => {
                                    return (
                                        <tr key = {key}>
                                        <td><img src={data.image} alt=""
                                        /></td>
                                        <td>{data.name}</td>
                                        <td>{data.price}</td>
                                        <td>{setPizzaType(data)}</td>
                                        <td> <button className="fulfil-button" onClick={(event) => { openModal(); setRecordData(data);}} >Edit</button></td>
                                        <td> <button  className="decline-button" onClick={(event) => {deletePizzaType()}}>Delete</button></td>
            
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
                            <div> {recordData.id ? <img  style={{marginLeft: "170px"}} src={`${recordData.image}`} alt="pizza-type"/> : ""} </div>
                            <button className="modal-close-button" onClick={closeModal}>close</button>
                            {setModalFunctionType(recordData.id ? "edit" : "add")}

                            <form>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text"   defaultValue={name}  onChange={(e) => { setName(e.target.value)}} className="form-control" id="name" placeholder="Enter Name" />
                                </div>

                                <div className="form-group">
                                    <label>Price</label>
                                    <input type="number" defaultValue={price} onChange={(e) => { setPrice(e.target.value)}} className="form-control" id="price" placeholder="Enter Price" />
                                </div>

                                <div className="form-group">
                                    <label>Image</label>
                                    <input type="file" onChange={(e) => { setImage(e.target.files[0])}} className="form-control" id="image"  />
                                </div>
                                
                                <div className="form-group">
                                    <label>Status</label>
                                    <select defaultValue={status} onChange={(e) => { setStatus(e.target.value)}} className="form-control" id="status">
                                        <option value="1">Activated</option>
                                        <option value="0">Archived</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea defaultValue={description} onChange={(e) => { setDescription(e.target.value)}} className="form-control" id="description" rows="3"></textarea>
                                </div>

                                <input type="hidden" defaultValue={recordData.id ?? ""} onChange={(e) => { setId(e.target.value)}} className="form-control" id="id" />
                            </form>
                        </Modal>

                        
                    </div>

                </div>
                
            </div>
    </div>
  )
}
