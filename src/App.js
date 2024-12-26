import logo from './logo.svg';
import './App.css';

import "./assets/css/theme.css";
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetail from './pages/Productdetail';
import "./assets/css/theme.css";
import Footer from './components/Footer';
import Checkout from './components/Checkout';
// import "./assets/css/theme-rtl.css";


function App() {  
  return (
    <>
      <div className='main' id='top'>
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            
              <Route path='/product/:productID' element={<ProductDetail />} />
             
              <Route path='/checkout' element={<Checkout />} />
          </Routes>
        </Router>


       

       <Footer />


      </div>
    </>
  );
}

export default App;
