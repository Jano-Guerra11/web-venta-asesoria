import mercadopago from "mercadopago";

// Configurar credenciales
mercadopago.configure({
  access_token: "TU_ACCESS_TOKEN"
});

// Endpoint para crear preferencia
app.post("/crear-preferencia", async (req, res) => {
  try {
    let preference = {
      items: [
        {
          title: "Nombre del producto",
          unit_price: 5000,
          quantity: 1,
        }
      ],
      back_urls: {
        success: "http://localhost:3000/success",
        failure: "http://localhost:3000/failure",
        pending: "http://localhost:3000/pending",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id }); // devolver el id de preferencia
  } catch (error) {
    res.status(500).send(error.message);
  }
});