import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {SingleAddress} from './ProfileSlice';
import {Customization} from './RestaurantSlice';
import axios from 'axios';
import {AppConfig} from '../../Config/appConfig';
import {navigate} from '../../Utils/NavigationUtils';
import {clearCart} from './CartSlice';
import {openRazorpay} from '../../Utils/PaymentUtils';
import {generatePaymentOrder, savePayment} from './PaymentSlice';
import {RootState} from '../store';

export interface createOrderProps {
  mode: 'CASH' | 'ONLINE';
}

export interface Paymentprops {
  mode: 'CASH' | 'ONLINE';
  payment: string | null;
  status: 'pending' | 'paid';
}
export interface updateorderProps {
  orderId: string;
  payment: Paymentprops;
}

export interface OrderState {
  newOrder: {
    order: {
      address: SingleAddress;
      restaurant: string;
      payment: Paymentprops;
      item: {
        food: String;
        customisation: Customization;
      };
    } | null;
    error: any | null;
    loading: boolean;
  };
}
const initialState: OrderState = {
  newOrder: {
    order: null,
    error: null,
    loading: false,
  },
};

export const orderFlow = createAsyncThunk(
  'order/flow',
  async (orderReq: createOrderProps, {rejectWithValue, getState, dispatch}) => {
    try {
      const state = getState() as RootState;
      const token = state?.Auth?.token;

      //creating order
      const {payload: createdOrder} = await dispatch(
        createOrder({mode: orderReq.mode}),
      );

      //if Paymen tis online mode, ask for payment and update order
      let newOrder;
      if (createdOrder?.payment?.mode === 'ONLINE') {
        //generating Payment order
        const generatedPaymentorder: any = await dispatch(
          generatePaymentOrder({amount: 100}),
        );
        if (generatedPaymentorder.meta.requestStatus === 'rejected') {
          return rejectWithValue(
            'Error generating payment order. Please try again.',
          );
        }
        //Prompt payment gateway
        const payerData = {
          name: state.Auth.user.name,
          email: state.Auth.user.email,
          contact: state.Auth.user.phone_number,
        };
        const paymentResponse: any = await openRazorpay({
          orderId: generatedPaymentorder?.payload.order.id,
          prefill: payerData,
        });

        //Saving payment after succession
        const {payload: savePaymentToDb} = await dispatch(
          savePayment({
            order_id: paymentResponse.razorpay_order_id,
            payment_id: paymentResponse.razorpay_payment_id,
            amount: generatedPaymentorder?.payload?.order?.amount,
          }),
        );

        //updating order
        const updatedOrder = await dispatch(
          updateorder({
            orderId: createdOrder?._id,
            payment: {
              mode: 'ONLINE',
              payment: savePaymentToDb.payment._id,
              status: 'paid',
            },
          }),
        );

        newOrder = updatedOrder?.payload;
      } else {
        newOrder = createdOrder;
      }

      return newOrder;
    } catch (error: any) {
      console.log(error?.response?.data);
      let message =
        error?.response?.data?.message || error?.message || error?.description;
      return rejectWithValue(message);
    }
  },
);

export const createOrder = createAsyncThunk(
  'order/create',
  async (orderReq: createOrderProps, {rejectWithValue, getState, dispatch}) => {
    try {
      const state = getState() as any;
      const token = state?.Auth?.token;

      const items = state.Cart.cart.map((item: any) => ({
        customisation: item.customisation,
        food: item?.item?._id,
        quantity: item?.quantity,
      }));
      const restaurant = state.Cart.store._id;
      const info = state.Cart.info;
      const address = state.Profile.address.active;
      console.log(items);
      //Create Order
      const {data: createOrder} = await axios.post(
        `${AppConfig.API}/api/order/new`,
        {
          restaurant,
          items,
          address,
          payment: {
            mode: orderReq.mode,
            payment: null,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return createOrder?.order;
    } catch (error: any) {
      console.log(error?.response?.data);
      let message =
        error?.response?.data?.message || error?.message || error?.description;
      return rejectWithValue(message);
    }
  },
);

export const updateorder = createAsyncThunk(
  'order/update',
  async (orderReq: updateorderProps, {rejectWithValue, getState, dispatch}) => {
    try {
      const state = getState() as any;
      const token = state?.Auth?.token;

      const {data: updateorder} = await axios.put(
        `${AppConfig.API}/api/order/update?token=${token}`,
        {
          orderId: orderReq?.orderId,
          payment: orderReq?.payment,
        },
      );

      return updateorder;
    } catch (error: any) {
      console.log(error?.response?.data);
      let message =
        error?.response?.data?.message || error?.message || error?.description;
      return rejectWithValue(message);
    }
  },
);

export const OrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderError: (state, action: PayloadAction) => {},
  },
  extraReducers: builder => {
    builder
      .addCase(createOrder.pending, state => {
        console.log('Cretaing new order.');
        state.newOrder.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        console.log('New Order created.');
        state.newOrder.loading = false;
        state.newOrder.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        console.log('Error creating order:', action.payload);
        state.newOrder.loading = false;
        state.newOrder.error = action.payload;
      })
      .addCase(updateorder.pending, state => {
        console.log('Updating order....');
        state.newOrder.loading = true;
      })
      .addCase(updateorder.fulfilled, (state, action) => {
        console.log('Order updated Successfully.');
        state.newOrder.loading = false;
      })
      .addCase(updateorder.rejected, (state, action) => {
        console.log('Error Updating order:', action.payload);
        state.newOrder.loading = false;
        state.newOrder.error = action.payload;
      });
  },
});

export const {clearOrderError} = OrderSlice.actions;
export default OrderSlice.reducer;
