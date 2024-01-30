import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../Constants/Colors';
import Heading from '../UI/Heading';
import Fonts from '../../Constants/Fonts';
import Paragraph from '../UI/Paragraph';
import Icon from 'react-native-vector-icons/Octicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ShadowBox from '../UI/ShadowBox';
import GradientView from '../UI/GradientView';
import Button from '../UI/Button';
import {useDispatch} from 'react-redux';
import {updateQuantity} from '../../State/Features/CartSlice';
import {AppDispatch} from '../../State/store';

interface FoodItemProps {
  item: any;
  navigation: any;
}

const CartHrListItem: React.FC<FoodItemProps> = ({item, navigation}) => {
  const dispatch = useDispatch<AppDispatch>();

  const calcPrice = (customisation: any, quantity: number) => {
    let price = 0;
    let regular = 0;
    for (const custom of customisation) {
      const {name, option} = custom;
      price += option.salePrice;
      regular += option.regularPrice;
    }
    return {salePrice: price * quantity, regularPrice: regular * quantity};
  };
  return (
    <ShadowBox style={styles.foodContainer}>
      <Image
        source={{
          uri: 'https://static.toiimg.com/thumb/76045977.cms?width=680&height=512&imgsize=311154',
        }}
        style={styles.foodImage}
      />
      <View style={styles.restaurantData}>
        <View
          style={{
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <View>
            <Heading
              level="h5"
              font={Fonts.BOLD}
              style={{color: Colors.DARK[2], maxWidth: 200}}
              numberOfLines={1}>
              {item?.item?.name}
            </Heading>
            {item?.customisation.map((custom: any) => (
              <Paragraph
                key={custom?.name}
                level={3}
                style={{color: Colors.DARK[3], marginTop: 2}}>
                {custom.name}: {custom?.option?.name}
              </Paragraph>
            ))}
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'flex-end',
            }}>
            <Paragraph
              level={3}
              style={{
                color: Colors.LIGHT[3],
                textDecorationLine: 'line-through',
                opacity: 0.8,
              }}>
              ₹{calcPrice(item.customisation, item.quantity).regularPrice}
            </Paragraph>
            <GradientView
              colors={[Colors.PRIMARY[1], Colors.PRIMARY[2]]}
              style={{borderRadius: 32, padding: 2, paddingHorizontal: 4}}>
              <Paragraph
                level={3}
                fontFamily={Fonts.BOLD}
                style={{
                  color: Colors.LIGHT[1],
                }}>
                ₹{calcPrice(item.customisation, item.quantity).salePrice}
              </Paragraph>
            </GradientView>
          </View>
        </View>
      </View>
      <View style={{justifyContent: 'center'}}>
        <View
          style={{
            backgroundColor: Colors.LIGHT[2],
            paddingHorizontal: 10,
            flexDirection: 'row',
            gap: 4,
            width: 100,
            height: 40,
            overflow: 'hidden',
            borderRadius: 32,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() =>
              dispatch(updateQuantity({action: 'REMOVE', cartItem: item}))
            }>
            <Heading level={'h2'} font={Fonts.REGULAR}>
              -
            </Heading>
          </TouchableOpacity>
          <Paragraph level={1}>{item?.quantity}</Paragraph>
          <TouchableOpacity
            onPress={() =>
              dispatch(updateQuantity({action: 'ADD', cartItem: item}))
            }>
            <Heading level={'h2'} font={Fonts.REGULAR}>
              +
            </Heading>
          </TouchableOpacity>
        </View>
      </View>
    </ShadowBox>
  );
};

const styles = StyleSheet.create({
  foodContainer: {
    marginVertical: 5,
    backgroundColor: Colors.LIGHT[1],
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: Colors.LIGHT[2],
  },
  restaurantData: {
    paddingHorizontal: 8,
    paddingVertical: 4,
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
export default CartHrListItem;
