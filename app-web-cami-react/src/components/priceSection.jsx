
import '../assets/css/componentsStyles/priceSection.css';
import { useNavigate } from 'react-router-dom';
import OffIcon from "../assets/images/30OFFICON.PNG";

export default function PriceSection(){
      const  navigate = useNavigate();
    const handleClick = () => {
          navigate('/Payment');
        }
    return(
        <section id='priceSection' className="special-offer">
        <div className="card">
            <h2>Empezamos este camino juntas?</h2>
            <h4>Precio especial por este mes</h4>
            <img src={OffIcon}></img>
            <p>Así es amor, por única vez tenemos precio especial de preventa, que no te podés perder</p>
            <p className="price">De tanto a tanto</p>
                <button onClick={handleClick}>¡ Lo quiero !</button>
        </div>
        </section>
    );
}