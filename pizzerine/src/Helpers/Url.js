const baseUrl =  "http://localhost/pizzeria-api/public/api";
const iconUrl =  "http://localhost/pizzeria-api/public/storage/Icons";
const assetUrl_local =  "/assets/";
const stripePublicKey = "pk_test_N6y5hXHpI9GDfOa2VgHx53fI";
const googleMapsApiKey = "AIzaSyDTePHiX02RDQhPUlWV6ttVQHLyrPgHhdI";

const headers = {
    "Content-Type":"application/json",
    "Accept":"application/json",
    "Authorization":(localStorage.getItem('pizzeria.sanctum')) ? "Bearer "+ localStorage.getItem('pizzeria.sanctum'):"",
}
const imageHeaders = {
    "Content-Type":"multipart/form-data",
    "Authorization":(localStorage.getItem('pizzeria.sanctum')) ? "Bearer "+ localStorage.getItem('pizzeria.sanctum'):"",
}

let settings = { 
"baseUrl": baseUrl,
"headers": headers, 
"imageHeaders": imageHeaders,
"stripePublicKey": stripePublicKey, 
"googleMapsApiKey": googleMapsApiKey,
"iconUrl": iconUrl};

export default settings;
