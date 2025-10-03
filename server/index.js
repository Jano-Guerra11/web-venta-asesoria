import expres from "express";
import cors from "cors";

// SDK de mercado pago
import {MercadoPagoConfig, Preference} from "mercadopago";
import SuccessPage from "../app-web-cami-react/src/pages/SuccesPage";

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
                success: "",
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