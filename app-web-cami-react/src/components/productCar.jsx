 const ProductCard = ({product}) => {
    return(
        <div className="product-car">
            <img className="product-image"></img>
            <div className="product-info">
                <h2 className="product-title">{product.title}</h2>
                <p className="product-description">{product.description}</p>
                <span className="product-price">{product.price}</span>
            </div>
        </div>
    );
}
export default  ProductCard;