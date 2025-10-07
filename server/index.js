

import expres, { application, response } from "express";
import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
// SDK de mercado pago
import {MercadoPagoConfig, Preference} from "mercadopago";


const client = new MercadoPagoConfig({
    accessToken: "APP_USR-5095550430150103-093020-1b7ae50a8e044af3a1020d619d638888-775424071",
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
/* - -  PAYPAL -- */
/*
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 3000 } = process.env;

const base = "https://api-m.paypal.com";
const app2 = express();

app2.use(express.static("app-web-cami-react/dist"));

app2.use(express.json());

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};


const createOrder = async (cart) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log(
    "shopping cart information passed from the frontend createOrder() callback:",
    cart,
  );

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "0.01",
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};


const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

app.post("/api/orders", async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

// serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./app-web-cami-react/dist/index.html"));
});

*/

// ----- PayPal
/* 

const app2 = expres();
app2.use(bodyParser.json());

const clientId = "";
const secret = "";
const PayPal_API = 'https://api-m.paypal.com'; // live https://api-m.paypal.com


const auth = {
  username: clientId,
  password: secret,
  };


app2.post('/create-order', async (req, res) => {
  try {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: '0.01',
          },
        }],
      },
      { auth }
    );
    res.json({ id: response.data.id });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).send('Error al crear la orden');
  }
});

app.post('/capture-order', async (req, res) => {
  const { orderId } = req.body;

  try {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {},
      { auth }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error al capturar el pago:', error);
    res.status(500).send('Error al capturar el pago');
  }
});

 */

/* pay pal 2 */

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


