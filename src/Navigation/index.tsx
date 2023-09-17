import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../Screens/General/SplashScreen';
import {LoginScreen} from '../Screens/Auth';
import UserBottomTab from './UserBottomTab';
import RestaurantScreen from '../Screens/Home/RestaurantScreen';
import {AddLocation, LocationList} from '../Screens/Home/Location';
import OnboardingScreen from '../Screens/General/Onboarding';
import {AppDispatch, RootState} from '../State/store';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {appStart} from '../State/Features/GeneralSlice';
import {navigationRef} from '../Utils/NavigationUtils';
import LocationPermission from '../Components/Errors/LocationPermission';
import OrderSuccessScreen from '../Screens/Home/Order/OrderSuccessScreen';

const Stack = createStackNavigator();

const Navigators = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {loading, isFirstTime, locationPermission} = useSelector(
    (state: RootState) => state.General,
  );
  const {user, loading: userLoading} = useSelector(
    (state: RootState) => state.Auth,
  );

  useEffect(() => {
    setTimeout(() => {
      dispatch(appStart());
    }, 2000);
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Splash">
        {loading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <>
            {isFirstTime && (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            )}

            {!userLoading && !user ? (
              <Stack.Screen name="Login" component={LoginScreen} />
            ) : !locationPermission ? (
              <Stack.Screen
                name="LocationPermission"
                component={LocationPermission}
              />
            ) : (
              <>
                <Stack.Screen name="User" component={UserBottomTab} />
                <Stack.Screen name="Restaurant" component={RestaurantScreen} />
                <Stack.Screen name="LocationList" component={LocationList} />
                <Stack.Screen name="AddLocation" component={AddLocation} />
                <Stack.Screen
                  name="OrderSuccess"
                  component={OrderSuccessScreen}
                />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigators;
