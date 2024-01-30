import {configureStore} from '@reduxjs/toolkit';
import CartReducer from './Features/CartSlice';
import AuthReducer from './Features/AuthSlice';
import GeneralReducer from './Features/GeneralSlice';
import RestaurantReducer from './Features/RestaurantSlice';
import ProfileReducer from './Features/ProfileSlice';
import OrderReducer from './Features/OrderSlice';
import PaymentReducer from './Features/PaymentSlice';
import ConfigReducer from './Features/ConfigSlice';

export const store = configureStore({
  reducer: {
    Config: ConfigReducer,
    Cart: CartReducer,
    Auth: AuthReducer,
    General: GeneralReducer,
    Restaurant: RestaurantReducer,
    Profile: ProfileReducer,
    Order: OrderReducer,
    Payment: PaymentReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
