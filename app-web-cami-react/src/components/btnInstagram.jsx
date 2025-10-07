import '../assets/css/componentsStyles/btnInstagram.css';
import logoInstagram from"../assets/images/logoInstagram.png";

export default function BtnInstagram ()  {
    return(

        <a href="https://www.instagram.com/camila_guerraa" className="btn-instagram" target="_blank" rel="noopener">
          <img style={{width:"100px",height:"100px"}} src={logoInstagram}>
          </img>
        </a>
    );
}

