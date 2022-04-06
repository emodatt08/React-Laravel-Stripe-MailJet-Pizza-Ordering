import axios from 'axios';
import React, { useState, useEffect} from 'react';
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

import { Button, Form, Checkbox } from 'semantic-ui-react'
import settings from '../../Helpers/Url';
import { useNavigate} from 'react-router-dom';


import './Admin.css'

export default function Admin(props) {
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [logInCheckbox, setLogInCheckbox] = useState(false);
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");
  
  let navigate = useNavigate();
  const override = css`
          display: block;
          margin: 0 auto;
          border-color: red;
        `;



  async function postData(event){
    event.preventDefault();
    //let navigate = useNavigate();
    const values = [firstName, password];
  
    let errorMsg = '';

    const allFieldsFilled = values.every((field) => {
      const value = `${field}`.trim();
      return value !== '' && value !== '0';
    });

    if(!allFieldsFilled){
      errorMsg = 'Please fill out all the fields.';
    }else{
      let result = await SendToApi({"first_name":firstName, "password":password, "keepMeLoggedIn":logInCheckbox});
      if (result.response) {
        navigate('/all/orders');  
      } else {
        console.log('error', result.message);
        setErrorMsg('error '+ result.message);
      }
    }
    setErrorMsg(errorMsg)
}


async function SendToApi(data){
  setLoading(true);
  let sendToApi = axios.post(`${settings.baseUrl}/login`, data, {
    headers: settings.headers
  }).then(json =>{
    setLoading(false);
    console.log('response: ', json);
    if(json.data.responseCode === '200'){
      localStorage.setItem("pizzeria.sanctum", json.data.data.token);
      return {"response" : true, "message":"success"};
    }else{
      return {"response" : false, "message":'Authentication failed! '+ json.data.responseMessage};
      //return false;
    }
    
});
return sendToApi;
}

  return (
     
    <div>

        <div className="main">
           <h2 className="main-header"> Admin Operations</h2>
          
              <Form inverted className="create-form">
                <Form.Group widths='equal'>
                {errorMsg && <p className="errorMsg">{errorMsg}</p>}
                  <Form.Input fluid label='First name' placeholder='First name' onChange={(e) => setFirstName(e.target.value)}/>
                  <Form.Input fluid label='Password' type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Field>
                  <Checkbox className='logInCheckbox' label='Keep me logged In' onChange={(e) => setLogInCheckbox(!logInCheckbox)}/>
                </Form.Field>

                
                <Button type='submit' onClick={postData}>Submit</Button>
                <div className="sweet-loading">
                  <ClipLoader color={color} loading={loading} css={override} size={150} />
                </div>
              </Form>
              
        </div>
        
    </div>
  )
}
