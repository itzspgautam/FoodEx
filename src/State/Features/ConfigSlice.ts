import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {AppConfig} from '../../Config/appConfig';

const initialState = {
  loading: false,
  config: null,
  error: '',
};

//store to async storage if user opened first time
export const getConfig = createAsyncThunk(
  'config/get',
  async (a, {rejectWithValue, getState, dispatch}) => {
    try {
      const {data} = await axios.get(`${AppConfig.API}/api/config/get`);
      return data;
    } catch (error: any) {
      console.log(error.response.data);
      const message =
        error.response.data !== null
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  },
);

export const ConfigSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getConfig.pending, state => {
        console.log('Config fetching...');
        state.loading = true;
      })
      .addCase(getConfig.fulfilled, (state, action) => {
        console.log('Config fetched', action.payload);
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(getConfig.rejected, (state, action) => {
        console.log('Restaurant Fetch error:', action.payload);
        state.loading = false;
      });
  },
});

export const {} = ConfigSlice.actions;
export default ConfigSlice.reducer;
