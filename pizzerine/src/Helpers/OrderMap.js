import React, { Component } from "react";
import { withRouter } from "react-router";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker
} from "react-google-maps";
import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
import axios from "axios";
import settings from "./Url";
Geocode.setApiKey("AIzaSyDTePHiX02RDQhPUlWV6ttVQHLyrPgHhdI");
Geocode.enableDebug();
class OrderMap extends Component {
  constructor(props) {
    super(props);
    console.log("Props",this.props.history);
    this.state = {
      address: "",
      phone:"",
      order_id:0,
      full_name:"",
      pizza_type_id:this.props.pizza.id,
      residential_address:"",
      location:"",
      quantity:1,
      price: this.props.pizza.price,
      total_price: this.props.pizza.price,
      latitude : this.props.center.lat,
      longitude:this.props.center.lng,
      email:"",
      mapPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      },
      markerPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      },
      responseMessage:""
    };
    localStorage.setItem("pizzeria.checkout", "");
    this.handleChange = this.handleChange.bind(this)
  }
  /**
   * Get the current address from the default map position and set those values in the state
   */
  componentDidMount() {
    Geocode.fromLatLng(
      this.state.mapPosition.lat,
      this.state.mapPosition.lng
    ).then(
      response => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);

        console.log("city", city, area, state);

        this.setState({
          address: address ? address : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : "",
          location: city ? city+"/"+state+"/"+area : "",
          residential_address:address ? address : "",
        });
      },
      error => {
        console.error(error);
      }
    );
  }
  /**
   * Onclick event function for pizza order form
   * @param {*} event 
   */
  sendOrder = (event) => {
    event.preventDefault();
    
    this.sendPizzaOrder(this.state);
    
  }
 

  
  /**
   * Send Pizza Order to API
   * @param {*} data 
   * @param {*} message 
   * this.sendPizzaOrder(this.state, "Order Response")
   */
    sendPizzaOrder = async (data) => {
    const baseurl = `${settings.baseUrl}/pizza_order`
    const apiData = data;
    
    await  axios.post(baseurl, apiData, {headers:settings.headers})
   .then((response) => {
    if(response.data.responseCode === '200'){
        const apiResponseMessage = response.data.responseMessage;
        
       this.setState({ order_id: response.data.data.id }, function () {
        localStorage.setItem("pizzeria.checkout", JSON.stringify(this.state));
          this.setState({ responseMessage : "Order Collected! redirecting to payment page" });
          setTimeout(function(){
            window.location.href = "/checkout";
          }, 2000)
       });

        return apiResponseMessage;
      }else{
        this.setState({ responseMessage : response.data.responseMessage});
        return false;
      }
   }) 
  }

  /**
   * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
   *
   * @param nextProps
   * @param nextState
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.markerPosition.lat !== this.props.center.lat ||
      this.state.address !== nextState.address ||
      this.state.residential_address !== nextState.residential_address ||
      this.state.city !== nextState.city ||
      this.state.area !== nextState.area ||
      this.state.state !== nextState.state
    ) {
      return true;
    } else if (this.props.center.lat === nextProps.center.lat) {
      return true;
    }
  }
  /**
   * Get the city and set the city input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getCity = addressArray => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  /**
   * Get the area and set the area input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getArea = addressArray => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };
  /**
   * Get the address and set the address input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getState = addressArray => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };
  /**
   * And function for inputs
   * @param event
   */
  handleChange =  event => {
    console.log(event.target.name);
    if(event.target.name === "quantity"){
     console.log("price", event.target.value * this.state.price)
      this.setState({ price : event.target.value * this.state.price });

    }
    this.setState({ [event.target.name]: event.target.value });
  };
  /**
   * This Event triggers when the marker window is closed
   *
   * @param event
   */
  onInfoWindowClose = event => {};
  /**
   * When the user types an address in the search box
   * @param place
   */
  onPlaceSelected = place => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    // Set these values in the state.
    this.setState({
      address: address ? address : "",
      area: area ? area : "",
      city: city ? city : "",
      state: state ? state : "",
      markerPosition: {
        lat: latValue,
        lng: lngValue
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue
      }
    });
  };
  /**
   * When the marker is dragged you get the lat and long using the functions available from event object.
   * Use geocode to get the address, city, area and state from the lat and lng positions.
   * And then set those values in the state.
   *
   * @param event
   */
  onMarkerDragEnd = event => {
    console.log("event", event);
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng(),
      addressArray = [];
    Geocode.fromLatLng(newLat, newLng).then(
      response => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);
        this.setState({
          address: address ? address : "",
          residential_address: address ? address : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : ""
        });
      },
      error => {
        console.error(error);
      }
    );
  };
  render() {
    const AsyncMap = withScriptjs(
      withGoogleMap(props => (
        <GoogleMap
          google={this.props.google}
          defaultZoom={this.props.zoom}
          defaultCenter={{
            lat: this.state.mapPosition.lat,
            lng: this.state.mapPosition.lng
          }}
        >
          {/* For Auto complete Search Box */}
          <Autocomplete
            style={{
              width: "100%",
              height: "40px",
              paddingLeft: "16px",
              marginTop: "2px",
              marginBottom: "100px"
            }}
            onPlaceSelected={this.onPlaceSelected}
            types={["(regions)"]}
          />
          {/*Marker*/}
          <Marker
            google={this.props.google}
            name={"Dolores park"}
            draggable={true}
            onDragEnd={this.onMarkerDragEnd}
            position={{
              lat: this.state.markerPosition.lat,
              lng: this.state.markerPosition.lng
            }}
          />
          <Marker />
          {/* InfoWindow on top of marker */}
          <InfoWindow
            onClose={this.onInfoWindowClose}
            position={{
              lat: this.state.markerPosition.lat + 0.0018,
              lng: this.state.markerPosition.lng
            }}
          >
            <div>
              <span style={{ padding: 0, margin: 0 }}>
                {this.state.address}
              </span>
            </div>
          </InfoWindow>
        </GoogleMap>
      ))
    );
   
    let map;
    if (this.props.center.lat !== undefined) {
      map = (
        <div>
          <div>
          <div> <img  style={{marginLeft: "170px"}} src={`${this.props.pizza.image}`} alt="pizza-type"/> </div>
          <p style={{color: "red"}}>{this.state.responseMessage}</p>
          <div className="form-group">
              <label htmlFor="">Pizza</label>
              <input
                type="text"
                name="city"
                className="form-control"
                onChange={this.handleChange}
                readOnly="readOnly"
                value={this.props.pizza.name}
              />
            </div>

            <div className="form-group">
              <label htmlFor="">Price</label>
                <input
                  type="text"
                  name="price"
                  className="form-control"
                  onChange={this.handleChange}
                  readOnly="readOnly"
                  value={this.state.price}
                />

               
             </div>
           
             <div className="form-group">
              <label htmlFor="">Full name</label>
                <input
                  type="text"
                  name="full_name"
                  className="form-control"
                  onChange={this.handleChange}
                />
             </div>

             <div className="form-group">
              <label htmlFor="">Phone</label>
                <input
                  type="text"
                  name="phone"
                  maxLength={20}
                  className="form-control"
                  onChange={this.handleChange}
                 
                />
             </div>

              <div className="form-group">
              <label htmlFor="">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  min={1}
                  onChange={ event => this.handleChange(event)}
                  
                />
              <div className="form-group">
              <label htmlFor="">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  onChange={this.handleChange}
                />
             </div>
             <button className="mt-2 mb-5 form-group modal-fulfil-button" type="button" onClick={this.sendOrder}>Order</button>
          </div>
          </div>
          <p className="mt-5 mb-20" style={{color: "red", marginLeft: "170px"}}>{this.state.responseMessage}</p>
          <div className="mt-5 mb-20">
            <AsyncMap
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDTePHiX02RDQhPUlWV6ttVQHLyrPgHhdI&libraries=places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: this.props.height }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
          </div>
         
        </div>
      );
    } else {
      map = <div style={{ height: this.props.height }} />;
    }
    return map;
  }
}
export default OrderMap;
