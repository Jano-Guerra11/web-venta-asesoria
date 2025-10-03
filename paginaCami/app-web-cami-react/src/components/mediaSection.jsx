import React from 'react';

import '../assets/css/styles.css';

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
                        <div className="testmonial-wrapper-ig">
                        <img
                            src={`/assets/imgs/avatar2.jpg"`}
                            alt={`instagram`}
                            
                            />
                        <h6 className="title mb-3">Instagram</h6>
                        <p className="nombreUsuario">@nombre_usuario</p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.
                        </p>
                        <div className="infos">
                            <ul className="stats">
                            <li>
                                <h3>55K</h3>
                                <h4>Seguidores</h4>
                            </li>
                            <li>
                                <h3>500</h3>
                                <h4>Publicaciones</h4>
                            </li>
                            </ul>
                            <div className="links">
                            <button className="btnRedes">
                                <i className="fab fa-instagram"></i>
                                Seguir
                            </button>
                            <button className="btnRedes">Ver perfil</button>
                            </div>
                        </div>
                        </div>
                 </div>
                  <div className="col-12 col-md-6 m-auto">
                        <div className="testmonial-wrapper-tik">
                        <img
                            src={`/assets/imgs/avatar1.jpg`}
                            alt={`TikTok Avatar`}
                            width={100}
                            height={100}
                            className="rounded-circle"
                            />
                        <h6 className="title mb-3">TikTok</h6>
                        <p className="nombreUsuario">@nombre_usuario</p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.
                        </p>
                        <div className="infos">
                            <ul className="stats">
                            <li>
                                <h3>130K</h3>
                                <h4>Seguidores</h4>
                            </li>
                            <li>
                                <h3>1000</h3>
                                <h4>Publicaciones</h4>
                            </li>
                            </ul>
                            <div className="links">
                            <button className="btnRedes">
                                <i className={`fab fa-tiktok`}></i>
                                Seguir
                            </button>
                            <button className="btnRedes">Ver perfil</button>
                            </div>
                        </div>
                        </div>
                 </div>
              </div>
           </div>
        </section>

    );
}