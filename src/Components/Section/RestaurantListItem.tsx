import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../Constants/Colors';
import Heading from '../UI/Heading';
import Fonts from '../../Constants/Fonts';
import Paragraph from '../UI/Paragraph';
import Icon from 'react-native-vector-icons/Octicons';
import {Restaurant} from '../../State/Features/RestaurantSlice';

interface RestaurantItemProps {
  item: Restaurant;
  navigation: any;
}

const RestaurantListItem: React.FC<RestaurantItemProps> = ({
  item,
  navigation,
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={styles.restaurantContainer}
    onPress={() => navigation.navigate('Restaurant', {restaurant: item})}>
    <Image source={{uri: item?.banner}} style={styles.restaurantImage} />
    <View style={styles.restaurantData}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Heading
            level="h5"
            font={Fonts.BOLD}
            style={{color: Colors.DARK[2], maxWidth: 200}}
            numberOfLines={1}>
            {item?.name}
          </Heading>
          <Paragraph level={3} style={{color: Colors.LIGHT[3], marginTop: 2}}>
            {item?.cuisine?.slice(0, 3).join(' • ')}
          </Paragraph>
        </View>
        <View style={{flexDirection: 'column', alignItems: 'center', gap: 3}}>
          <Icon name="feed-star" size={20} color={Colors.PRIMARY[1]} />
          <Paragraph
            level={3}
            fontFamily={Fonts.BOLD}
            style={{color: Colors.DARK[3]}}>
            {item?.rating}
          </Paragraph>
        </View>
      </View>
      <View style={{flexDirection: 'row', gap: 10, marginTop: 3}}>
        <View style={{flexDirection: 'row', alignItems: 'baseline', gap: 2}}>
          <Icon name="location" size={12} color={Colors.PRIMARY[1]} />
          <Paragraph
            level={3}
            fontFamily={Fonts.BOLD}
            style={{color: Colors.DARK[3]}}>
            {(item.distance / 1000).toFixed(1)}km
          </Paragraph>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'baseline', gap: 2}}>
          <Icon name="stopwatch" size={12} color={Colors.PRIMARY[1]} />
          <Paragraph
            level={3}
            fontFamily={Fonts.BOLD}
            style={{color: Colors.DARK[3]}}>
            {item?.deliveryTime}min
          </Paragraph>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  restaurantContainer: {
    marginVertical: 15,
    backgroundColor: Colors.LIGHT[1],
    borderRadius: 10,
    padding: 4,
    elevation: 10,
    shadowColor: Colors.LIGHT[3],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  restaurantImage: {
    width: 230,
    height: 100,
    borderRadius: 10,
    backgroundColor: Colors.LIGHT[2],
  },
  restaurantData: {
    padding: 8,
  },
});

export default RestaurantListItem;
