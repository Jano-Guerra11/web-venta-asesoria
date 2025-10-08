

import expres, { application, response } from "express";
import { config } from "dotenv";
import cors from "cors";

config();
// SDK de mercado pago
import {MercadoPagoConfig, Preference} from "mercadopago";



const client = new MercadoPagoConfig({
    accessToken:process.env.ACCES_TOKEN_MP,
});

const app = expres();
const port = 3000;

app.use(cors());
app.use(expres.json());

app.get("/",(req,res)=>{
    res.send("server activoo");
})

app.post("/create_preference",async (req,res)=> {
try{
    const body ={
        items: [
            {
                title: req.body.title,
                quantity: Number(req.body.quantity),
                unit_price: Number(req.body.price),
                currency_id: "ARS",
            },
        ],
        external_reference: req.body.email, // Asociamos el pago al usuario
        // urls a donde nos redirigira segun el caso
        back_urls: {
                success: "https://www.instagram.com/camila_guerraa/",
                failure: "",
                pending: "",
            },
             auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({body});
    res.json({
        id: result.id,        
    });


}catch(error){
    console.log(error);
}

})

app.listen(port, ()=>{
console.log("servidor corriendo en puerto "+port);
});

// Webhook de Mercado Pago para registrar pagos
app.post("/webhook", (req, res) => {
  const data = req.body;
  // data contiene información de pago
  if (data.type === "payment") {
    const payment = data.data;
    if (payment.status === "approved") {
      // Guardar en DB o memoria que el cliente pagó
        pagos[payment.external_reference] = {
        pagoExitoso: true,
        email: payment.payer?.email || payment.external_reference,
      };
      console.log(`Pago aprobado para: ${payment.external_reference}`);
    }else{
         console.log(`Pago NO aprobado (status: ${payment.status}) para: ${payment.external_reference}`);
    }
  }
  res.sendStatus(200);
});

// verificar pago desde frontend
// Endpoint en backend para validar pago
app.get("/verify_payment/:preference_id", async (req, res) => {
  const { preference_id } = req.params;

    // Revisamos primero en memoria
  if (pagos[external_reference]) {
      console.log(`Pago ya registrado en memoria para: ${external_reference}`);
    return res.json(pagos[external_reference]);
  }

  try {
    const payments = await client.payment.search({
      qs: { external_reference },
    });

     const approvedPayment = payments.results.find(
      (p) => p.status === "approved"
    );

     if (approvedPayment) {
      pagos[external_reference] = {
        pagoExitoso: true,
        email: approvedPayment.payer?.email || external_reference,
      };
        console.log(`Pago confirmado desde API para: ${external_reference}`);
      return res.json(pagos[external_reference]);
    }
       console.log(`No se encontró pago aprobado para: ${external_reference}`);
    res.json({ pagoExitoso: false });
  } catch (error) {
     console.log(`Error verificando pago para ${external_reference}:`, error);
    console.log(error);
    res.status(500).json({ error: "Error verificando pago" });
  }
});


/* ----------------------------------- pay pal  ----------------------------------------------------------------*/

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app2 = express();
app2.use(bodyParser.json());

// Usa tus credenciales de PayPal (usa sandbox para pruebas)
const PAYPAL_CLIENT_ID = process.env.VITE_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.VITE_PAYPAL_CLIENT_SECRET;

// Cambia según el entorno: sandbox o producción
const PAYPAL_API = "https://api-m.paypal.com"; 
// Para producción usa: "https://api-m.paypal.com"

// Crear orden
app2.post("/api/orders", async (req, res) => {
  try {
    const { cart } = req.body;

    // 1️⃣ Solicitar token de acceso
    const authResponse = await axios({
      url: `${PAYPAL_API}/v1/oauth2/token`,
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_SECRET,
      },
      data: "grant_type=client_credentials",
    });

    const accessToken = authResponse.data.access_token;

    // 2️⃣ Crear la orden
    const orderResponse = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "0.01", // reemplazar con total dinámico
            },
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json(orderResponse.data);
  } catch (error) {
    console.error("❌ Error al crear la orden:", error.response?.data || error);
    res.status(500).send("Error al crear la orden");
  }
});

// Capturar la orden
app2.post("/api/orders/:orderId/capture", async (req, res) => {
  const { orderId } = req.params;

  try {
    // Solicitar un token de acceso
    const authResponse = await axios({
      url: `${PAYPAL_API}/v1/oauth2/token`,
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_SECRET,
      },
      data: "grant_type=client_credentials",
    });

    const accessToken = authResponse.data.access_token;

    // Capturar el pago
    const captureResponse = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json(captureResponse.data);
  } catch (error) {
    console.error("❌ Error al capturar el pago:", error.response?.data || error);
    res.status(500).send("Error al capturar el pago");
  }
});

// verificar el estado de la orden

app2.get("/api/orders/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    // Solicitar un token de acceso
    const authResponse = await axios({
      url: `${PAYPAL_API}/v1/oauth2/token`,
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_SECRET,
      },
      data: "grant_type=client_credentials",
    });

    const accessToken = authResponse.data.access_token;

    // Obtener los detalles de la orden
    const orderResponse = await axios.get(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Verificar el estado de la orden
    const orderStatus = orderResponse.data.status;
    if (orderStatus === "COMPLETED") {
       res.status(200).send("Pago registrado");
      res.json({ message: "Pago completado exitosamente" });
    } else {
      res.status(200).send("Pago NO registrado");
      res.json({ message: "El pago no se ha completado" });
    }
  } catch (error) {
    console.error("❌ Error al verificar la orden:", error.response?.data || error);
    res.status(500).send("Error al verificar la orden");
  }
});


// register payment de paypal 
app2.post("/api/register_payment", (req, res) => {
  const { userId, paymentDetails } = req.body;
  // Lógica para registrar el pago en la base de datos
  res.status(200).send("Pago registrado");
});
