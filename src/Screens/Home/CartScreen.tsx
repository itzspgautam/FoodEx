import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Header} from '../../Components/Section';
import Icon from 'react-native-vector-icons/Octicons';
import MuiIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../Constants/Colors';
import {FlatList} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../State/store';
import CartHrListItem from '../../Components/Section/CartHrListItem';
import Heading from '../../Components/UI/Heading';
import {clearCart} from '../../State/Features/CartSlice';
import Fonts from '../../Constants/Fonts';
import Button from '../../Components/UI/Button';
import Paragraph from '../../Components/UI/Paragraph';
import EmptyCart from '../../Components/Errors/EmptyCart';
import NoInternet from '../../Components/Errors/NoInternet';
import ShadowBox from '../../Components/UI/ShadowBox';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {AddressListSkeleton} from '../../Components/Skeleton';
import AddressListItem from '../../Components/Section/AddressListItem';
import {
  SingleAddress,
  getAddresses,
  selectAddress,
} from '../../State/Features/ProfileSlice';
import {navigate} from '../../Utils/NavigationUtils';
import {createOrder, orderFlow} from '../../State/Features/OrderSlice';
import {openRazorpay} from '../../Utils/PaymentUtils';

const CartScreen = ({navigation}: {navigation: any}) => {
  const dispatch = useDispatch<AppDispatch>();
  const addressSelectRef = useRef<BottomSheetModal>(null);

  const {restaurants} = useSelector((state: RootState) => state.Restaurant);

  const {cart, store, info} = useSelector((state: RootState) => state.Cart);
  const {address} = useSelector((state: RootState) => state.Profile);
  const {newOrder} = useSelector((state: RootState) => state.Order);

  const [isModalopen, setIsModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'ONLINE'>('ONLINE');

  //Open Speech search Modal
  const handleAddressSelect = (item: any) => {
    addressSelectRef.current?.present();
    dispatch(getAddresses());
    setIsModalOpen(true);
  };
  //Close Speech search Modal
  const closeAddressSelect = () => {
    addressSelectRef.current?.close();
    setIsModalOpen(false);
  };

  const setActiveAddres = (address: SingleAddress) => {
    dispatch(selectAddress(address));
    //navigation.navigate('Home');
  };

  const createOrderHandle = async () => {
    try {
      const resultAction = await dispatch(orderFlow({mode: paymentMode}));
      if (resultAction.meta.requestStatus === 'fulfilled') {
        await dispatch(clearCart());
      }
    } catch (error) {}
  };

  return (
    <NoInternet>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {isModalopen && (
          <TouchableOpacity
            activeOpacity={0}
            onPress={closeAddressSelect}
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
        <Header
          navigation={navigation}
          centerItem={
            cart?.length > 0 && (
              <TouchableOpacity
                style={{alignItems: 'center', gap: 2}}
                onPress={() =>
                  navigation.navigate('Restaurant', {restaurant: store})
                }>
                <Heading level="h4">{store?.name}</Heading>
                <Paragraph level={2}>View Menu</Paragraph>
              </TouchableOpacity>
            )
          }
          rightItem={
            <TouchableOpacity onPress={() => dispatch(clearCart())}>
              <Icon name="trash" size={20} color={Colors.RED[1]} />
            </TouchableOpacity>
          }
        />
        {cart.length < 1 ? (
          <EmptyCart />
        ) : (
          <>
            <ScrollView style={styles.upperSection}>
              {restaurants?.filter((item: any) => item?._id === store?._id)
                .length === 0 && (
                <View
                  style={{
                    backgroundColor: Colors.RED[2],
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                  <Icon name="alert" color={Colors.LIGHT[1]} size={24} />
                  <Paragraph
                    level={2}
                    fontFamily={Fonts.BOLD}
                    style={{color: Colors.LIGHT[1], paddingRight: 15}}>
                    Services of this restaurant are unavailable in your area.
                  </Paragraph>
                </View>
              )}

              {cart.map((item: any) => (
                <CartHrListItem
                  key={item.item?._id + '-' + Math.random()}
                  item={item}
                  navigation={navigation}
                />
              ))}

              {restaurants &&
                restaurants?.filter((item: any) => item?._id === store?._id)
                  .length > 0 && (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handleAddressSelect}>
                      <ShadowBox
                        style={{
                          marginTop: 20,
                          backgroundColor: Colors.LIGHT[1],
                          borderRadius: 10,
                          flexDirection: 'column',
                        }}>
                        <View
                          style={{
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            padding: 15,
                            alignItems: 'center',
                          }}>
                          <View style={{flexDirection: 'row', gap: 10}}>
                            <Icon name="home" size={26} />
                            <View style={{gap: 2, flex: 1, paddingRight: 5}}>
                              <Heading level="h5">
                                Delivering to {address?.active?.type}
                              </Heading>
                              <Paragraph
                                numberOfLines={2}
                                level={3}
                                style={{color: Colors.DARK[3]}}>
                                {address?.active?._id == '0'
                                  ? address?.active?.streetHouseNumber
                                  : `${address?.active?.landmark},${address?.active?.streetHouseNumber},${address?.active?.area}`}
                              </Paragraph>
                            </View>
                          </View>
                          <Icon
                            name="chevron-down"
                            size={22}
                            color={Colors.LIGHT[3]}
                          />
                        </View>
                        <View
                          style={{
                            backgroundColor: Colors.GREEN[2],
                            padding: 4,
                            borderBottomEndRadius: 10,
                            borderBottomLeftRadius: 10,
                          }}>
                          <Paragraph
                            level={2}
                            fontFamily={Fonts.MEDIUM}
                            style={{
                              textAlign: 'center',
                              color: Colors.LIGHT[1],
                            }}>
                            Estimated delivery time is 35min
                          </Paragraph>
                        </View>
                      </ShadowBox>
                    </TouchableOpacity>
                    <View style={{paddingTop: 20}}>
                      <TextInput
                        style={styles.couponInput}
                        placeholder="Add promo code"
                      />
                      <View style={styles.infoContainer}>
                        <View style={{gap: 8}}>
                          <FlexText left="Subtotal" right="₹299" />
                          <FlexText left="Delivery Fee" right="Free" />
                          <FlexText left="Discount" right="₹99" />
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 10,
                          }}>
                          <Heading
                            level={'h4'}
                            font={Fonts.BOLD}
                            style={{color: Colors.DARK[1]}}>
                            Total
                          </Heading>
                          <Heading
                            level={'h4'}
                            font={Fonts.BOLD}
                            style={{color: Colors.DARK[1]}}>
                            ₹{info?.total?.toFixed(2)}
                          </Heading>
                        </View>
                      </View>
                    </View>
                  </>
                )}
            </ScrollView>
            <View style={styles.lowerSection}>
              <View
                style={{
                  padding: 15,
                  gap: 15,
                  borderColor: Colors.LIGHT[2],
                  borderWidth: 1,
                  borderRadius: 10,
                }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setPaymentMode('ONLINE')}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <MuiIcon
                      name="credit-card-check-outline"
                      size={28}
                      color={Colors.GREEN[3]}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'baseline',
                        gap: 5,
                      }}>
                      <Heading level="h5">Pay Online</Heading>
                      <Paragraph fontFamily={Fonts.MEDIUM} level={3}>
                        (UPI/Cards/Netbanking etc.)
                      </Paragraph>
                    </View>
                  </View>
                  <MuiIcon
                    name={
                      paymentMode === 'ONLINE'
                        ? 'circle-slice-8'
                        : 'circle-outline'
                    }
                    size={20}
                    color={Colors.PRIMARY[1]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setPaymentMode('CASH')}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                    }}>
                    <MuiIcon name="cash" size={30} color={Colors.GREEN[3]} />
                    <Heading level="h5">Pay with Cash</Heading>
                  </View>
                  <MuiIcon
                    name={
                      paymentMode === 'CASH'
                        ? 'circle-slice-8'
                        : 'circle-outline'
                    }
                    size={20}
                    color={Colors.PRIMARY[1]}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
                <View style={{alignItems: 'center'}}>
                  <Paragraph
                    fontFamily={Fonts.MEDIUM}
                    level={3}
                    style={{color: Colors.LIGHT[3]}}>
                    Total
                  </Paragraph>
                  <Heading level="h5">₹{info?.total?.toFixed(2)}</Heading>
                </View>
                <View style={{flex: 1, marginTop: 5}}>
                  <Button
                    isLoading={newOrder.loading}
                    isDisabled={
                      restaurants &&
                      restaurants?.filter(
                        (item: any) => item?._id === store?._id,
                      ).length === 0
                        ? true
                        : false
                    }
                    onPress={createOrderHandle}>
                    Next
                  </Button>
                </View>
              </View>
            </View>
          </>
        )}

        <BottomSheetModalProvider>
          <BottomSheetModal
            containerStyle={{zIndex: 2}}
            animateOnMount
            ref={addressSelectRef}
            snapPoints={['50%']}
            backgroundStyle={{
              backgroundColor: Colors.LIGHT[1],
              borderRadius: 30,
            }}>
            <Heading
              level="h4"
              style={{marginVertical: 15, marginHorizontal: 15}}>
              Select Address
            </Heading>
            {address.loading ? (
              <FlatList
                pagingEnabled
                data={[1, 2, 3, 4, 5, 6, 7, 8]}
                keyExtractor={(item: any) => String(item)}
                renderItem={({item}) => <AddressListSkeleton />}
                contentContainerStyle={{
                  paddingHorizontal: 15,
                  gap: 25,
                  paddingBottom: 15,
                }}
              />
            ) : (
              <FlatList
                pagingEnabled
                data={address?.addresses}
                keyExtractor={(item: any) => item?._id}
                renderItem={({item}) => (
                  <AddressListItem
                    address={item}
                    setActiveAddres={setActiveAddres}
                    activeAddress={address?.active}
                  />
                )}
                contentContainerStyle={{
                  paddingHorizontal: 15,
                  gap: 20,
                  paddingBottom: 15,
                }}
              />
            )}
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </KeyboardAvoidingView>
    </NoInternet>
  );
};

const FlexText = ({right, left}: {right: string; left: string}) => {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Paragraph
        level={2}
        fontFamily={Fonts.MEDIUM}
        style={{color: Colors.LIGHT[3]}}>
        {left}
      </Paragraph>
      <Paragraph
        level={2}
        fontFamily={Fonts.MEDIUM}
        style={{color: Colors.LIGHT[3]}}>
        {right}
      </Paragraph>
    </View>
  );
};
export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT[1],
  },
  upperSection: {
    paddingHorizontal: 15,
    flex: 1,
  },
  lowerSection: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 10,
  },
  couponInput: {
    backgroundColor: Colors.LIGHT[2],
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 32,
    fontFamily: Fonts.MEDIUM,
    color: Colors.DARK[2],
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: Colors.LIGHT[2],
    flex: 1,
    marginVertical: 15,
    borderRadius: 18,
    padding: 15,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
});
