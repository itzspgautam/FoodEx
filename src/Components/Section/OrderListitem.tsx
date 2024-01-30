import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../Constants/Colors';
import Heading from '../UI/Heading';
import Fonts from '../../Constants/Fonts';
import Paragraph from '../UI/Paragraph';
import Icon from 'react-native-vector-icons/Octicons';
import {Restaurant} from '../../State/Features/RestaurantSlice';
import {singleOrderProps} from '../../State/Features/OrderSlice';
import ShadowBox from '../UI/ShadowBox';
import Button from '../UI/Button';

const OrderListItem = ({
  item,
  navigation,
}: {
  item: singleOrderProps;
  navigation: any;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('OrderDetail', {orderId: item?._id})}>
      <ShadowBox style={styles.restaurantContainer}>
        <Image
          source={{uri: item?.restaurant?.banner}}
          style={styles.restaurantImage}
        />
        <View
          style={{
            position: 'absolute',
            backgroundColor: Colors.DARK[1],
            padding: 5,
            margin: 4,
            borderBottomEndRadius: 8,
            borderTopLeftRadius: 8,
            borderBottomWidth: 2,
            borderRightWidth: 2,
            borderColor: Colors.LIGHT[1],
          }}>
          <Heading
            level="h6"
            style={{
              color: Colors.LIGHT[1],
              fontFamily: Fonts.MEDIUM,
              fontSize: 12,
            }}>
            {item?.status.toUpperCase()}
          </Heading>
        </View>
        <View style={styles.restaurantData}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Heading
                level="h5"
                font={Fonts.BOLD}
                style={{color: Colors.DARK[2], maxWidth: 200}}
                numberOfLines={1}>
                From {item?.restaurant?.name}
              </Heading>
              <Paragraph
                level={3}
                style={{color: Colors.DARK[3], marginTop: 4}}>
                {item?.items[0].food.name}{' '}
                {item?.items.length - 1 > 0 &&
                  '+' + item?.items.length + ' items'}
              </Paragraph>
            </View>
            <View
              style={{flexDirection: 'column', alignItems: 'center', gap: 3}}>
              <Icon name="feed-star" size={20} color={Colors.PRIMARY[1]} />
              <Paragraph
                level={3}
                fontFamily={Fonts.BOLD}
                style={{color: Colors.DARK[3]}}>
                {item?.rating}4.4
              </Paragraph>
            </View>
          </View>
          <View style={{flexDirection: 'row', gap: 5, marginTop: 10}}>
            {item.status === 'completed' ? (
              <>
                <View style={{flex: 1}}>
                  <Button
                    height={30}
                    textStyle={{fontFamily: Fonts.MEDIUM, fontSize: 14}}>
                    Order Again
                  </Button>
                </View>
                <View style={{flex: 1}}>
                  <Button
                    variant="outline"
                    height={30}
                    textStyle={{fontFamily: Fonts.MEDIUM, fontSize: 14}}>
                    Rate Food
                  </Button>
                </View>
              </>
            ) : (
              <>
                <View style={{flex: 1}}>
                  <Button
                    height={30}
                    textStyle={{fontFamily: Fonts.MEDIUM, fontSize: 14}}>
                    Track Order
                  </Button>
                </View>
                {item.status === 'processing' && (
                  <View style={{flex: 1}}>
                    <Button
                      variant="outline"
                      height={30}
                      textStyle={{fontFamily: Fonts.MEDIUM, fontSize: 14}}>
                      Cancel
                    </Button>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </ShadowBox>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  restaurantContainer: {
    backgroundColor: Colors.LIGHT[1],
    borderRadius: 10,
    padding: 4,
    flexDirection: 'column',
  },
  restaurantImage: {
    width: 220,
    height: 90,
    borderRadius: 10,
    backgroundColor: Colors.LIGHT[2],
  },
  restaurantData: {
    padding: 8,
  },
});

export default OrderListItem;
