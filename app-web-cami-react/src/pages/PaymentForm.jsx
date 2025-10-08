import { MercadoPagoInstance } from '@mercadopago/sdk-react/esm/mercadoPago/initMercadoPago';
import '../assets/css/PaymentStyles.css';
//import MercadoPagoWallet from '../components/mercado-pago-checkouts/MercadoPagoWallet';
//import '../assets/css/componentsStyles/fondoAnimado.css';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

import axios from 'axios';
import { useState } from 'react';
import PaypalWallet from '../components/paypal-checkout/PaypalWallet';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PayPalButton from '../components/paypalButton';
import { useNavigate } from 'react-router-dom';

function Message({ content }) {
  return <p>{content}</p>;
}



export default function PaymentForm(){

  const navigate = useNavigate();

   const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    "enable-funding": "paylater,venmo",
    "data-sdk-integration-source": "integrationbuilder_sc",
  };
  const [message, setMessage] = useState("");
const[mail,setMail]= useState("");

  const handleEmailChange = (e) => {
    setMail(e.target.value);
  };


const [preferenceId,setPreferenceId] = useState(null);
const [clickPaypal,setClickPaypal] = useState(false);
initMercadoPago(import.meta.env.VITE_PUBLIC_KEY_MP,{locale: "es-AR",});


const createPreference = async () => {
    try{
        // mp crea una referencia en base a los datos del producto
        const response = await axios.post("http://localhost:3000/create_preference",{
            title: "Asesoria de moda",
            quantity: 1,
            price:1,
        });
        // y nos devuelve un id 
        const {id} = response.data;
        return id;
    }catch(error){
        console.log("error en create preference de mp ");
        console.log(error);
    }
}

const handleBuy = async () => {
    const id = await createPreference();
    if(id){
        setPreferenceId(id);
    }
}
const handlePayPal = ()=>{
  console.log("click paypal ",clickPaypal);
  setClickPaypal(true);
}

    


    // payPal 
  // handleApprove atravez de localStorage, no recomendado, poco seguro
  
  
  const handleApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      // Verificar si el pago fue exitoso
      if (details.status === "COMPLETED") {
        // Guardar en localStorage que el pago fue exitoso
        localStorage.setItem("paymentCompleted", "true");
        navigate(`/SuccesPage?mail=${encodeURIComponent(mail)}&pago=${import.meta.env.VITE_CLAVE_CONFIRMACION_PAGO}`);
      } else {
        // Manejar el caso de pago no completado
      alert("El pago no se completó correctamente.");
    }
  });
};


// handle approve, consultando al back si el pago fue exitoso, seguro
/*
const handleApprove = (data, actions) => {
  return actions.order.capture().then((details) => {
    if (details.status === "COMPLETED") {
      // Enviar solicitud al backend para registrar el pago
      fetch("http://localhost:3000/api/register_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "usuario123",
          paymentDetails: details,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Pago registrado") {
            navigate(`/SuccesPage?mail=${encodeURIComponent(mail)}&pago=${import.meta.env.VITE_CLAVE_CONFIRMACION_PAGO}`);
          }
        });
    } else {
      alert("El pago no se completó correctamente.");
    }
  });
};
  
*/
    return(
          
        <div className="payment">
            <div className="data">

                <label for="nombre">Nombre Completo:</label>
                <input type="text" id="nombre" name="nombre" required  />

                <label for="email">Correo Electrónico (Gmail):</label>
                <input onChange={handleEmailChange} 
                type="email" id="email" name="email" required  pattern="[a-zA-Z0-9._%+-]+@gmail\.com" title="Por favor, ingrese un correo electrónico válido de Gmail."/>

                

            </div>
            <div className="productoContainer">
                <div className="product">
                   
                     <h3>Nombre del Producto</h3>
                        <p className="price">$99.99</p>
                </div>
                        <button onClick={handleBuy} className="medio">Mercado pago</button>
                        <button onClick={handlePayPal} className="medio">Paypal</button>
                        
                        {preferenceId &&  <Wallet initialization={{preferenceId: preferenceId}}/>}

                         {/*clickPaypal && <PayPalButton></PayPalButton> */}
                         {clickPaypal && <PayPalButtons style={{layout:"horizontal"}}
                         onApprove={handleApprove}
                         ></PayPalButtons> }
                      
                       {/*
                       <div className="App">
                             <PayPalScriptProvider options={initialOptions}>
                               <PayPalButtons
                                 style={{
                                   shape: "rect",
                                   //color:'blue' change the default color of the buttons
                                   layout: "vertical", //default value. Can be changed to horizontal
                                 }}
                                 createOrder={async () => {
                                   try {
                                     const response = await fetch("/api/orders", {
                                       method: "POST",
                                       headers: {
                                         "Content-Type": "application/json",
                                        },
                                       // use the "body" param to optionally pass additional order information
                                       // like product ids and quantities
                                       body: JSON.stringify({
                                         cart: [
                                           {
                                             id: 1,
                                             quantity: 1,
                                           },
                                         ],
                                       }),
                                     });
                       
                                     const orderData = await response.json();
                       
                                     if (orderData.id) {
                                       return orderData.id;
                                     } else {
                                       const errorDetail = orderData?.details?.[0];
                                      const errorMessage = errorDetail
                                         ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                                         : JSON.stringify(orderData);
                       
                                       throw new Error(errorMessage);
                                     }
                                    } catch (error) {
                                     console.error(error);
                                     setMessage(`Could not initiate PayPal Checkout...${error}`);
                                   }
                                  }}
                                  onApprove={async (data, actions) => {
                                   try {
                                     const response = await fetch(
                                       `/api/orders/${data.orderID}/capture`,
                                       {
                                         method: "POST",
                                         headers: {
                                           "Content-Type": "application/json",
                                         },
                                       },
                                     );
                       
                                     const orderData = await response.json();
                                     // Three cases to handle:
                                     //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                                     //   (2) Other non-recoverable errors -> Show a failure message
                                     //   (3) Successful transaction -> Show confirmation or thank you message
                       
                                     const errorDetail = orderData?.details?.[0];
                       
                                     if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                                       // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                                       // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                                       return actions.restart();
                                     } else if (errorDetail) {
                                       // (2) Other non-recoverable errors -> Show a failure message
                                       throw new Error(
                                         `${errorDetail.description} (${orderData.debug_id})`,
                                       );
                                     } else {
                                       // (3) Successful transaction -> Show confirmation or thank you message
                                      // Or go to another URL:  actions.redirect('thank_you.html');
                                       const transaction =
                                         orderData.purchase_units[0].payments.captures[0];
                                       setMessage(
                                         `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`,
                                       );
                                       console.log(
                                         "Capture result",
                                         orderData,
                                         JSON.stringify(orderData, null, 2),
                                       );
                                     }
                                   } catch (error) {
                                     console.error(error);
                                     setMessage(
                                       `Sorry, your transaction could not be processed...${error}`,
                                     );
                                   }
                                 }}
                               />
                             </PayPalScriptProvider>
                             <Message content={message} />
                           </div>
                                       */ }
            </div>
        </div>

    );

}