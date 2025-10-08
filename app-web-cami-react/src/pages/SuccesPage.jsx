import React from "react";
import "../assets/css/componentsStyles/SuccesPage.css";

import { useState, useEffect } from "react";
import {useNavigate,useSearchParams } from 'react-router-dom';

const SuccessPage = ({ email }) => {
  const [searchParams] = useSearchParams();
const mail = searchParams.get('mail');
  const pago = searchParams.get('pago');
 const [loading, setLoading] = useState(true);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const navigate = useNavigate();

  const handleVolver = () => {
    // Redirige al home o a otra página
    window.location.href = "/";
  };
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handlePago = async (pago) => {
    if (pago !== import.meta.env.VITE_CLAVE_CONFIRMACION_PAGO) {
      navigate('/');
    } else {
      console.log('Pago realizado con PayPal ---');
      await sleep(10000); // Pausa de 3 segundos
      // Aquí puedes agregar la lógica que deseas ejecutar después de la pausa
    }
  };

   useEffect(() => {
 // ------ paypal --------- 
handlePago(pago);

    // ---- mercado pago ---------
    // Consultamos al backend si el usuario pagó
    fetch(`http://localhost:3000/verify_payment/${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.pagoExitoso) {
          setPagoExitoso(true);
        } else {
          // Si no pagó, redirigimos al home
          navigate("/", { replace: true });
        }
      })
      .catch(() => navigate("/", { replace: true }))
      .finally(() => setLoading(false));

 
      // ------ paypal --------- 

  }, [email, navigate]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="success-container">
      <div className="success-card">
        <h1>🎉 ¡Felicitaciones!</h1>
        <p className="success-message">
          Diste el primer paso para dominar tu estilo
        </p>
        <p className="success-description">
          Te enviamos un mail a <strong>{email}</strong> con el link para el acceso.
        </p>
        <button className="volver-btn" onClick={handleVolver}>
          Volver
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
