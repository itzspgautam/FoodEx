import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import GradientView from '../../../Components/UI/GradientView';
import Colors from '../../../Constants/Colors';
import Lottie from 'lottie-react-native';
import Images from '../../../Constants/Images';
import Heading from '../../../Components/UI/Heading';
import Paragraph from '../../../Components/UI/Paragraph';
import Fonts from '../../../Constants/Fonts';
import Button from '../../../Components/UI/Button';
import {navigate} from '../../../Utils/NavigationUtils';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../State/store';
import {clearCart} from '../../../State/Features/CartSlice';
const OrderSuccessScreen = () => {
  return (
    <GradientView
      colors={[Colors.PRIMARY[1], Colors.PRIMARY[2]]}
      style={styles.container}>
      <View style={{alignItems: 'center', height: 300}}>
        <View style={{height: 300, width: 300}}>
          <Lottie
            source={Images.GIF.ORDER_CONFIRMED}
            autoPlay
            resizeMode="contain"
            loop={false}
          />
        </View>
        <Heading level="h3" style={{color: Colors.LIGHT[1], marginTop: -60}}>
          Order Received!
        </Heading>
      </View>
      <Heading level="h4" style={{color: Colors.LIGHT[1], textAlign: 'center'}}>
        Thanks for placing your order.
      </Heading>
      <Paragraph
        level={2}
        fontFamily={Fonts.MEDIUM}
        style={{
          color: Colors.LIGHT[2],
          textAlign: 'center',
          paddingHorizontal: 20,
          marginTop: 5,
          opacity: 0.8,
        }}>
        Your food is now being prepared and will be out for delivery soon. You
        can track your order's progress live on our app.
      </Paragraph>
      <Heading
        level="h6"
        style={{color: Colors.LIGHT[1], textAlign: 'center', marginTop: 15}}>
        Estimated Delivery Time: 35min
      </Heading>

      <View style={{marginTop: 40, gap: 10}}>
        <Button variant="outline">Track Order</Button>
        <Button onPress={() => navigate('Home')}>Go to Home</Button>
      </View>
    </GradientView>
  );
};

export default OrderSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 15,
  },
});
