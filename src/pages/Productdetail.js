import React from 'react';
import Navbar from '../components/Navbar';
import { addToCart, removeFromCart, toggleStatusTab, increase, dincrease } from '../store/cart';
import { useDispatch, useSelector } from 'react-redux';

const ProductDetail = () => {
  const product = {
    id: 1,
    name: "Modern Chair",
    description: "A comfortable and stylish modern chair, perfect for your home office or living room.",
    price: 199.99,
    image: "https://via.placeholder.com/400",
    features: ["Ergonomic design", "Durable materials", "Available in multiple colors"],
  };

  const dispatch = useDispatch();
  const { items, totalQuality, totalAmount, statusTab} = useSelector(
    (state) => state.cart
  );

  const handleAddToCart = (item) => {
    console.log("Handle Button");
    // dispatch(addToCart(item));
  }

  const handleRemoveToCart = (id) => {
    // dispatch(removeFromCart(id));
  }

  return (

	<>
		<Navbar />
    <div className="container py-5 mt-5">
		
		
      <div className="row">
        {/* Product Image */}
        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded shadow"
          />
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <h1 className="display-5">{product.name}</h1>
          <p className="text-muted">{product.description}</p>
          <h3 className="text-primary">${product.price.toFixed(2)}</h3>
          
          {/* Features */}
          <ul className="list-unstyled my-3">
            {product.features.map((feature, index) => (
              <li key={index}>
                <i className="bi bi-check-circle text-success me-2"></i>
                {feature}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="mt-4">
            <button className="btn btn-primary btn-lg me-2" onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
            <button className="btn btn-primary btn-lg me-2" onClick={() => handleRemoveToCart(product.id)}>
              Remove from cart
            </button>
            <button className="btn btn-outline-secondary btn-lg">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
	</>
  );
};

export default ProductDetail;
