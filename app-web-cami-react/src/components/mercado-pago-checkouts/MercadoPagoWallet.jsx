import { initMercadoPago } from "@mercadopago/sdk-react";
import axios from "axios";
import React, { useEffect, useState } from "react";

const MercadoPagoWallet = () => {
    const [preferenceId,setPreferenceId] = useState(null);
    const publicKey = "APP_USR-1e9d8863-f71e-4ed5-9848-72168cb69f54";
    const createPreferenceIdEndpoint = "https://iifhv6si9g.execute-api.us-east-2.amazonaws.com/dev/mercadopago/create-preference-id";

    useEffect(()=>{
        if(!window.MercadoPago){
            initMercadoPago(publicKey,{locale:"es-AR"});
        }else{
            console.log("ya se inicializo");
        }
    },[]);

    const createPreferenceIdFromAPI = async () => {
        const response = await axios.post(createPreferenceIdEndpoint,{
            title:"Test",
            unit_price: 1000,
            quantity:1, 
        },
        {   
            headers:{
            "Content-Type": "aplication/json",
            },
        } 
    );
        if(response){
            console.log("-- "+response.data)
        }
    };

    return(
        <div>
           <button
           onClick={createPreferenceIdFromAPI}
           >
            pagar con mercado pago
           </button>
            </div>
    );
}

export default MercadoPagoWallet;