import { PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = () => {
  const handleApprove = async (data, actions) => {
    const orderId = data.orderID;

    try {
      const response = await fetch('/capture-order', {
        method: 'POST',
        body: JSON.stringify({ orderId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.status === 'COMPLETED') {
        alert('Pago realizado con éxito');
      } else {
        alert('Error al procesar el pago');
      }
    } catch (err) {
      console.error('Error al capturar el pago:', err);
    }
  };

  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '0.01',
            },
          }],
        });
      }}
      onApprove={handleApprove}
    />
  );
};

export default  PayPalButton;