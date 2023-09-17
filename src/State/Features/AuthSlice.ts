import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import AuthStorage from '../../storage/AuthStorage';
import axios from 'axios';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AppConfig} from '../../Config/appConfig';

export interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | any;
  phoneAuth: {
    step: 'PHONE' | 'OTP' | 'AUTHENTICATED';
    confirm: FirebaseAuthTypes.ConfirmationResult | null;
    loading: boolean;
    error: any | null;
  };
  googleAuth: {
    step: 'GOOGLE' | 'AUTHENTICATED';
    loading: boolean;
    error: any | null;
  };
}

interface requestOTPProps {
  phoneNumber: string;
  countryCode: string;
}
interface verifyOTPProps {
  otp: string;
}
interface setUserProps {
  user: FirebaseAuthTypes.User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  phoneAuth: {
    step: 'PHONE',
    confirm: null,
    loading: false,
    error: null,
  },
  googleAuth: {
    step: 'GOOGLE',
    loading: false,
    error: null,
  },
};

function isValidPhoneNumber(phoneNumber: string) {
  // Define the regular expression for allowed formats
  const phoneRegex = /^(\d{3}-\d{3}-\d{4})|(\d{4}-\d{4})$/;

  // Check if the phoneNumber matches the regex
  return phoneRegex.test(phoneNumber);
}

//request otp
export const requestOTP = createAsyncThunk(
  'auth/requestOTP',
  async (phoneData: requestOTPProps, {rejectWithValue}) => {
    try {
      const {phoneNumber, countryCode} = phoneData;

      if (!phoneNumber || isValidPhoneNumber(phoneNumber)) {
        return rejectWithValue('Please enter valid phone number.');
      }

      const confirmation = await auth().signInWithPhoneNumber(
        countryCode + '' + phoneNumber,
      );
      return confirmation;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

//verify otp
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otpData: verifyOTPProps, {rejectWithValue, getState, dispatch}) => {
    try {
      const {otp} = otpData;
      if (!otp || otp.length !== 6) {
        return rejectWithValue('Please enter valid OTP.');
      }

      const state = getState() as {Auth: AuthState}; // Get the current state
      const confirmationResult = state.Auth.phoneAuth.confirm; // Access the confirmationResult from the state
      if (!confirmationResult) {
        throw new Error(
          'ConfirmationResult not found. Please request OTP first.',
        );
      }
      const userCredential = await confirmationResult.confirm(otp);
      await dispatch(loginUser());
      return userCredential;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

//Login with google
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (i, {rejectWithValue, getState, dispatch}) => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      console.log(userCredential);
      await dispatch(loginUser());
      return userCredential;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

//Login user or save if not registered at backend
export const loginUser = createAsyncThunk(
  'auth/login',
  async (token, {rejectWithValue}) => {
    try {
      const token = await auth().currentUser?.getIdToken();
      const {data} = await axios.post(
        `${AppConfig.API}/api/auth/login`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await AuthStorage.storeUser(
        JSON.stringify({user: data?.user, token: data?.token}),
      );
      await auth().signOut();
      return data;
    } catch (error: any) {
      console.log(error.response.data);
      let message =
        error?.response?.data?.message === null
          ? error.message
          : error?.response?.data?.message;
      return rejectWithValue(message);
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (navigation: any, {rejectWithValue}) => {
    try {
      console.log('logging out');
      await AuthStorage.removeUser();
      navigation.navigate('Login');
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<setUserProps>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearAuthError: (state, action: PayloadAction) => {
      state.phoneAuth.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(requestOTP.pending, state => {
        state.phoneAuth.loading = true;
      })
      .addCase(requestOTP.fulfilled, (state, action) => {
        console.log('Otp Sent Successfully!');
        state.phoneAuth.loading = false;
        state.phoneAuth.confirm = action.payload;
        state.phoneAuth.step = 'OTP';
      })
      .addCase(requestOTP.rejected, (state, action) => {
        console.log('Otp Request error:', action.payload);
        state.phoneAuth.loading = false;
        state.phoneAuth.error = action.payload;
      })
      .addCase(verifyOTP.pending, state => {
        state.phoneAuth.loading = true;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        console.log('Otp verified success');
        state.phoneAuth.loading = false;
        state.phoneAuth.step = 'AUTHENTICATED';
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        console.log('OTP verification error:', action.payload);
        state.phoneAuth.loading = false;
        state.phoneAuth.error = action.payload;
      })
      .addCase(loginWithGoogle.pending, state => {
        state.googleAuth.loading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        console.log('Logged in with google=>', action.payload);
        state.googleAuth.loading = false;
        state.googleAuth.step = 'AUTHENTICATED';
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        console.log('Login with google error:', action.payload);
        state.googleAuth.loading = false;
        state.googleAuth.error = action.payload;
      })
      .addCase(loginUser.pending, state => {
        console.log('Loggin user...');
        console.log('Generating permanent token...');
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action.payload); //Loged in
        state.user = action.payload?.user ?? null;
        state.token = action.payload?.token ?? null;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('Log in error:', action.payload);
        state.error = action?.payload;
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
        state.phoneAuth.confirm = null;
        state.phoneAuth.step = 'PHONE';
        state.phoneAuth.loading = false;
        state.phoneAuth.error = null;
      });
  },
});

export const {setUser, clearAuthError} = AuthSlice.actions;
export default AuthSlice.reducer;
