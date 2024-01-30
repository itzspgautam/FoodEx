import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState, store} from '../store';
import CartStorage from '../../storage/CartStorage';

interface addToCartProps {
  item: any;
  customisation: any;
  quantity: number;
  store: any;
}

interface UpdateQuantityProps {
  action: 'ADD' | 'REMOVE';
  cartItem: any | null;
}

interface CartState {
  loading: boolean;
  error: any | null;
  cart: any;
  store: any;
  info: {
    total_quantity: number;
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
  };
}
const initialState: CartState = {
  loading: false,
  error: null,
  cart: [],
  store: null,
  info: {
    total_quantity: 0,
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    total: 0,
  },
};

export const addToBag = createAsyncThunk(
  'cart/add',
  async (newItem: addToCartProps, {rejectWithValue, getState, dispatch}) => {
    const {Cart} = getState() as {Cart: CartState};
    const AllState: any = getState();
    try {
      let cart = Cart.cart ? JSON.parse(JSON.stringify(Cart.cart)) : [];
      let store = Cart.store;

      //replaacing current restaurant, if previous one is another
      if (store && store?._id !== newItem.store._id) {
        cart = [];
        store = newItem.store;
      } else {
        store = newItem.store;
      }

      console.log('new Item', newItem.customisation);

      //Cheking if item already added
      const index = await cart?.findIndex(
        (addedItem: any) =>
          JSON.stringify(addedItem.customisation) ===
          JSON.stringify(newItem.customisation),
      );
      if (index !== -1) {
        //if item exist update quantity
        cart[index].quantity += newItem.quantity;
      } else {
        //else add item
        cart.push(newItem);
      }
      const info = await calculateInfo(cart, AllState?.Config);

      //saving to storage
      const value = JSON.stringify({cart, store, info});
      await CartStorage.storeCart(value);

      return {cart, store, info};
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

export const updateQuantity = createAsyncThunk(
  'cart/update',
  async (update: UpdateQuantityProps, {rejectWithValue, getState}) => {
    const {Cart} = getState() as {Cart: CartState};
    const AllState: any = getState();
    try {
      let cart = Cart.cart ? JSON.parse(JSON.stringify(Cart.cart)) : [];

      const itemToUpdate = update.cartItem;
      const updateAction = update.action;

      const index = await cart?.findIndex(
        (addedItem: any) =>
          JSON.stringify(addedItem.customisation) ===
          JSON.stringify(update.cartItem?.customisation),
      );

      if (index !== -1) {
        //update quantity
        if (updateAction === 'ADD') {
          cart[index].quantity += 1;
        } else {
          cart[index].quantity -= 1;
        }

        //remove item if quanitity becomes 0
        cart[index].quantity === 0 && cart.splice(index, 1);
      }
      const info = await calculateInfo(cart, AllState?.Config);

      //saving to storage
      let store = Cart.store;
      const value = JSON.stringify({cart, store, info});
      await CartStorage.storeCart(value);

      return {cart, info};
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (i, {rejectWithValue}) => {
    try {
      await CartStorage.removeCart();
      return true;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

export const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<any>) => {
      const payload = JSON.parse(action.payload);
      state.cart = payload.cart;
      state.store = payload.store;
      state.info.subtotal = payload.info?.subTotal ?? 0;
      state.info.deliveryFee = payload.info?.deliveryFee ?? 0;
      state.info.discount = payload.info?.discount ?? 0;
      state.info.total_quantity = payload.info?.total_quantity ?? 0;
      state.info.total = payload.info?.total ?? 0;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addToBag.pending, state => {
        state.loading = true;
      })
      .addCase(addToBag.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.store = action.payload.store;
        state.info.subtotal = action.payload.info?.subTotal ?? 0;
        state.info.deliveryFee = action.payload.info?.deliveryFee ?? 0;
        state.info.total_quantity = action.payload.info?.total_quantity ?? 0;
        state.info.total = action.payload.info?.total ?? 0;
        state.info.discount = action.payload.info?.discount ?? 0;
      })
      .addCase(addToBag.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload ?? null;
        console.log('Adding error:', action.payload);
      })
      .addCase(updateQuantity.pending, state => {
        state.loading = true;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.info.subtotal = action.payload.info?.subTotal ?? 0;
        state.info.deliveryFee = action.payload.info?.deliveryFee ?? 0;
        state.info.total_quantity = action.payload.info?.total_quantity ?? 0;
        state.info.total = action.payload.info?.total ?? 0;
        state.info.discount = action.payload.info?.discount ?? 0;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload ?? null;
        console.log('Adding error:', action.payload);
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cart = [];
        state.store = [];
        state.info = initialState.info;
      });
  },
});

const calculateInfo = (cart: any, {config}: any) => {
  console.log(cart[0]?.store?.distance);
  try {
    let subTotal = 0;
    let deliveryFee = 0;
    let total_quantity = 0;
    let total = 0;
    let discount = 0;

    //Calculte delivery fee
    const amountPerKM = config?.delivery?.amountPerKM;
    const storeDistanceInKM = cart[0]?.store?.distance / 1000;
    deliveryFee = amountPerKM * storeDistanceInKM;

    //calculate subtotal and quantity
    for (const cartItem of cart) {
      const {customisation, quantity} = cartItem;
      let regularPrice = 0;
      let salePrice = 0;
      for (const custom of customisation) {
        const {name, option} = custom;
        regularPrice += option.regularPrice;
        salePrice += option.salePrice;
      }

      subTotal += regularPrice * quantity;
      discount += (regularPrice - salePrice) * quantity;
      total += salePrice * quantity;
      total_quantity += quantity;
    }
    return {
      total_quantity,
      subTotal: Math.round(subTotal),
      discount: Math.round(discount),
      deliveryFee: Math.round(deliveryFee),
      total: Math.round(total + deliveryFee),
    };
  } catch (error) {
    console.log(error);
  }
};
export const {setCart} = CartSlice.actions;
export default CartSlice.reducer;
