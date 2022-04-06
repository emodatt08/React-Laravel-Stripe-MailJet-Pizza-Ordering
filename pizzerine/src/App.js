import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Menu from './components/Menu/Menu';
import Footer from './components/Footer/Footer';
import Admin from './components/Admin/Admin';
import AdminOrders from './components/Admin/AdminOrders';
import AdminLogout from './components/Admin/AdminLogout';
import StripeContainer from './components/Checkout/StripeContainer';
import AdminPizzaTypes from './components/Admin/AdminPizzaTypes';


function App() {
  return (
    <div className="App">
      <Router>
         <Navbar />
         <Routes>
           <Route exact path="/"  element={<Home />}/>
           <Route  path="/about"  element={<About />}/>
           <Route  path="/contact"  element={<Contact />}/>
           <Route  path="/menu"  element={<Menu />}/>
           <Route  path="/admin"  element={<Admin />}/>
           <Route  path="/all/orders"  element={<AdminOrders />}/>
           <Route  path="/pizza/types"  element={<AdminPizzaTypes />}/>
           <Route  path="/checkout/"  element={<StripeContainer />}/>
           <Route  path="/logout/"  element={<AdminLogout />}/>
           
         </Routes>
         <Footer />
      </Router>
  
      
    </div>
  );
}

export default App;
