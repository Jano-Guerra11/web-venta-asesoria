import '../assets/css/componentsStyles/btnInstagram.css';
import logoTik from"../assets/images/tiktokLogo.png";

export default function BtnTikTok ()  {
    return(

        <a href="https://www.tiktok.com/@cam.guerra?_t=ZM-90KZLvh0iXD&_r=1" className="btn-instagram" target="_blank" rel="noopener">
          <img style={{width:"140px",height:"140px"}} src={logoTik}>
          </img>
        </a>
    );
}

