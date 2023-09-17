import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Images from '../../Constants/Images';
import Heading from '../UI/Heading';
import Button from '../UI/Button';
import Paragraph from '../UI/Paragraph';
import Colors from '../../Constants/Colors';

const EmptyCart = () => {
  return (
    <View style={styles.container}>
      <Image
        source={Images.ERROR.EMPTY_CART}
        resizeMode="contain"
        style={{height: 300, width: '100%'}}
      />
      <View
        style={{
          paddingHorizontal: 20,
          alignItems: 'center',
          gap: 5,
        }}>
        <Heading level="h3">Your bag is empty!</Heading>
        <Paragraph
          level={2}
          style={{textAlign: 'center', color: Colors.DARK[3], lineHeight: 16}}>
          Your plate is still empty. explore exiting menu and choose your mood
          for the day.
        </Paragraph>
      </View>
      <Button variant="outline" containerStyle={{marginTop: 30, width: '60%'}}>
        Explore Restaurant
      </Button>
    </View>
  );
};

export default EmptyCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: '15%',
  },
});
