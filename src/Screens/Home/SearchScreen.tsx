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
import MuiIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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
import Button from '../../Components/UI/Button';
import FoodHrListItem from '../../Components/Section/FoodHrListItem';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../State/store';
import SearchFoodList from '../../Components/Section/SearchFoodList';
import {
  searchRestaurantAndFood,
  setSearchQuery,
} from '../../State/Features/RestaurantSlice';
import {
  FoodHrListItemSc,
  RestaurantHrListItemSc,
} from '../../Components/Skeleton';
import {addToBag} from '../../State/Features/CartSlice';
import NoInternet from '../../Components/Errors/NoInternet';

const SearchScreen = ({navigation}: {navigation: any}) => {
  const speechSearchRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const dispatch = useDispatch<AppDispatch>();

  const [activeButton, setActiveButton] = useState(1);
  const [isSpeechModOpen, setIsSpeechModOpen] = useState(false);

  const [selectedModalItem, setSelectedModalItem] = useState<any>(null);
  const [selectedCustom, setSelectedCustom] = useState<any>(null);
  const [selectedItemQty, setSelectedItemQy] = useState<number>(1);

  const [voiceSearchQuery, setVoiceSearchQuery] = useState<string>('');

  const {cart, store} = useSelector((state: RootState) => state.Cart);

  const {search, restaurants} = useSelector(
    (state: RootState) => state.Restaurant,
  );

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

  //handle Customisation Item
  const handleCartOptionModal = (item: any) => {
    setSelectedModalItem(item);
    bottomSheetModalRef.current?.present();
  };
  //Close Customisation Modal
  const closeCartOptionModal = () => {
    bottomSheetModalRef.current?.close();
  };

  //add to cart
  const addToCartHandle = () => {
    //process add to cart func here

    dispatch(
      addToBag({
        item: selectedModalItem,
        customisation: selectedCustom,
        quantity: selectedItemQty,
        store: selectedModalItem?.restaurant,
      }),
    );
    closeCartOptionModal();
    setSelectedItemQy(1);
    setSelectedCustom(null);
  };

  const handleVoiceSearch = async () => {
    await dispatch(setSearchQuery(voiceSearchQuery));
    await closeSpeechSearch();
    await dispatch(searchRestaurantAndFood(search?.query));
  };
  useEffect(() => {
    handleVoiceSearch();
    console.log('Voice=>', voiceSearchQuery);
  }, [voiceSearchQuery]);

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
          <GradientView
            colors={[Colors.PRIMARY[1], Colors.PRIMARY[2]]}
            style={{paddingTop: 60, paddingBottom: 5}}>
            <SearchBar type="TEXT" handleSpeechSearch={handleSpeechSearch} />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 15,
                alignItems: 'center',
                paddingHorizontal: 15,
                gap: 15,
              }}>
              <TouchableOpacity
                onPress={() => setActiveButton(1)}
                style={{
                  borderBottomWidth: 2,
                  borderBlockColor:
                    activeButton === 1 ? Colors.LIGHT[1] : 'transparent',
                  flex: 1,
                  padding: 15,
                  alignItems: 'center',
                }}>
                <Heading
                  level="h5"
                  style={{
                    color: Colors.LIGHT[1],
                  }}>
                  Restaurants
                </Heading>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveButton(2)}
                style={{
                  borderBottomWidth: 2,
                  borderBlockColor:
                    activeButton === 2 ? Colors.LIGHT[1] : 'transparent',
                  flex: 1,
                  padding: 15,
                  alignItems: 'center',
                }}>
                <Heading
                  level="h5"
                  style={{
                    color: Colors.LIGHT[1],
                  }}>
                  Dishes
                </Heading>
              </TouchableOpacity>
            </View>
          </GradientView>

          {activeButton === 1 && (
            <View style={{paddingHorizontal: 15, marginTop: 20}}>
              {search?.loading ? (
                [1, 2, 3, 4, 5, 6]?.map(item => (
                  <View key={String(item)}>
                    <RestaurantHrListItemSc />
                  </View>
                ))
              ) : search?.restaurants?.length > 0 ? (
                search?.restaurants?.map((item: any) => (
                  <RestaurantHrListItem
                    key={item._id}
                    item={item}
                    navigation={navigation}
                  />
                ))
              ) : search?.query === '' ? (
                restaurants?.map((item: any) => (
                  <RestaurantHrListItem
                    key={item._id}
                    item={item}
                    navigation={navigation}
                  />
                ))
              ) : (
                <Text>Nothing to show</Text>
              )}
            </View>
          )}

          {activeButton === 2 && (
            <View style={{paddingHorizontal: 15, marginTop: 20}}>
              {search?.loading ? (
                [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((item: any) => (
                  <View key={String(item)}>
                    <FoodHrListItemSc />
                  </View>
                ))
              ) : search?.foods?.length > 0 ? (
                search?.foods?.map((food: any) => (
                  <View key={food?._id}>
                    <SearchFoodList
                      navigation={navigation}
                      item={food}
                      cartOptionModal={(item: any) =>
                        handleCartOptionModal(item)
                      }
                    />
                  </View>
                ))
              ) : search?.query === '' ? (
                <Text>Type to search</Text>
              ) : (
                <Text>Nothing to show</Text>
              )}
            </View>
          )}
        </ScrollView>

        <Animated.View
          style={[
            styles.StickySearchContainer,
            {top: stickyTop, opacity: stickyOpacity},
          ]}>
          <GradientView
            colors={[Colors.PRIMARY[1], Colors.PRIMARY[2]]}
            style={{flex: 1, justifyContent: 'flex-end', paddingBottom: 15}}>
            <SearchBar type="TEXT" handleSpeechSearch={handleSpeechSearch} />
          </GradientView>
        </Animated.View>

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

        <BottomSheetModalProvider>
          <BottomSheetModal
            animateOnMount
            ref={bottomSheetModalRef}
            snapPoints={['60%']}
            backgroundStyle={{
              backgroundColor: Colors.LIGHT[2],
              borderRadius: 30,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                paddingBottom: 10,
              }}>
              <View style={{gap: 3}}>
                <Heading
                  level="h6"
                  font={Fonts.REGULAR}
                  style={{color: Colors.DARK[3]}}>
                  {selectedModalItem?.name}
                </Heading>
                <Heading
                  level="h3"
                  font={Fonts.BOLD}
                  style={{color: Colors.DARK[2]}}>
                  Customisations
                </Heading>
              </View>
              <TouchableOpacity onPress={() => closeCartOptionModal()}>
                <Icon name="x-circle" size={24} color={Colors.LIGHT[3]} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{
                flex: 1,
                padding: 15,
                height: '100%',
                paddingBottom: 30,
              }}>
              {selectedModalItem?.customizations?.map((custom: any) => (
                <View
                  key={custom._id}
                  style={{
                    backgroundColor: Colors.LIGHT[1],
                    borderRadius: 10,
                    padding: 10,
                    flexDirection: 'column',
                  }}>
                  <Heading level="h5">{custom.name}</Heading>
                  <View style={{gap: 10, marginTop: 10}}>
                    {custom?.options?.map((option: any) => (
                      <View
                        key={option._id}
                        style={{
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                        }}>
                        <Paragraph level={1} style={{color: Colors.DARK[3]}}>
                          {option.name}
                        </Paragraph>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => setSelectedCustom(option)}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                          }}>
                          <Paragraph
                            level={1}
                            fontFamily={Fonts.MEDIUM}
                            style={{color: Colors.DARK[3]}}>
                            ${option.price}- {selectedCustom?._id}
                          </Paragraph>
                          <MuiIcon
                            name={
                              selectedCustom?._id === option._id
                                ? 'circle-slice-8'
                                : 'circle-outline'
                            }
                            size={22}
                            color={Colors.GREEN[1]}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
            <View
              style={{
                paddingHorizontal: 15,
                paddingVertical: 20,
                flexDirection: 'row',
                width: '100%',
                gap: 8,
                backgroundColor: Colors.LIGHT[1],
              }}>
              <View
                style={{
                  flex: 0.6,
                  flexDirection: 'row',
                  borderRadius: 10,
                  overflow: 'hidden',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderColor: Colors.PRIMARY[1],
                  alignItems: 'center',
                  height: 40,
                }}>
                <Button
                  buttonStyle={{borderRadius: 0, width: 45}}
                  onPress={() =>
                    selectedItemQty > 1 &&
                    setSelectedItemQy(selectedItemQty - 1)
                  }>
                  -
                </Button>
                <Heading level="h5">{selectedItemQty}</Heading>
                <Button
                  buttonStyle={{borderRadius: 0, width: 45}}
                  onPress={() => setSelectedItemQy(selectedItemQty + 1)}>
                  +
                </Button>
              </View>
              <View style={{flex: 1}}>
                <Button
                  variant="outline"
                  buttonStyle={{height: 40, borderRadius: 10}}
                  onPress={() => addToCartHandle()}>
                  Add to bag
                </Button>
              </View>
            </View>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </>
    </NoInternet>
  );
};

const NoItem = ({type}: {type: 'RESTAURANT' | 'FOOD'}) => {
  return <Text>No{type}</Text>;
};

export default SearchScreen;

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
