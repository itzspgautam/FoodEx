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

interface Food {
  id: string;
  restaurantName: string;
  location: string;
  image: string;
  tags: string[];
  distance: number;
  rating: number;
}

interface FoodItemProps {
  item: any;
  navigation: any;
  cartOptionModal?: any;
}

const FoodHrListItem: React.FC<FoodItemProps> = ({
  item,
  navigation,
  cartOptionModal,
}) => {
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
              {item.name}
            </Heading>
            <Paragraph level={3} style={{color: Colors.DARK[3], marginTop: 2}}>
              {'This is about'}
              {item?._id}
            </Paragraph>
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
              ₹599
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
                ₹{item?.customizations[0]?.options[0].price}
              </Paragraph>
            </GradientView>
          </View>
        </View>
      </View>
      <View style={{justifyContent: 'flex-end'}}>
        <TouchableOpacity onPress={() => cartOptionModal(item)}>
          <GradientView
            colors={[Colors.PRIMARY[1], Colors.PRIMARY[2]]}
            style={{
              height: 25,
              width: 25,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 32,
            }}>
            <Icon name="plus" size={18} color={Colors.LIGHT[1]} />
          </GradientView>
        </TouchableOpacity>
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
    width: 65,
    height: 65,
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
export default FoodHrListItem;
