import React, { useEffect, useState } from 'react'
import "./Checkout.css";
import { useNavigate } from 'react-router-dom';
import settings from '../../Helpers/Url';
import axios from 'axios';

import "../Admin/Admin.css"
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';


export default function Checkout() {
  let [checkOutResponse, setCheckOutResponse] = useState("");
  let [creditCardDetails, setCreditCardDetails] = useState([]);
  const stripe = useStripe();
  const elements = useElements();

 
 
  let checkoutItems = JSON.parse(localStorage.getItem('pizzeria.checkout'));
  
 
  let navigate = useNavigate();
 

    useEffect(() => {
        if(!checkoutItems){
          setCheckOutResponse("No Pizza Orders Made, you will be redirected to the menu page shortly");
          setTimeout(function(){
            navigate('/menu');
          }, 3000);
          
        }
        
    }, [])

    async function postData(e){
      e.preventDefault()
      const {error, paymentMethod} = await stripe.createPaymentMethod({
        type:"card",
        card: elements.getElement(CardElement)
      })
      console.log(creditCardDetails);
      if(!error){
          try {
              const {id} = paymentMethod
             
              const paymentResponse = await sendPayment({"stripeToken":id, "order_id":checkoutItems.order_id, "price":checkoutItems.price});
          } catch (error) {
            console.log(error);
            setCheckOutResponse(error)
          }
      }
    }

   async function sendPayment(params) {
    const baseurl = `${settings.baseUrl}/pizza_order/pay`
    const apiData = params;
    
        await axios.post(baseurl, apiData, {headers:settings.headers})
      .then((response) => {
        if(response.data.responseCode === '200'){
            const apiResponseMessage = response.data.responseMessage;
          console.log(apiResponseMessage);
            setCheckOutResponse(apiResponseMessage);
            setTimeout(function(){
              navigate('/menu');
            }, 2000);
          }else{
            console.log(response.data.responseMessage);
            setCheckOutResponse(response.data.responseMessage);
          }
      }) 
    }
    



  return (
    <div>
        <p style={{color: "red"}}>{checkOutResponse}</p>

        <div className="container align-items-center">

          <div className="row">
              <div className="col-md-6 col-md-offset-3">
                  <div className="panel panel-default credit-card-box">
                      <div className="panel-heading display-table" >
                          <div className="row display-tr" >
                              <h3 className="panel-title display-td" >Checkout(Payment Details)</h3>
                                                     
                                  <img className="pull-right" src={settings.iconUrl + '/accepted_cards.png'} />

                          </div>                    
                      </div>
                      <div className="panel-body">
                        <form onSubmit={postData} style={{ maxWidth: 400 }}>
                          <CardElement />
                          <button>Pay({checkoutItems.price.toFixed(2)})</button>
                        </form>
                          
                      </div>
                  </div>        
              </div>
          </div>
      
        </div>
  
    </div>
   
  )
}
