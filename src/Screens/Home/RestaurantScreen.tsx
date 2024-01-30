import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../Constants/Colors';
import {Header} from '../../Components/Section';
import Icon from 'react-native-vector-icons/Octicons';
import MuiIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native-gesture-handler';
import Heading from '../../Components/UI/Heading';
import Paragraph from '../../Components/UI/Paragraph';
import Fonts from '../../Constants/Fonts';
import ButtonListItem from '../../Components/Section/ButtonListItem';
import FoodHrListItem from '../../Components/Section/FoodHrListItem';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Button from '../../Components/UI/Button';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../State/store';
import {addToBag} from '../../State/Features/CartSlice';
import GradientView from '../../Components/UI/GradientView';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getMenu} from '../../State/Features/RestaurantSlice';
import {ButtonListItemSc, FoodHrListItemSc} from '../../Components/Skeleton';
import {isRestaurantOpen} from '../../Utils/RestaurantUtils';
import Lottie from 'lottie-react-native';
import Images from '../../Constants/Images';
const RestaurantScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {restaurant} = route.params;

  const dispatch = useDispatch<AppDispatch>();
  const fooItemsRef = useRef<FlatList>(null);
  const categoryListRef = useRef<FlatList>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isSpeechModOpen, setIsSpeechModOpen] = useState(false);

  //selector
  const {cart, store, info} = useSelector((state: RootState) => state.Cart);
  const {selected} = useSelector((state: RootState) => state.Restaurant);

  //State and vars
  const imageBgGrHeight = 250;
  const [selectedModalItem, setSelectedModalItem] = useState<any>(null);
  const [selectedCustom, setSelectedCustom] = useState<any>([]);
  const [selectedItemQty, setSelectedItemQy] = useState<number>(1);

  const [activeButton, setActiveButton] = useState<any>({title: null});

  //scroll to item after clicking category
  const scrollToCategory = (item: any) => {
    console.log('scrool', item);
    fooItemsRef.current?.scrollToIndex({index: item.index, animated: true});
  };

  //Open Custumisation Modal
  const handleCartOptionModal = (item: any) => {
    setSelectedModalItem(item);
    bottomSheetModalRef.current?.present();
    setSelectedCustom([
      {
        name: item?.customizations[0].name,
        option: item?.customizations[0].options[0],
      },
    ]);
    console.log(selectedCustom);
    setIsSpeechModOpen(true);
  };
  //Close Customisation Modal
  const closeCartOptionModal = () => {
    bottomSheetModalRef.current?.close();
    setIsSpeechModOpen(false);
  };

  //handle select custom
  const handleSelectCustom = (custom: any, option: any) => {
    if (selectedCustom === null) {
      setSelectedCustom([{name: custom.name, option}]);
      return;
    }

    const existingOptionIndex = selectedCustom?.findIndex(
      (item: any) => item.name === custom.name,
    );
    if (existingOptionIndex !== -1) {
      const updatedSelectedCustom = [...selectedCustom];
      updatedSelectedCustom[existingOptionIndex] = {name: custom.name, option};
      setSelectedCustom(updatedSelectedCustom);
    } else {
      const updatedSelectedCustom = [
        ...selectedCustom,
        {name: custom.name, option},
      ];
      setSelectedCustom(updatedSelectedCustom);
    }
    console.log(selectedCustom);
  };

  //add to cart
  const addToCartHandle = () => {
    //process add to cart func here
    dispatch(
      addToBag({
        item: selectedModalItem,
        customisation: selectedCustom,
        quantity: selectedItemQty,
        store: restaurant,
      }),
    );
    closeCartOptionModal();
    setSelectedItemQy(1);
    setSelectedCustom(null);
  };

  useEffect(() => {
    dispatch(getMenu({_id: restaurant._id}));
  }, []);

  return (
    <View style={styles.container}>
      {isSpeechModOpen && (
        <TouchableOpacity
          activeOpacity={0}
          onPress={closeCartOptionModal}
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
        backgroundColor={'transparent'}
        barStyle={'light-content'}
        showHideTransition="fade"
      />

      <View style={{zIndex: 1}}>
        <Header
          navigation={navigation}
          rightItem={<Icon name="heart" size={20} color={Colors.RED[1]} />}
        />
      </View>
      <View style={styles.upperSection}>
        <ImageBackground
          source={{uri: restaurant?.banner}}
          style={{height: imageBgGrHeight}}>
          <LinearGradient
            colors={['rgba(0,0,0,.2)', 'rgba(0,0,0,.8)', 'rgba(0,0,0,1)']}
            style={{
              height: imageBgGrHeight,
              width: '100%',
              position: 'absolute',
            }}
          />

          <View style={styles.topInfoWrapper}>
            <View style={styles.storeInfo}>
              <View style={styles.storeLogoBox}>
                <Image
                  source={{uri: restaurant?.logo}}
                  resizeMode="cover"
                  style={styles.storeLogo}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Heading
                    level="h3"
                    style={{color: Colors.LIGHT[1], marginBottom: 4}}>
                    {restaurant?.name}{' '}
                  </Heading>

                  <IconFlex icon="location" text={restaurant?.address} />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    gap: 2,
                  }}>
                  <Icon name="star-fill" size={18} color={Colors.PRIMARY[2]} />
                  <Icon name="star-fill" size={18} color={Colors.PRIMARY[2]} />
                  <Icon name="star-fill" size={18} color={Colors.PRIMARY[2]} />
                  <Icon name="star" size={18} color={Colors.PRIMARY[2]} />
                  <Icon name="star" size={18} color={Colors.PRIMARY[2]} />
                  <Paragraph
                    level={3}
                    fontFamily={Fonts.LIGHT}
                    style={{color: Colors.LIGHT[2]}}>
                    243 Reviews
                  </Paragraph>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingTop: imageBgGrHeight,
        }}>
        <View style={{marginVertical: 20}}>
          {selected?.loading ? (
            <FlatList
              data={[1, 2, 3, 4, 5, 6]}
              keyExtractor={item => String(item)}
              renderItem={item => <ButtonListItemSc />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: 15}}
              ItemSeparatorComponent={() => <View style={{width: 8}} />}
            />
          ) : (
            <FlatList
              ref={categoryListRef}
              onScroll={event => console.log(event)}
              data={selected?.menu && Object.keys(selected?.menu)}
              keyExtractor={item => item}
              renderItem={item => (
                <ButtonListItem
                  item={{title: item.item}}
                  activeButton={activeButton}
                  setActiveButton={setActiveButton}
                  onPress={() => scrollToCategory(item)}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: 15}}
              ItemSeparatorComponent={() => <View style={{width: 10}} />}
            />
          )}
        </View>

        {selected?.loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7]}
            keyExtractor={item => String(item)} // Assuming 'id' is a unique identifier for each food item
            renderItem={({item: food}) => <FoodHrListItemSc />}
          />
        ) : (
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingBottom: cart?.length > 0 ? 130 : 15,
            }}
            ref={fooItemsRef}
            data={selected?.menu && Object.entries(selected?.menu)}
            keyExtractor={([category]) => category}
            renderItem={({item: [category, foods]}) => (
              <View style={{marginTop: 15}}>
                <Heading
                  level="h6"
                  font={Fonts.MEDIUM}
                  style={{color: Colors.LIGHT[3]}}>
                  {category} ({foods.length})
                </Heading>

                <FlatList
                  data={foods}
                  keyExtractor={food => food._id} // Assuming 'id' is a unique identifier for each food item
                  renderItem={({item: food}) => (
                    <FoodHrListItem
                      navigation={navigation}
                      item={food}
                      cartOptionModal={(item: any) =>
                        handleCartOptionModal(item)
                      }
                    />
                  )}
                />
              </View>
            )}
          />
        )}
      </View>

      {cart?.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Cart')}
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 0,
            padding: 15,
            justifyContent: 'flex-end',
          }}>
          <SafeAreaView edges={['bottom']}>
            <GradientView
              colors={[Colors.PRIMARY[1], Colors.PRIMARY[2]]}
              style={{
                backgroundColor: 'green',
                padding: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <View style={{gap: 4}}>
                <Heading level="h4" style={{color: Colors.LIGHT[1]}}>
                  {info?.total_quantity} Item | ₹{info?.total}
                </Heading>
                <Paragraph
                  level={3}
                  style={{color: Colors.LIGHT[1]}}
                  fontFamily={Fonts.MEDIUM}>
                  {store?._id !== restaurant._id
                    ? `From: ${store.name}`
                    : 'Extra charge may apply'}
                </Paragraph>
              </View>
              <Heading level="h4" style={{color: Colors.LIGHT[1]}}>
                View Cart
              </Heading>
            </GradientView>
          </SafeAreaView>
        </TouchableOpacity>
      )}

      {isRestaurantOpen(restaurant?.operationHours)?.isOpen === false && (
        <View
          style={{
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            position: 'absolute',
            alignItems: 'center',
            paddingTop: imageBgGrHeight - 80,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <Lottie
            source={Images.GIF.CLOSED_BOARD}
            autoPlay
            style={{height: 300}}
          />
          <GradientView
            colors={[Colors.PRIMARY[1], Colors.PRIMARY[2]]}
            style={{
              backgroundColor: Colors.PRIMARY[2],
              marginTop: -50,
              width: '100%',
              alignItems: 'center',
              padding: 5,
            }}>
            <Heading
              level="h5"
              style={{color: Colors.LIGHT[1], textAlign: 'center'}}>
              {isRestaurantOpen(restaurant?.operationHours)?.message}
            </Heading>
          </GradientView>
        </View>
      )}

      <BottomSheetModalProvider>
        <BottomSheetModal
          containerStyle={{zIndex: 2}}
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
                key={custom.name}
                style={{
                  backgroundColor: Colors.LIGHT[1],
                  borderRadius: 10,
                  padding: 10,
                  flexDirection: 'column',
                  marginTop: 15,
                }}>
                <Heading level="h5">{custom.name}</Heading>
                <View style={{gap: 10, marginTop: 10}}>
                  {custom?.options?.map((option: any) => (
                    <View
                      key={custom.name + '-' + option._id}
                      style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}>
                      <Paragraph level={1} style={{color: Colors.DARK[3]}}>
                        {option.name}
                      </Paragraph>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleSelectCustom(custom, option)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                        }}>
                        <Paragraph
                          level={1}
                          fontFamily={Fonts.REGULAR}
                          style={{
                            color: Colors.LIGHT[3],
                            fontSize: 12,
                            textDecorationLine: 'line-through',
                            opacity: 0.8,
                            marginRight: 5,
                          }}>
                          ₹{option.regularPrice}
                        </Paragraph>
                        <Paragraph
                          level={1}
                          fontFamily={Fonts.MEDIUM}
                          style={{color: Colors.DARK[3]}}>
                          ₹{option.salePrice}
                        </Paragraph>
                        <MuiIcon
                          name={
                            selectedCustom &&
                            selectedCustom.find(
                              (item: any) => item.name === custom.name,
                            )?.option?._id === option._id
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
                  selectedItemQty > 1 && setSelectedItemQy(selectedItemQty - 1)
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
    </View>
  );
};

const IconFlex = ({icon, text}: {icon: any; text: string}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'baseline', gap: 2}}>
      <Icon name={icon} size={14} color={Colors.LIGHT[2]} />
      <Paragraph
        level={2}
        fontFamily={Fonts.MEDIUM}
        style={{color: Colors.LIGHT[2]}}>
        {text}
      </Paragraph>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.LIGHT[1],
  },

  upperSection: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  topInfoWrapper: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    justifyContent: 'flex-end',
    height: '100%',
    padding: 10,
  },

  storeInfo: {
    backgroundColor: 'rgba(255,255,255,.1)',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
  },
  storeLogoBox: {
    height: 70,
    width: 70,
    backgroundColor: Colors.LIGHT[1],
    borderRadius: 10,
    padding: 2,
    overflow: 'hidden',
  },
  storeLogo: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
  },

  stickyRestaurantInfo: {
    opacity: 1,
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
export default RestaurantScreen;
