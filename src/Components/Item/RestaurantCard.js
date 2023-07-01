import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ShadowView from '../UI/ShadowView';
import Images from '../../Theme/Images';
import Heading from '../UI/Heading';
import Texts from '../UI/Texts';
import ColorTheme from '../../Theme/Color';
import Octicons from 'react-native-vector-icons/Octicons';

const RestaurantCard = ({item}) => {
  const Color = ColorTheme();
  return (
    <ShadowView style={styles.container}>
      <View style={styles.Leftdata}>
        <Image
          source={{
            uri: 'https://www.teenaagnel.com/wp-content/uploads/2019/12/food-photography-in-dubai.jpg',
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View>
          <Heading level={4}>{item.name}</Heading>
          <Texts level={'xsm'} style={{color: Color.DARK[5]}}>
            {item.categories.slice(0, 3).join(' • ')}
          </Texts>
          <View>
            <View style={{flexDirection: 'row', gap: 2}}>
              <Octicons name="location" size={14} color={Color.BUTTON[2]} />
              <Texts style={{color: Color.DARK[4], fontSize: 10}}>
                {item.distance}km
              </Texts>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.rightData}>
        <Octicons name="heart" size={20} color={Color.BUTTON[2]} />
        <Octicons name="heart-fill" size={20} color={Color.BUTTON[2]} />
      </View>
    </ShadowView>
  );
};

export default RestaurantCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    padding: 10,
    flexDirection: 'row',
  },
  Leftdata: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  rightData: {
    alignItems: 'flex-end',
  },
});
