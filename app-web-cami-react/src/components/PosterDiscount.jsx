import '../assets/css/componentsStyles/PosterDiscount.css';
import { useState } from 'react';
import fotoCami1 from '../assets/images/fotoCami1.jpeg';
export default function PosterDiscount(){

    const [showModal, setShowModal] = useState(true);

    /* 
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true); // aparece después de 1 segundo
    }, 1000); // 1000 ms = 1 segundo

    return () => clearTimeout(timer); // limpieza del timer al desmontar
  }, []);
  */

    return(
    <div>

        { showModal && (
            
            <div className="posterContainer">
            <div className="row poster">
            <div className="col-12">
            <img src={fotoCami1} alt="fotoDelCartel"></img>
            </div> 
            <div className="col-12">
           
            </div>
            <div className="col-12">
             <button onClick={() => setShowModal(false)} className="btn">
                Cerrar
            </button>
            </div>
            </div>
            </div>
        )}

    </div>
);

    
}