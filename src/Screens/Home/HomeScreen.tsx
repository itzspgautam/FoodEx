import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../../Constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Paragraph from '../../Components/UI/Paragraph';
import Fonts from '../../Constants/Fonts';
import Heading from '../../Components/UI/Heading';
import RestaurantListItem from '../../Components/Section/RestaurantListItem';
import ButtonListItem from '../../Components/Section/ButtonListItem';
import RestaurantHrListItem from '../../Components/Section/RestaurantHrListItem';
import {ScrollView} from 'react-native-gesture-handler';
import GradientView from '../../Components/UI/GradientView';

import Voice from '@react-native-voice/voice';
import SpeechRecognisation from '../../Utils/SpeechRecognisation';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Images from '../../Constants/Images';
import Lottie from 'lottie-react-native';
import SearchBar from '../../Components/Section/SearchBar';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../State/store';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  RestaurantHrListItemSc,
  RestaurantListItemSc,
} from '../../Components/Skeleton';
import {getNearbyRestaurants} from '../../State/Features/RestaurantSlice';
import NoInternet from '../../Components/Errors/NoInternet';

const featuredFood = [
  {
    id: '0',
    title: 'All',
  },
  {
    id: '60df08b1439866186c7df4d6',
    title: 'Biryani',
  },
  {
    id: '60df08b1439866186c7df4f',
    title: 'Burger',
  },
  {
    id: '60df08b1439866186c7df56',
    title: 'Curry',
  },
  {
    id: '60df08b1439866186c7df45',
    title: 'Tandoor',
  },
];
const HomeScreen = ({navigation}: {navigation: any}) => {
  const speechSearchRef = useRef<BottomSheetModal>(null);
  const dispatch = useDispatch<AppDispatch>();

  const {restaurants, loading} = useSelector(
    (state: RootState) => state.Restaurant,
  );
  const {address} = useSelector((state: RootState) => state.Profile);

  const [activeButton, setActiveButton] = useState(featuredFood[0]);
  const [isSpeechModOpen, setIsSpeechModOpen] = useState(false);

  //animate search header on scroll
  const scrollY = new Animated.Value(0);
  const stickyTop = scrollY.interpolate({
    outputRange: [-150, 0],
    inputRange: [0, 200],
    extrapolate: 'clamp',
  });
  const stickyOpacity = scrollY.interpolate({
    outputRange: [0, 1],
    inputRange: [0, 100],
    extrapolate: 'clamp',
  });

  //Open Speech search Modal
  const handleSpeechSearch = (item: any) => {
    speechSearchRef.current?.present();
    setIsSpeechModOpen(true);
  };
  //Close Speech search Modal
  const closeSpeechSearch = () => {
    speechSearchRef.current?.close();
    setIsSpeechModOpen(false);
  };

  useEffect(() => {
    dispatch(getNearbyRestaurants());
  }, []);
  return (
    <NoInternet>
      <>
        {isSpeechModOpen && (
          <TouchableOpacity
            activeOpacity={0}
            onPress={closeSpeechSearch}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black
              zIndex: 1, // place it above other elements
            }}
          />
        )}
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            hidden={false}
            barStyle="light-content"
            showHideTransition={'fade'}
          />
          <ScrollView
            style={styles.container}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {
                useNativeDriver: false,
              },
            )}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={{gap: 2}}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('LocationList')}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    gap: 4,
                  }}>
                  <Paragraph
                    level={2}
                    fontFamily={Fonts.REGULAR}
                    style={{color: Colors.LIGHT[3]}}>
                    Your Location
                  </Paragraph>
                  <Icon name="chevron-down" size={14} color={Colors.LIGHT[3]} />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    gap: 3,
                  }}>
                  <Icon name="location" size={16} color={Colors.PRIMARY[1]} />
                  <Heading
                    level="h6"
                    font={Fonts.MEDIUM}
                    style={{color: Colors.DARK[1]}}>
                    {address?.active?._id == '0'
                      ? address?.active?.streetHouseNumber
                      : `${address?.active?.landmark},${address?.active?.streetHouseNumber},${address?.active?.area}`.slice(
                          0,
                          30,
                        ) + '...'}
                  </Heading>
                </View>
              </TouchableOpacity>
              <View>
                <Icon name="bell" size={22} color={Colors.DARK[1]} />
              </View>
            </View>
            <SearchBar type="BUTTON" handleSpeechSearch={handleSpeechSearch} />

            {loading ? (
              <FlatList
                data={[1, 2, 3, 4]}
                keyExtractor={(item: any) => String(item)}
                renderItem={({item}) => <RestaurantListItemSc />}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 15, marginTop: 5}}
                ItemSeparatorComponent={() => <View style={{width: 10}} />}
              />
            ) : (
              <FlatList
                data={restaurants}
                keyExtractor={item => item?._id}
                renderItem={({item}) => (
                  <RestaurantListItem item={item} navigation={navigation} />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 15, marginTop: 5}}
                ItemSeparatorComponent={() => <View style={{width: 10}} />}
              />
            )}

            <View style={{marginTop: 15}}>
              <FlatList
                data={featuredFood}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <ButtonListItem
                    item={item}
                    activeButton={activeButton}
                    setActiveButton={setActiveButton}
                    icon={
                      <Icon
                        name="flame"
                        color={
                          activeButton.id === item.id
                            ? Colors.LIGHT[1]
                            : Colors.LIGHT[3]
                        }
                        size={16}
                      />
                    }
                  />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 15}}
                ItemSeparatorComponent={() => <View style={{width: 10}} />}
              />
            </View>

            <View style={{paddingHorizontal: 15, marginTop: 20}}>
              {loading
                ? [1, 2, 3, 4, 5, 6]?.map(item => (
                    <RestaurantHrListItemSc key={item} />
                  ))
                : restaurants?.map(item => (
                    <RestaurantHrListItem
                      key={item._id}
                      item={item}
                      navigation={navigation}
                    />
                  ))}
            </View>
          </ScrollView>

          <Animated.View
            style={[
              styles.StickySearchContainer,
              {top: stickyTop, opacity: stickyOpacity},
            ]}>
            <GradientView
              colors={[Colors.PRIMARY[1], Colors.PRIMARY[2]]}
              style={{flex: 1, justifyContent: 'flex-end', paddingBottom: 15}}>
              <SearchBar
                type="BUTTON"
                handleSpeechSearch={handleSpeechSearch}
              />
            </GradientView>
          </Animated.View>
        </SafeAreaView>

        <BottomSheetModalProvider>
          <BottomSheetModal
            containerStyle={{zIndex: 2}}
            animateOnMount
            ref={speechSearchRef}
            snapPoints={['25%']}
            backgroundStyle={{
              backgroundColor: Colors.LIGHT[2],
              borderRadius: 30,
            }}>
            <SpeechRecognisation closeSpeechSearch={closeSpeechSearch} />
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </>
    </NoInternet>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT[1],
  },
  headerContainer: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  StickySearchContainer: {
    height: 120,
    opacity: 1,
    top: -120,
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: Colors.PRIMARY[2],
  },
});
