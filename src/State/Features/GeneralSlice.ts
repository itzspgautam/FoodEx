import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from '@reduxjs/toolkit';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import GeneralStorage from '../../storage/GeneralStorage';
import AuthStorage from '../../storage/AuthStorage';
import {setUser} from './AuthSlice';
import {getNearbyRestaurants} from './RestaurantSlice';
import {setCart} from './CartSlice';
import CartStorage from '../../storage/CartStorage';
import {SingleAddress, getAddresses, selectAddress} from './ProfileSlice';
import ProfileStorage from '../../storage/ProfileStorage';
import {
  getCurrentPosition,
  isLocationPermissionGranted,
} from '../../Utils/LocationPermission';
import NetInfo from '@react-native-community/netinfo';

interface State {
  isFirstTime: boolean;
  loading: boolean;
  progress: number;
  error: any | null;
  internet: any;
  locationPermission: boolean;
}

interface setProgressprops {
  progress: any;
}
interface setInternetProps {
  internet: number;
}

const initialState: State = {
  locationPermission: false,
  internet: true,
  isFirstTime: true,
  loading: true,
  progress: 0,
  error: null,
};

//init app
export const appStart = createAsyncThunk(
  'general/appstart',
  async (value, {rejectWithValue, dispatch}) => {
    try {
      //get first time and store in state
      const isFirstTime = await getFirstTime();
      dispatch(setProgress({progress: 10}));

      //starting netinfo broadcast
      await NetInfo.addEventListener((state: any) => {
        dispatch(setInternet({internet: state}));
      });

      //geting auth from storage and store in state
      const isAuth = await AuthStorage.getUser();
      let parsedAuth;
      if (isAuth !== null) {
        parsedAuth = isAuth !== null ? JSON.parse(isAuth) : null;
        dispatch(setUser({user: parsedAuth?.user, token: parsedAuth.token}));
        dispatch(setProgress({progress: 30}));
      }

      //cheking location permission
      const locationGrantResult = await isLocationPermissionGranted();
      await dispatch(setLocationPermission(locationGrantResult));

      //Set active Location from storage
      const storageAddress: any = await ProfileStorage.getSelectedAddress();
      if (storageAddress) {
        const address = JSON.parse(storageAddress);
        await dispatch(selectAddress(address));
      } else if (locationGrantResult) {
        const address = {_id: '0'};
        await dispatch(selectAddress(address));
      }

      //Set cart from storage cart
      const cartStorage = await CartStorage.getCart();
      if (cartStorage) {
        await dispatch(setCart(cartStorage));
      }
      dispatch(setProgress({progress: 60}));

      dispatch(setProgress({progress: 100}));
      return {isFirstTime, isAuth: parsedAuth};
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

//get from store if user opened first time
export const getFirstTime = async () => {
  try {
    const getFirstTime = await GeneralStorage.getFirstTime();
    return getFirstTime;
  } catch (error: any) {
    return error;
  }
};

//store to async storage if user opened first time
export const setFirstTime = createAsyncThunk(
  'general/setFirstTime',
  async (value: Boolean, {rejectWithValue}) => {
    try {
      const setFirstTime = await GeneralStorage.storeFirstTime(
        JSON.stringify(value),
      );
      return setFirstTime;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

//Select address to current user location

//store to async storage if user opened first time
export const getPositionAndSelectAddress = createAsyncThunk(
  'general/setFirstTime',
  async (value: Boolean, {rejectWithValue}) => {
    try {
      const setFirstTime = await GeneralStorage.storeFirstTime(
        JSON.stringify(value),
      );
      return setFirstTime;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const GeneralSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setProgress: (state, action: PayloadAction<setProgressprops>) => {
      state.progress = action.payload.progress;
    },
    setInternet: (state, action: PayloadAction<setInternetProps>) => {
      state.internet = action.payload.internet;
    },
    setLocationPermission: (state, action: PayloadAction<boolean>) => {
      state.locationPermission = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(appStart.pending, state => {
        state.loading = true;
      })
      .addCase(appStart.fulfilled, (state, action) => {
        console.log('App Started');
        state.loading = false;
        state.isFirstTime = action.payload.isFirstTime;
      })
      .addCase(appStart.rejected, (state, action) => {
        console.log('Appstart Error:', action.payload);
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(setFirstTime.fulfilled, (state, action) => {
        state.isFirstTime = false;
      });
  },
});

export const {setProgress, setInternet, setLocationPermission} =
  GeneralSlice.actions;

export default GeneralSlice.reducer;
