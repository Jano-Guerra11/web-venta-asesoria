import fotoCami1 from '../assets/images/fotoCami1.jpeg';
import '../assets/css/componentsStyles/productSection.css';
import slideToPrice from '../assets/js/ProductSection';
import { useEffect } from 'react';

export default function ProductSection(){
    useEffect(()=>{
        slideToPrice();

    },[]);
    return(
        <section className="product2">
           
                <div className='contFoto'>
                    <img src={fotoCami1} alt='foto' className="product-img"></img>
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