import {StyleSheet, Text, View, StatusBar} from 'react-native';
import React from 'react';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Heading from '../../Components/UI/Heading';
import {useDispatch, useSelector} from 'react-redux';
import {GeneralActions} from '../../State/Actions';
import GradientView from '../../Components/UI/GradientView';
import ColorTheme from '../../Theme/Color';
import Texts from '../../Components/UI/Texts';
import Font from '../../Theme/Font';

import Octicons from 'react-native-vector-icons/Octicons';
import Gap from '../../Components/UI/Gap';
import RestaurantCard from '../../Components/Item/RestaurantCard';

const restaurnats = [
  {
    name: 'Delicious Bites',
    description: 'A restaurant that serves delicious and diverse cuisine.',
    address: '123 Main Street, Cityville',
    image: 'https://example.com/restaurant1-image.jpg',
    distance: 2.5,
    deliveryTime: '30-45 minutes',
    categories: ['Italian', 'Mexican', 'Chinese'],
  },
  {
    name: 'Spice Junction',
    description: 'Experience the flavors of authentic Indian cuisine.',
    address: '456 Elm Street, Townsville',
    image: 'https://example.com/restaurant2-image.jpg',
    distance: 3.2,
    deliveryTime: '40-55 minutes',
    categories: ['Indian', 'Vegetarian'],
  },
  {
    name: 'Sushi Express',
    description: 'Fresh and delectable sushi made with the finest ingredients.',
    address: '789 Oak Avenue, Villageland',
    image: 'https://example.com/restaurant3-image.jpg',
    distance: 1.8,
    deliveryTime: '25-35 minutes',
    categories: ['Japanese', 'Seafood'],
  },
  {
    name: "Mama's Pizzeria",
    description: 'Authentic Italian pizzas made with love and passion.',
    address: '321 Pine Road, Boroughville',
    image: 'https://example.com/restaurant4-image.jpg',
    distance: 4.6,
    deliveryTime: '50-60 minutes',
    categories: ['Italian', 'Pizza'],
  },
  {
    name: 'Taqueria Mexico',
    description: 'Delicious Mexican street food bursting with flavor.',
    address: '987 Maple Lane, Townburg',
    image: 'https://example.com/restaurant5-image.jpg',
    distance: 2.1,
    deliveryTime: '30-40 minutes',
    categories: ['Mexican', 'Tacos'],
  },
];

const HomeScreen = () => {
  const dispatch = useDispatch();
  const Color = ColorTheme();
  const {theme} = useSelector(State => State.General);

  const setTheme = mode => {
    dispatch(GeneralActions.setTheme(mode));
  };

  console.log('Theme from store', theme);

  return (
    <View style={{backgroundColor: Color.BG}}>
      <StatusBar
        barStyle={'default'}
        backgroundColor={Color.BG}
        translucent={false}
      />
      <Gap h={6} />
      <View style={styles.HeaderContainer}>
        <View>
          <View style={{flexDirection: 'row', gap: 3}}>
            <Texts level={'sm'} style={{color: Color.LIGHT[5]}}>
              Your Location
            </Texts>
            <Octicons name="chevron-down" size={15} color={Color.DARK[2]} />
          </View>
          <Gap h={2} />
          <View style={{flexDirection: 'row', gap: 3}}>
            <Octicons name="location" size={18} color={Color.BUTTON[1]} />
            <Heading style={{fontFamily: Font.BOLD}}>
              Bholu General Store, Nawada..
            </Heading>
          </View>
        </View>
        <View>
          <Octicons name="bell" size={22} color={Color.DARK[1]} />
        </View>
      </View>
      <Gap h={20} />

      <View style={{...styles.serachBar, backgroundColor: Color.CARD}}>
        <Octicons name="search" size={18} color={Color.DARK[2]} />
        <Texts level={'sm'}>Search</Texts>
      </View>

      <FlatList
        style={styles.restaurnatsList}
        data={restaurnats}
        renderItem={({item}) => <RestaurantCard item={item} />}
        keyExtractor={item => item.name}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={<Gap h={18} />}
      />

      <View
        style={{
          height: 100,
          width: 100,
          backgroundColor: Color.PRIMARY[1],
        }}
      />
      <TouchableOpacity onPress={() => setTheme('dark')}>
        <Heading>Dark</Heading>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setTheme('light')}>
        <Heading>Light</Heading>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  HeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  serachBar: {
    height: 45,
    borderRadius: 33,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 5,
    marginHorizontal: 18,
  },

  restaurnatsList: {},
});

export default HomeScreen;
