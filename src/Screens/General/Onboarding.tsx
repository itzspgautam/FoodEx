import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Images from '../../Constants/Images';

import Colors from '../../Constants/Colors';
import Button from '../../Components/UI/Button';
import Heading from '../../Components/UI/Heading';
import Paragraph from '../../Components/UI/Paragraph';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../State/store';
import {setFirstTime} from '../../State/Features/GeneralSlice';

const onboardingData = [
  {
    title: 'Discover Local Delights',
    subtitle:
      'Explore and Order from a Variety of Nearby Restaurants to Satisfy Your Cravings and Delight Your Taste Buds',
    image: Images.ONBORDING[1],
    backgroundColor: '#FFF',
  },
  {
    title: 'Quick and Easy Delivery',
    subtitle:
      'Indulge in Delicious Meals Delivered Right to Your Doorstep, Ensuring Convenience and Satisfaction',
    image: Images.ONBORDING[2],
    ackgroundColor: '#FFF',
  },
  {
    title: 'Your Culinary Companion',
    subtitle:
      'Discover, Order, and Enjoy a Wide Array of Local Cuisine Effortlessly with Our User-Friendly App',
    image: Images.ONBORDING[3],
    backgroundColor: '#FFF',
  },
];

const OnboardingScreen = ({navigation}: {navigation: any}) => {
  const onboardingRef = useRef<FlatList>(null);
  const dispatch = useDispatch<AppDispatch>();

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    console.log('Curr', currentIndex);
    if (currentIndex < onboardingData.length - 1) {
      onboardingRef.current?.scrollToIndex({index: currentIndex + 1});
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    onboardingRef.current?.scrollToEnd();
    setCurrentIndex(onboardingData.length - 1);
  };

  const handleFinish = () => {
    dispatch(setFirstTime(false));
  };

  const renderOnboardingItem = ({item}: {item: any}) => {
    return (
      <View style={styles.singleIntem}>
        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={{gap: 10, paddingHorizontal: 20}}>
          <Heading level="h3" style={{textAlign: 'center'}}>
            {item.title}
          </Heading>
          <Paragraph
            level={2}
            style={{
              color: Colors.DARK[3],
              textAlign: 'center',
              lineHeight: 16,
            }}>
            {item.subtitle}
          </Paragraph>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={onboardingRef}
        data={onboardingData}
        renderItem={renderOnboardingItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / Dimensions.get('window').width,
          );
          console.log('New Index', newIndex);
          setCurrentIndex(newIndex);
        }}
      />

      <SafeAreaView edges={['bottom']} style={{marginBottom: 15}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 5,
            marginBottom: 80,
          }}>
          {onboardingData?.map((item, i) => (
            <View
              key={i}
              style={{
                height: 10,
                width: currentIndex === i ? 20 : 10,
                borderRadius: 32,
                backgroundColor:
                  currentIndex === i ? Colors.PRIMARY[2] : 'rgba(0,0,0,.2)',
              }}
            />
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
          }}>
          {currentIndex === onboardingData.length - 1 ? (
            <View style={{flex: 1}}>
              <Button onPress={handleFinish}>Get Started</Button>
            </View>
          ) : (
            <>
              <Button
                variant="outline"
                buttonStyle={{paddingHorizontal: 20}}
                onPress={() => handleSkip()}>
                Skip
              </Button>
              <Button
                buttonStyle={{paddingHorizontal: 20}}
                onPress={() => handleNext()}>
                Next
              </Button>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT[1],
  },
  singleIntem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    gap: 20,
  },
  image: {
    height: 400,
  },
});
