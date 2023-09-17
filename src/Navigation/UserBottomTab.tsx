import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/Home/HomeScreen';
import Icon from 'react-native-vector-icons/Octicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Colors from '../Constants/Colors';
import {LoginScreen} from '../Screens/Auth';
import CartScreen from '../Screens/Home/CartScreen';
import {View} from 'react-native';
import Paragraph from '../Components/UI/Paragraph';
import Fonts from '../Constants/Fonts';
import GradientView from '../Components/UI/GradientView';
import {useSelector} from 'react-redux';
import {RootState} from '../State/store';
import SearchScreen from '../Screens/Home/SearchScreen';
import ProfileScreen from '../Screens/Auth/ProfileScreen';
import {navigationRef} from '../Utils/NavigationUtils';
const Tab = createBottomTabNavigator();

const UserBottomTab = () => {
  const {info} = useSelector((state: RootState) => state.Cart);

  const CartCount = info?.total_quantity;
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY[2],
        tabBarInactiveTintColor: Colors.LIGHT[3],
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="search" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => (
            <View>
              <FeatherIcon name="shopping-cart" color={color} size={size + 2} />
              {CartCount > 0 && (
                <GradientView
                  colors={[Colors.PRIMARY[1], Colors.PRIMARY[2]]}
                  style={{
                    position: 'absolute',
                    right: -15,
                    padding: 4,
                    borderRadius: 32,
                    minWidth: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Paragraph
                    level={2}
                    fontFamily={Fonts.MEDIUM}
                    style={{
                      color: Colors.LIGHT[1],
                    }}>
                    {CartCount}
                  </Paragraph>
                </GradientView>
              )}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Login"
        component={ProfileScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default UserBottomTab;
