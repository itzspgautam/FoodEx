import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {AppConfig} from '../../Config/appConfig';
import {AuthState} from './AuthSlice';
import ProfileStorage from '../../storage/ProfileStorage';
import {
  askLocationPermission,
  getCurrentPosition,
} from '../../Utils/LocationPermission';
import {getNearbyRestaurants} from './RestaurantSlice';
import {navigate} from '../../Utils/NavigationUtils';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface SingleAddress {
  _id?: string;
  type?: string;
  streetHouseNumber?: string;
  area?: string;
  district?: string;
  state?: string;
  country?: string;
  landmark?: string;
  user?: string;
  phoneNumber?: string;
  coordinates?: LocationCoordinates;
}

export interface ProfileState {
  address: {
    addresses: SingleAddress[] | null;
    active: SingleAddress | null;
    loading: boolean;
    error: any | null;
  };
}

const initialState: ProfileState = {
  address: {
    addresses: null,
    active: null,
    loading: false,
    error: null,
  },
};

//store to async storage if user opened first time
export const cretaeAddress = createAsyncThunk(
  'profile/address/new',
  async (addressData: SingleAddress, {rejectWithValue, getState, dispatch}) => {
    try {
      const state = getState() as {Auth: AuthState};
      const token = state?.Auth?.token;

      const {data: saved} = await axios.post(
        `${AppConfig.API}/api/profile/address/new`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('THis is saved', saved.address);
      await dispatch(selectAddress(saved.address));

      const {payload} = await dispatch(getAddresses());
      return payload;
    } catch (error: any) {
      const message = error.response.data.message || error.message;
      return rejectWithValue(message);
    }
  },
);

export const getAddresses = createAsyncThunk(
  'profile/address/get',
  async (i, {rejectWithValue, getState}) => {
    try {
      const state = getState() as {Auth: AuthState};
      const token = state?.Auth?.token;

      const {data} = await axios.get(
        `${AppConfig.API}/api/profile/address/get?token=${token}`,
      );
      return data;
    } catch (error: any) {
      const message = error.response.data.message || error.message;
      return rejectWithValue(message);
    }
  },
);

export const selectAddress = createAsyncThunk(
  'profile/address/select',
  async (address: SingleAddress, {rejectWithValue, dispatch}) => {
    try {
      if (address?._id === '0') {
        const {latitude, longitude} = await getCurrentPosition();
        console.log('Fetching from lat lon: ', latitude, longitude);
        address = {
          _id: '0',
          type: 'DEVICE',
          streetHouseNumber: 'Current device location',
          coordinates: {latitude, longitude},
        };
        console.log('Address selected from current position');
      }
      const stringAddress = JSON.stringify(address);
      await ProfileStorage.storeSelectedAddress(stringAddress);

      dispatch(getNearbyRestaurants(address));

      return address;
    } catch (error: any) {
      const message = error.response.data.message || error.message;
      return rejectWithValue(message);
    }
  },
);

export const ProfileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state, action: PayloadAction) => {
      state.address.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(cretaeAddress.pending, state => {
        state.address.loading = true;
      })
      .addCase(cretaeAddress.fulfilled, (state, action) => {
        console.log('Address saved.');
        state.address.loading = false;
      })
      .addCase(cretaeAddress.rejected, (state, action) => {
        console.log('Error saving address:', action.payload);
        state.address.loading = false;
        state.address.error = action.payload;
      })
      .addCase(getAddresses.pending, state => {
        state.address.loading = true;
      })
      .addCase(getAddresses.fulfilled, (state, action) => {
        console.log('Addresses Fetched');
        state.address.loading = false;
        state.address.addresses = action.payload.addresses;
      })
      .addCase(getAddresses.rejected, (state, action) => {
        console.log('Error saving address:', action.payload);
        state.address.loading = false;
        state.address.error = action.payload;
      })
      .addCase(selectAddress.pending, state => {
        state.address.loading = true;
      })
      .addCase(selectAddress.fulfilled, (state, action) => {
        console.log('Addresses Selected');
        state.address.loading = false;
        state.address.active = action.payload;
      })
      .addCase(selectAddress.rejected, (state, action) => {
        console.log('Error Selecting address:', action.payload);
        state.address.loading = false;
        state.address.error = action.payload;
      });
  },
});

export const {clearProfileError} = ProfileSlice.actions;
export default ProfileSlice.reducer;
