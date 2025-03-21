import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";

// Admin
import productsReducer from "./reducers/admin/productSlice";

import ordersSlice from "./reducers/admin/ordersSlice";
import paymentsReducer from "./reducers/admin/paymentSlice";


// User
import userProductsReducer from "./reducers/user/userProductSlice";
import userOrderReducer from "./reducers/user/userOrdersSLice";
import cartReducer from "./reducers/user/cartSlice";
import addressReducer from "./reducers/user/addressSlice";

import buyNowReducer from "./reducers/user/buyNowSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,

    // User Side
    userProducts: userProductsReducer,
    userOrders: userOrderReducer,
    cart: cartReducer,
    address: addressReducer,
    buyNow: buyNowReducer,

    // Admin Side
    products: productsReducer,
    orders: ordersSlice,
    payments: paymentsReducer,


  },
});
