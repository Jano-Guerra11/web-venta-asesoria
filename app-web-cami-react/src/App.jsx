import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
//import '../src/assets/css/styles.css';
//import '../src/assets/css/creative-design.css';

import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import PaymentForm from './pages/PaymentForm.jsx';
import SuccessPage from './pages/SuccesPage.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <PayPalScriptProvider options={{ "client-id": "AXghLv9XucX3yktGqa-aaoFOyFbXXGtg2l_IIBiys8s-WPCaVFn8cKZtDnFT6yU3MKI2emT36CTd5rhn" }}>
            
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Product" element={<Product/>}/>
        <Route path="/Payment" element={<PaymentForm/>}/>
        <Route path="/SuccesPage" element={<SuccessPage/>}/>
      </Routes>
    </Router>
          </PayPalScriptProvider>
  )
}

export default App
