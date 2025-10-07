import fotoCami2 from '../assets/images/fotoCami2.jpg';

export default function AboutMe(){
    
    return(
        <section id="aboutMe">
          <div className="container">
            <div className="row justify-content-between align-items-center">
              <div className="col-md-6">
                <div className="img-wrapper">
                  <div className="after"></div>
                  <img src={fotoCami2} className="w-100" alt="About Me" />
                </div>
              </div>
              <div className="col-md-5">
                <h6 className="title mb-3">SOBRE MI</h6>
                <p style={{color:"white"}}>Soy Cami Guerra, estilista y creadora de contenido. Mi propósito es ayudarte a descubrir qué te favorece y a construir una imagen con la que te sientas cómoda, segura y auténtica.</p>
                <p className="text-muted">Creo que la moda no es seguir tendencias, sino una herramienta para expresar quién sos y potenciar tu mejor versión.</p>
              </div>
            </div>
          </div>
        </section>
    );
}