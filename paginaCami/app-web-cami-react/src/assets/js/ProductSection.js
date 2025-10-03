
export default function slideToPrice(){

    document.getElementById('linkToPrice').addEventListener('click', function(event) {
        event.preventDefault();  // evitar el salto instantáneo por defecto
        const destino = document.getElementById('priceSection');
        destino.scrollIntoView({ behavior: 'smooth' });
    });
}