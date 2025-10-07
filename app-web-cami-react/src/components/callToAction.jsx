import '../assets/css/componentsStyles/callToAction.css';

export default function CallToAction(){
    return(
         <div id="about">
          <div id="about2" className="contCall">
            <div className="about-wrapper">
              <div className="content" style={{ textAlign: 'center' }}>
                <h5 className="title mb-3">
                  Probas miles de looks y ninguno te convence? Amiga vos no sos el problema. Es porque todavía no descubriste lo que realmente te favorece.
                </h5>
                <button id="ctaBtn" className="btn btn-outline-primary btn-md">
                  Quiero descubrir mi mejor version
                </button>
              </div>
            </div>
          </div>
        </div>
    );
}