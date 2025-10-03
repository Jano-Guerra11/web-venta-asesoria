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
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae autem rem impedit molestiae hic ducimus, consequuntur ullam dolorem quaerat beatae labore explicabo, sint laboriosam aperiam nihil inventore facilis. Quasi, facilis.</p>
                <p className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, amet!</p>
              </div>
            </div>
          </div>
        </section>
    );
}