import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from '@reduxjs/toolkit';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import AuthStorage from '../../storage/AuthStorage';
import axios from 'axios';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AppConfig} from '../../Config/appConfig';
import {ProfileState, SingleAddress} from './ProfileSlice';

export interface Restaurant {
  _id: string;
  name: string;
  location: {coordinates: [number, number]};
  logo: string;
  banner: string;
  tags: string[];
  distance: number;
  rating: number;
  cuisine: string[];
  deliveryTime: number;
  address: string;
}

interface RestaurantMenu {
  restaurant: string | null;
  menu: any | null;
  loading: boolean;
}

export interface Food {
  _id: string;
  name: string;
  category: string;
  customizations: Customization[];
  restaurant: Restaurant;
  __v: number;
}

export interface Customization {
  _id: string;
  name: string;
  options: CustomizationOption[];
}

interface CustomizationOption {
  _id: string;
  name: string;
  price: number;
}

interface Search {
  query: string;
  restaurants: Restaurant[];
  foods: Food[];
  loading: boolean;
  error: any | null;
}

interface RestaurantState {
  restaurants: Restaurant[] | null;
  total: number;
  loading: boolean;
  error: any | null;
  selected: RestaurantMenu;
  search: Search;
}

const initialState: RestaurantState = {
  restaurants: null,
  total: 0,
  loading: false,
  error: null,
  selected: {
    restaurant: null,
    menu: null,
    loading: false,
  },
  search: {
    query: '',
    restaurants: [],
    foods: [],
    loading: false,
    error: null,
  },
};

//store to async storage if user opened first time
export const getNearbyRestaurants = createAsyncThunk(
  'restaurant/getNearby',
  async (address: SingleAddress | undefined, {rejectWithValue, getState}) => {
    try {
      let latitude;
      let longitude;

      if (!address) {
        const state = getState() as {Profile: any};
        latitude = state.Profile.address.active.coordinates?.latitude;
        longitude = state.Profile.address.active.coordinates?.longitude;
      } else {
        latitude = address?.coordinates?.latitude;
        longitude = address?.coordinates?.longitude;
      }

      const {data} = await axios.post(
        `${AppConfig.API}/api/restaurant/nearby`,
        {latitude: latitude, longitude: longitude},
      );
      return data;
    } catch (error: any) {
      console.log(error);
      const message = error.response.data.message || error.message;
      return rejectWithValue(message);
    }
  },
);

//store to async storage if user opened first time
export const getMenu = createAsyncThunk(
  'restaurant/getMenu',
  async (restaurant: {_id: string}, {rejectWithValue}) => {
    try {
      const {data} = await axios.get(
        `${AppConfig.API}/api/restaurant/menu?restaurant=${restaurant._id}`,
      );

      const menu = await groupMenuByCategory(data.menu);

      return {menu, restaurant: restaurant._id};
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

//store to async storage if user opened first time
export const searchRestaurantAndFood = createAsyncThunk(
  'restaurant/search',
  async (query: String, {rejectWithValue, getState, dispatch}) => {
    dispatch(setSearchQuery(query));
    try {
      if (!query.trim()) return rejectWithValue('Empty query');
      const state = (await getState()) as {Profile: ProfileState};
      const latitude = state.Profile.address.active?.coordinates?.latitude;
      const longitude = state.Profile.address.active?.coordinates?.longitude;
      console.log(latitude, longitude);
      const {data} = await axios.get(
        `${AppConfig.API}/api/restaurant/search?query=${query}&latitude=${latitude}&longitude=${longitude}`,
      );
      return {...data, query};
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
const groupMenuByCategory = async (menu: any) => {
  const groupedFoods: any = {};
  menu?.forEach((food: any) => {
    const {category, ...rest} = food;
    if (groupedFoods.hasOwnProperty(category)) {
      groupedFoods[category].push(rest);
    } else {
      groupedFoods[category] = [rest];
    }
  });
  return groupedFoods;
};

export const RestaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<any>) => {
      state.search.query = action?.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getNearbyRestaurants.pending, state => {
        state.loading = true;
      })
      .addCase(getNearbyRestaurants.fulfilled, (state, action) => {
        console.log('Restaurant fetched');
        state.loading = false;
        state.restaurants = action.payload?.restaurants;
        state.total = action.payload?.total;
      })
      .addCase(getNearbyRestaurants.rejected, (state, action) => {
        console.log('Restaurant Fetch error:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMenu.pending, state => {
        state.selected.loading = true;
      })
      .addCase(getMenu.fulfilled, (state, action) => {
        console.log('Menu fetched');
        state.selected.loading = false;
        state.selected.restaurant = action.payload?.restaurant;
        state.selected.menu = action.payload?.menu;
      })
      .addCase(getMenu.rejected, (state, action) => {
        console.log('Menu Fetch error:', action.payload);
        state.loading = false;
      })
      .addCase(searchRestaurantAndFood.pending, state => {
        state.search.loading = true;
      })
      .addCase(searchRestaurantAndFood.fulfilled, (state, action) => {
        console.log('Searched => ', action.payload);
        state.search.loading = false;
        state.search.restaurants = action.payload?.restaurants;
        state.search.foods = action.payload?.foods;
      })
      .addCase(searchRestaurantAndFood.rejected, (state, action) => {
        console.log('Search error:', action.payload);
        state.search.query = '';
        state.search.loading = false;
        state.search.error = action.payload;
      });
  },
});

export const {setSearchQuery} = RestaurantSlice.actions;
export default RestaurantSlice.reducer;
