import React from "react";
import "../assets/css/componentsStyles/SuccesPage.css";

const SuccessPage = ({ email }) => {

 const [loading, setLoading] = useState(true);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const navigate = useNavigate();

  const handleVolver = () => {
    // Redirige al home o a otra página
    window.location.href = "/";
  };

   useEffect(() => {
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
