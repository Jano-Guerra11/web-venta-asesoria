import CallToAction from '../components/callToAction';
import AboutMe from '../components/aboutMeSection';
import VideoSection from '../components/videoSection';
import MediaSection from '../components/mediaSection';
import '../assets/css/componentsStyles/home.css';
import imagenDesktop from '../assets/images/Banner_Home_DESKTOP2.jpg';
import imagenMid from '../assets/images/Banner_Home_DESKTOP3.png';
import imagenMobile from '../assets/images/Banner_Home_MOBILE.jpg';
import imagenMobile2 from '../assets/images/Banner_Home_MOBILE2.jpg';

import { useEffect,useState } from 'react';
export default function Home(){
 const [imageToUse, setImageToUse] = useState(imagenDesktop);

  useEffect(() => {
  function handleResize() {
    const w = window.innerWidth;
    let newImage;
    // 504
    if (w <= 600 && w >= 421) {
      newImage = imagenMobile;
    } else if (w <= 420) {
      newImage = imagenMobile2;
    } else if (w <= 1150) {
      newImage = imagenMid;
    } else{
      newImage = imagenDesktop;
    }

    console.log("Resolución:", w, "=> imagen seleccionada:", newImage);
    setImageToUse(newImage);
  }

  handleResize();
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);


    return(
        <>
    
       {/* <header id="home" className="header">*/}
       <div className='header'>
           <img src={imageToUse} alt="" class="header-img"></img>

       </div>
           
         
        {/*</header>*/}
        <CallToAction/>

        
        <AboutMe/>
     
        <VideoSection/>


        {/* Sección de Testimonios }
        <section className="text-center pt-5" id="testmonial">
        <div className="container">
        <h3 className="mt-3 mb-5 pb-5" style={{ color: 'white' }}>
        Para más contenido de moda... <br />
        ¡Sígueme en mis redes!
            </h3>
            <div className="row">
            
            </div>
            </div>
            </section>
            {*/}
      <MediaSection
        platform="Instagram"
        avatar="avatar2.jpg"
        username="nombre_usuario"
        followers="55K"
        posts="1000"
        />
     
      
    </>  
);
}