import React from 'react';

import '../assets/css/styles.css';
import BtnInstagram from '../components/btnInstagram';
import BtnTikTok from './BtnTikTok';

export default function MediaSection(){
    return(
        <section className="text-center pt-5" id="testmonial">
          <div className="container">
            <h3 className="mt-3 mb-5 pb-5" style={{ color: 'white' }}>
              Para más contenido de moda... <br />
              ¡Sígueme en mis redes!
            </h3>
           
            <div className="row">
                 <div className="col-12 col-md-6 m-auto">
                      <BtnInstagram></BtnInstagram>  
                 </div>
                  <div className="col-12 col-md-6 m-auto">
                        <BtnTikTok></BtnTikTok>
                 </div>
              </div>
           </div>
        </section>

    );
}