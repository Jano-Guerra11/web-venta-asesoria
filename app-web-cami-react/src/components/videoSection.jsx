"use client";

import { Navigate, useNavigate } from 'react-router-dom';
import '../assets/js/script.js';
import useVideo from "../assets/js/useVideo";

export default function VideoSection() {
        useVideo(); // funcionalidad js del video

        const handleClick = () => {
          navigate('/Product');
        }

  return (
    
    <div className="contenedorVideo">
      <div className="hero" id="heroSection">
        <h3>Título de la sección</h3>
        <p className="lead" style={{ marginBottom: '30px' }}>
          Descripción breve que explica el contenido del video y por qué es importante. El video se reproducirá automáticamente sólo cuando la sección entre en pantalla.
        </p>

        <div className="video-wrapper">
          <video
            id="heroVideo"
            data-src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            poster="https://images.unsplash.com/photo-1501973801540-537f08ccae7a?q=80&w=1200&auto=format&fit=crop"
            muted
            playsInline
            preload="none"
            controls
          >
            <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento video.
          </video>
        </div>

        <div className="actions">
          <a href='/Product'>

            <button className="btn btnAbajo" id="ctaBtn" value="Boton abajo">
              Descubri tu mejor version ya!
            </button>
        
          </a>
        </div>
      </div>
    </div>
  
    
  );
}