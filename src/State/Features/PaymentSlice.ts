import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {SingleAddress} from './ProfileSlice';
import {Customization} from './RestaurantSlice';
import axios from 'axios';
import {AppConfig} from '../../Config/appConfig';
import {navigate} from '../../Utils/NavigationUtils';
import {clearCart} from './CartSlice';

interface paymentOrderProps {
  amount: number;
}

interface svePaymentProps {
  order_id: string;
  payment_id: string;
  amount: number;
}

export interface PaymentState {
  order: {
    newOrder: [] | null;
    error: any | null;
    loading: boolean;
  };
}

const initialState: PaymentState = {
  order: {
    newOrder: null,
    error: null,
    loading: false,
  },
};

export const generatePaymentOrder = createAsyncThunk(
  'payment/generate',
  async (order: paymentOrderProps, {rejectWithValue, getState, dispatch}) => {
    try {
      const state = getState() as any;
      const token = state?.Auth?.token;

      const {data} = await axios.post(
        `${AppConfig.API}/api/payment/generate`,
        {amount: order.amount},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    } catch (error: any) {
      const message = error.response.data.message || error.message;
      return rejectWithValue(message);
    }
  },
);

export const savePayment = createAsyncThunk(
  'payment/save',
  async (order: svePaymentProps, {rejectWithValue, getState, dispatch}) => {
    try {
      const state = getState() as any;
      const token = state?.Auth?.token;

      const {data} = await axios.post(
        `${AppConfig.API}/api/payment/save`,
        {
          amount: order.amount,
          order_id: order.order_id,
          payment_id: order.payment_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    } catch (error: any) {
      const message = error.response.data.message || error.message;
      return rejectWithValue(message);
    }
  },
);

export const PaymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // clearOrderError: (state, action: PayloadAction) => {},
  },
  extraReducers: builder => {
    builder
      .addCase(generatePaymentOrder.pending, state => {
        console.log('Generating payment order....');
        state.order.loading = true;
      })
      .addCase(generatePaymentOrder.fulfilled, (state, action) => {
        console.log('Payment order generated.');
        state.order.loading = false;
        state.order.newOrder = action.payload.order;
      })
      .addCase(generatePaymentOrder.rejected, (state, action) => {
        console.log('Error generating payment order.', action.payload);
        state.order.loading = false;
        state.order.error = action.payload;
      })
      .addCase(savePayment.pending, state => {
        console.log('Saving payment.');
        state.order.loading = true;
      })
      .addCase(savePayment.fulfilled, (state, action) => {
        console.log('payment saved.');
        state.order.loading = false;
      })
      .addCase(savePayment.rejected, (state, action) => {
        console.log('Error saving payment:', action.payload);
        state.order.loading = false;
        state.order.error = action.payload;
      });
  },
});

export const {} = PaymentSlice.actions;
export default PaymentSlice.reducer;
