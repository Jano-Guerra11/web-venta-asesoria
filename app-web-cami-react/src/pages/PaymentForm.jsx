import { MercadoPagoInstance } from '@mercadopago/sdk-react/esm/mercadoPago/initMercadoPago';
import '../assets/css/PaymentStyles.css';
//import MercadoPagoWallet from '../components/mercado-pago-checkouts/MercadoPagoWallet';
//import '../assets/css/componentsStyles/fondoAnimado.css';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';
import { useState } from 'react';

export default function PaymentForm(){

const [preferenceId,setPreferenceId] = useState(null);

initMercadoPago('APP_USR-29ffc75f-b80c-41a5-bf68-be418939fb97',{locale: "es-AR",});


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
        console.log(error);
    }
}

const handleBuy = async () => {
    const id = await createPreference();
    if(id){
        setPreferenceId(id);
    }
}


    const product = {
        title : "Ejemplo",
        description: "esta es una descripcion del producto",
        price: 50,
        image: "urlImagen"
    };

    return(
        <div className="payment">
            <div className="data">

                <label for="nombre">Nombre Completo:</label>
                <input type="text" id="nombre" name="nombre" required  />

                <label for="email">Correo Electrónico (Gmail):</label>
                <input type="email" id="email" name="email" required  pattern="[a-zA-Z0-9._%+-]+@gmail\.com" title="Por favor, ingrese un correo electrónico válido de Gmail."/>

                

            </div>
            <div className="productoContainer">
                <div className="product">
                   
                     <h3>Nombre del Producto</h3>
                        <p className="price">$99.99</p>
                </div>
                        <button onClick={handleBuy} className="medio">Mercado pago</button>
                        <button className="medio">Paypal</button>
                        
                        {preferenceId &&  <Wallet initialization={{preferenceId: preferenceId}}/>}
                       
            </div>
        </div>

    );
}