import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {SingleAddress} from './ProfileSlice';
import {Customization, Restaurant} from './RestaurantSlice';
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
  payment?: Paymentprops;
  status?: String;
}
export interface singleOrderProps {
  order: {
    _id: String;
    orderNumber: number;
    restaurant: Restaurant;
    status: String;
    rating: number;
    items: any;
    createdAt: string;
    address: SingleAddress;
    payment: any;
  };
  printablePaymentDetails: any;
}

export interface OrderState {
  orderFlow: {
    error: any | null;
    loading: boolean;
  };
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
  allOrders: {
    loading: boolean;
    error: any;
    all: null | singleOrderProps[];
  };
  orderDetail: {
    loading: boolean;
    error: any;
    order: null | singleOrderProps;
  };
}
const initialState: OrderState = {
  orderFlow: {
    error: null,
    loading: false,
  },
  newOrder: {
    order: null,
    error: null,
    loading: false,
  },
  allOrders: {
    loading: false,
    error: null,
    all: null,
  },
  orderDetail: {
    loading: false,
    error: null,
    order: null,
  },
};

export const orderFlow = createAsyncThunk(
  'order/flow',
  async (orderReq: createOrderProps, {rejectWithValue, getState, dispatch}) => {
    try {
      const state = getState() as RootState;
      const token = state?.Auth?.token;

      if (state?.Profile?.address?.active?._id === '0') {
        const message =
          state?.Profile?.address?.addresses?.length === 0
            ? 'Please select address first.'
            : 'Please save address first.';
        await navigate('AddLocation');
        return rejectWithValue(message);
      }

      //creating order
      const {payload: createdOrder} = await dispatch(
        createOrder({mode: orderReq.mode}),
      );

      //if Paymen tis online mode, ask for payment and update order
      let newOrder;

      if (createdOrder?.payment?.mode === 'ONLINE') {
        //generating Payment order
        const generatedPaymentorder: any = await dispatch(
          generatePaymentOrder({
            amount: createdOrder?.payment?.info?.total,
          }),
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
            status: 'processing',
          }),
        );

        newOrder = updatedOrder?.payload;
      } else {
        //updating order
        const updatedOrder = await dispatch(
          updateorder({
            orderId: createdOrder?._id,
            status: 'processing',
          }),
        );
        newOrder = updatedOrder?.payload;
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
      const restaurant = state.Cart.store;
      const info = state.Cart.info;
      const address = state.Profile.address.active;

      //Create Order
      const {data: createOrder} = await axios.post(
        `${AppConfig.API}/api/order/new`,
        {
          restaurant,
          items,
          address,
          info,
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
        `${AppConfig.API}/api/order/update`,
        {
          orderId: orderReq?.orderId,
          payment: orderReq?.payment,
          status: orderReq?.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
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

export const getAllOrders = createAsyncThunk(
  'order/getAll',
  async (orderReq, {rejectWithValue, getState, dispatch}) => {
    try {
      const state = getState() as any;
      const token = state?.Auth?.token;

      //fetch all Order
      const {data: allOrders} = await axios.get(
        `${AppConfig.API}/api/order/get?token=${token}`,
      );
      return allOrders;
    } catch (error: any) {
      console.log(error?.response?.data);
      let message =
        error?.response?.data?.message || error?.message || error?.description;
      return rejectWithValue(message);
    }
  },
);

export const getOrderDetail = createAsyncThunk(
  'order/singleDetail',
  async (orderId: string, {rejectWithValue, getState, dispatch}) => {
    try {
      const state = getState() as any;
      const token = state?.Auth?.token;

      //fetch all Order
      const {data: orderDetail} = await axios.get(
        `${AppConfig.API}/api/order/${orderId}?token=${token}`,
      );
      return orderDetail;
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
    clearOrderError: (state, action: PayloadAction) => {
      state.newOrder.error = null;
      state.orderFlow.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(orderFlow.pending, state => {
        console.log('Order flow initiated.');
        state.orderFlow.loading = true;
      })
      .addCase(orderFlow.fulfilled, (state, action) => {
        console.log('Orderflow ended.');
        state.orderFlow.loading = false;
        console.log('send to success screen');
      })
      .addCase(orderFlow.rejected, (state, action) => {
        console.log('Order Flow Order', action.payload);
        state.orderFlow.loading = false;
        state.orderFlow.error = action.payload;
      })
      .addCase(createOrder.pending, state => {
        console.log('Cretaing new order.');
        state.newOrder.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        console.log('New Order created.');
        state.newOrder.loading = false;
        state.newOrder.order = action.payload;
        console.log('send to success screen');
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
      })
      .addCase(getAllOrders.pending, state => {
        console.log('Fetching order....');
        state.allOrders.loading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        console.log('Orders fetched Successfully.');
        state.allOrders.all = action?.payload?.orders;
        state.allOrders.loading = false;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        console.log('Error fetching order:', action.payload);
        state.allOrders.loading = false;
        state.allOrders.error = action.payload;
      })
      .addCase(getOrderDetail.pending, state => {
        console.log('Fetching order deails....');
        state.orderDetail.loading = true;
      })
      .addCase(getOrderDetail.fulfilled, (state, action) => {
        console.log('Orders detail fetched Successfully.', action.payload);
        state.orderDetail.order = action?.payload;
        state.orderDetail.loading = false;
      })
      .addCase(getOrderDetail.rejected, (state, action) => {
        console.log('Error fetching order:', action.payload);
        state.orderDetail.loading = false;
        state.orderDetail.error = action.payload;
      });
  },
});

export const {clearOrderError} = OrderSlice.actions;
export default OrderSlice.reducer;
