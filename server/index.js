

import expres, { application, response } from "express";
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

/*
// ----- PayPal

const app2 = expres();
app2.use(bodyParser.json());

const clientId = "AXghLv9XucX3yktGqa-aaoFOyFbXXGtg2l_IIBiys8s-WPCaVFn8cKZtDnFT6yU3MKI2emT36CTd5rhn";
const secret = "EOGgIFjYnnNrQdU_MHyUpD9WewaBVYulZTlF3QT7zGONmo1gIYkNAxGtZWv5vJBlnJzbN8meEqNQNBhQ";
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


/*

mercado pago y paypal juntos (mp no anda)

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();
const port = 3000;

// Configuración de MercadoPago
const mpClient = new MercadoPagoConfig({
  accessToken: 'APP_USR-29ffc75f-b80c-41a5-bf68-be418939fb97',
});

// Configuración de PayPal
const PAYPAL_API = 'https://api-m.paypal.com'; // Usa el entorno correcto
const paypalAuth = {
  username: 'AXghLv9XucX3yktGqa-aaoFOyFbXXGtg2l_IIBiys8s-WPCaVFn8cKZtDnFT6yU3MKI2emT36CTd5rhn',
  password: 'EOGgIFjYnnNrQdU_MHyUpD9WewaBVYulZTlF3QT7zGONmo1gIYkNAxGtZWv5vJBlnJzbN8meEqNQNBhQ',
};

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Ruta de inicio
app.get('/', (req, res) => {
  res.send('Servidor activo');
});

// Crear preferencia de MercadoPago
app.post('/create-preference', async (req, res) => {
  try {
    const { title, quantity, price, email } = req.body;
    const preference = new Preference(mpClient);
    const result = await preference.create({
      body: {
        items: [
          {
            title,
            quantity: Number(quantity),
            unit_price: Number(price),
            currency_id: 'ARS',
          },
        ],
        external_reference: email,
        back_urls: {
          success: '',
          failure: '',
          pending: '',
        },
        auto_return: 'approved',
      },
    });
    res.json({ id: result.id });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).send('Error al crear preferencia');
  }
});

// Crear orden de PayPal
app.post('/create-order', async (req, res) => {
  try {
    const { price } = req.body;
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: price,
            },
          },
        ],
      },
      { auth: paypalAuth }
    );
    res.json({ id: response.data.id });
  } catch (error) {
    console.error('Error al crear orden de PayPal:', error);
    res.status(500).send('Error al crear orden de PayPal');
  }
});

// Capturar pago de PayPal
app.post('/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body;
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {},
      { auth: paypalAuth }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error al capturar pago de PayPal:', error);
    res.status(500).send('Error al capturar pago de PayPal');
  }
});

// Webhook de MercadoPago
app.post('/webhook', (req, res) => {
  const data = req.body;
  if (data.type === 'payment') {
    const payment = data.data;
    if (payment.status === 'approved') {
      console.log(`Pago aprobado para: ${payment.external_reference}`);
    } else {
      console.log(`Pago NO aprobado (status: ${payment.status}) para: ${payment.external_reference}`);
    }
  }
  res.sendStatus(200);
});

// Verificar pago desde frontend
app.get('/verify-payment/:preference_id', async (req, res) => {
  const { preference_id } = req.params;
  try {
    const payments = await mpClient.payment.search({
      qs: { external_reference: preference_id },
    });
    const approvedPayment = payments.results.find((p) => p.status === 'approved');
    if (approvedPayment) {
      res.json({ pagoExitoso: true, email: approvedPayment.payer?.email || preference_id });
    } else {
      res.json({ pagoExitoso: false });
    }
  } catch (error) {
    console.error('Error verificando pago:', error);
    res.status(500).json({ error: 'Error verificando pago' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});

*/