import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import logo from "../assets/img/gallery/logo.png";
import axios from 'axios';
import { addToCart, dincrease, increase } from '../store/cart';

// Stripe public key
const stripePromise = loadStripe('pk_test_51QTfo9HDNjmPRhRljh1Ho2ZtTj7hDzC2BnJniUeThlyJ2TQ7ttnq3VJDAULdJlbodNjz7hL8JqjEDLy4mfMdLM8u00WYusD6Pv');
const stripe = require('stripe')('sk_test_51QTfo9HDNjmPRhRl9FiKCCQJlkWuPJFeAdggroEz64XE9OWXtCLItOxW9D4CpKLuCv2fozsCUjCznc7TussWmFFk00QauA8yAr')

const Navbar = () => {
  const dispatch = useDispatch();
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const cartItems = useSelector(state => state.cart.items);
  const [count, setCount] = useState(0); // State to track the count

  // Sync cart items and calculate total quantity and price
  useEffect(() => {
    const quantity = cartItems.reduce((acc, product) => acc + product.quantity, 0);
    const price = cartItems.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    setTotalQuantity(quantity);
    setTotalPrice(price);
  }, [cartItems]);

  const addItem = (product) => {
    dispatch(increase(product));
  };

  const substractItem = (product) => {
    dispatch(dincrease(product));
  };

  const proceedToPayment = async () => {
    // const stripe = await stripePromise;
    const paymentData = {
      mode: 'payment',
      success_url: `${window.location.origin}/success`,
      cancel_url: `${window.location.origin}/cancel`,
    };

    // Generate price data for each cart item
    const priceRequests = cartItems.map(async (item) => {
      const priceResponse = await stripe.prices.create({
        currency: 'usd',
        unit_amount: (item.price * 100),
        product_data: {
          name: item.title
        }
      });;
      return { price: priceResponse.id, quantity: item.quantity };
    });

    // Wait for all price data to be created
    const lineItems = await Promise.all(priceRequests);
    console.log(lineItems);
    lineItems.forEach(async (item, index) =>  {
      paymentData[`line_items[${index}][price]`] = item.price;
      paymentData[`line_items[${index}][quantity]`] = item.quantity;
    });;

    return paymentData;
  };

  const proceedToCheckout = async () => {
    try {
      // Generate payment data
      const paymentData = await proceedToPayment();

      // Create a checkout session
      const sessionResponse = await axios.post(
        'https://api.stripe.com/v1/checkout/sessions',
        new URLSearchParams({
          ...paymentData,
        }),
        {
          headers: {
            'Authorization': `Bearer sk_test_51QTfo9HDNjmPRhRl9FiKCCQJlkWuPJFeAdggroEz64XE9OWXtCLItOxW9D4CpKLuCv2fozsCUjCznc7TussWmFFk00QauA8yAr`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const session = sessionResponse.data;

      if (session.id) {
        const stripePB = await stripePromise;
        const { error } = await stripePB.redirectToCheckout({
          sessionId: session.id, // Redirect to Stripe Checkout
        });

        if (error) {
          console.error('Stripe checkout error:', error);
        }
      }
    } catch (error) {
      console.error('Error during checkout process:', error);
    }
  };


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light fixed-top py-3">
        <div className="container">
          <a className="navbar-brand d-inline-flex" href="index.html">
            <img className="d-inline-block" src={logo} alt="logo" />
            <span className="text-1000 fs-0 fw-bold ms-2">Majestic</span>
          </a>
          <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item px-2"><a className="nav-link" href="#categoryWomen">Women</a></li>
              <li className="nav-item px-2"><a className="nav-link" href="#header">Men</a></li>
              <li className="nav-item px-2"><a className="nav-link" href="#collection">Collection</a></li>
              <li className="nav-item px-2"><a className="nav-link" href="#outlet">Outlet</a></li>
            </ul>
            <div className="d-flex">
              <a className="text-1000 position-relative" href="#!" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart">
                <svg className="feather feather-shopping-cart me-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {totalQuantity > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.75rem' }}>
                    {totalQuantity}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Offcanvas Cart Popup */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasCart" aria-labelledby="offcanvasCartLabel">
        <div className="offcanvas-header">
          <h5 id="offcanvasCartLabel">Shopping Cart</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          {cartItems.length > 0 ? (
            <div>
              <ul className="list-group">
                {cartItems.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                      <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover' }} className="me-2" />
                      <div>
                        <h6>{item.title}</h6>
                        <small>Quantity: {item.quantity}</small>
                      </div>
                    </div>
                    <span className="badge bg-primary rounded-pill">${(item.price * item.quantity).toFixed(2)}</span>
                    <button
          onClick={() => substractItem(item)}
        
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          -
      
         </button>
         <p>{ item.quantity }</p>
         <button
          onClick={() => addItem(item)}
          style={{
            padding: '10px 20px',
            backgroundColor: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          +
      
         </button>
                  </li>
                  
                ))}
              </ul>
              <hr />
              <div className="d-flex justify-content-between">
                <h6>Total Quantity: {totalQuantity}</h6>
                <h6>Total Price: ${totalPrice.toFixed(2)}</h6>
              </div>
              <button className="btn btn-success mt-3" onClick={proceedToCheckout}>Proceed to Payment</button>
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
          <button className="btn btn-danger mt-3" data-bs-dismiss="offcanvas">Close</button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
