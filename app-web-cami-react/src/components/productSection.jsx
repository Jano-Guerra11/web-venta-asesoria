import fotoCami1 from '../assets/images/fotoCami1.jpeg';
import mobile from '../assets/images/productMOBILE.jpg';
import '../assets/css/componentsStyles/productSection.css';
import slideToPrice from '../assets/js/ProductSection';
import { useEffect,useState } from 'react';

export default function ProductSection(){
 const [imageToUse, setImageToUse] = useState(mobile);

    useEffect(()=>{
        slideToPrice();


         function handleResize() {
            const w = window.innerWidth;
            let newImage;
            // 504
            if (w <= 600) {
              newImage = mobile;
            } else if (w <= 420) {
              newImage = mobile;
            } else if (w <= 1150) {
              newImage = fotoCami1;
            } else{
              newImage = fotoCami1;
            }
        
            console.log("Resolución:", w, "=> imagen seleccionada:", newImage);
            setImageToUse(newImage);
          }
        
          handleResize();
          window.addEventListener('resize', handleResize);
          return () => {
            window.removeEventListener('resize', handleResize);
          };

    },[]);
    return(
        <section className="product2">
           
                <div className='contFoto'>
                    <img src={imageToUse} alt='foto' className="product-img"></img>
                </div>
                <div className='textYButton'>
                    <h3 id="prSectionH3">Programa para descubrirte y empezar a explotar al maximo tu imagen personal</h3>
                        <a href='#priceSection' id="linkToPrice">
                      <button className="btn btn-primary mt-3">Inscribite antes que nadie !</button>
                        </a>
                </div>
            
        </section>
    );
    
    
}