import '../assets/css/componentsStyles/PosterDiscount.css';
import { useState } from 'react';
import mobile from '../assets/images/MOBILEOFF.jpg';
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
            
            <img src={mobile} alt="fotoDelCartel"></img>
            <button onClick={() => setShowModal(false)} className="btn">
               Cerrar
           </button>
           
            </div> 
            
           
            </div>
            
        
            
        )}

    </div>
);

    
}