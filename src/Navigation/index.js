import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SplashScreen} from '../Screens/General';
import {HomeScreen} from '../Screens/Home';
import {useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {GeneralActions} from '../State/Actions';
import {LoginScreen} from '../Screens/Auth';

const Stack = createStackNavigator();

const Navigators = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GeneralActions.appStart());
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigators;
