import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart';

const store = configureStore({
  reducer: {
    cart: cartReducer, // Include the cart reducer
  },
});

export default store;
