import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../Constants/Colors';
import Heading from '../UI/Heading';
import Fonts from '../../Constants/Fonts';
import Paragraph from '../UI/Paragraph';
import Icon from 'react-native-vector-icons/Octicons';
import ShadowBox from '../UI/ShadowBox';
import {Restaurant} from '../../State/Features/RestaurantSlice';

interface RestaurantItemProps {
  item: Restaurant;
  navigation: any;
}

const RestaurantHrListItem: React.FC<RestaurantItemProps> = ({
  item,
  navigation,
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => navigation.navigate('Restaurant', {restaurant: item})}>
    <ShadowBox style={styles.restaurantContainer}>
      <Image source={{uri: item?.logo}} style={styles.restaurantImage} />
      <View style={styles.restaurantData}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1,
          }}>
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

            <Paragraph level={4} style={{color: Colors.DARK[3], marginTop: 3}}>
              {item?.address}
            </Paragraph>
          </View>
        </View>
        <View style={{flexDirection: 'row', gap: 10, marginTop: 3}}>
          <IconFlex
            icon="location"
            text={`${(item?.distance / 1000).toFixed(1)}km`}
          />
          <IconFlex icon="stopwatch" text={`${item?.deliveryTime}min`} />
          <IconFlex icon="feed-star" text={`${item?.rating}`} />
        </View>
      </View>
      <Icon name="heart" size={20} color={Colors.PRIMARY[1]} />
    </ShadowBox>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  restaurantContainer: {
    marginVertical: 5,
    backgroundColor: Colors.LIGHT[1],
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: Colors.LIGHT[2],
  },
  restaurantData: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    flex: 1,
  },
});

const IconFlex = ({icon, text}: {icon?: any; text?: string}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'baseline', gap: 2}}>
      <Icon name={icon} size={12} color={Colors.PRIMARY[1]} />
      <Paragraph
        level={3}
        fontFamily={Fonts.BOLD}
        style={{color: Colors.DARK[3]}}>
        {text}
      </Paragraph>
    </View>
  );
};
export default RestaurantHrListItem;
