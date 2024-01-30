import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {Header} from '../../../Components/Section';
import Colors from '../../../Constants/Colors';
import Heading from '../../../Components/UI/Heading';
import Paragraph from '../../../Components/UI/Paragraph';
import Icon from 'react-native-vector-icons/Octicons';
import Fonts from '../../../Constants/Fonts';
import OrderStatusBadge from '../../../Components/Section/OrderStatusBadge';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../State/store';
import {getOrderDetail} from '../../../State/Features/OrderSlice';
import moment from 'moment';
import MapView, {
  Callout,
  CalloutSubview,
  Marker,
  Polyline,
} from 'react-native-maps';
import CartHrListItem from '../../../Components/Section/CartHrListItem';
import OrderDetailListItem from '../../../Components/Section/OrderDetailListItem';
import {ScrollView} from 'react-native-gesture-handler';
import Button from '../../../Components/UI/Button';
import GradientView from '../../../Components/UI/GradientView';
import {OrderDetailPageSc} from '../../../Components/Skeleton';
import {navigate} from '../../../Utils/NavigationUtils';
import Images from '../../../Constants/Images';
import {
  calculateTwoMarkerMapRegion,
  getCurvedPolylineCoordinates,
} from '../../../Utils/MapUtils';
const OrderDetailScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {orderId} = route.params;
  const dispatch = useDispatch<AppDispatch>();

  const {orderDetail} = useSelector((state: RootState) => state.Order);
  const {user} = useSelector((state: RootState) => state.Auth);

  const order = orderDetail?.order?.order;
  const address = order?.address;
  const payInfo = orderDetail?.order?.printablePaymentDetails;

  useEffect(() => {
    dispatch(getOrderDetail(orderId));
  }, []);
  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        centerItem={
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
            }}>
            <Heading level="h4">Order Detail</Heading>
            <Paragraph level={3}>
              Order Number:{' '}
              {orderDetail?.loading ? '...' : `#${order?.orderNumber}`}
            </Paragraph>
          </View>
        }
        rightItem={<></>}
      />
      {orderDetail?.loading ? (
        <View
          style={{paddingHorizontal: 15, flex: 1, backgroundColor: 'white'}}>
          <OrderDetailPageSc />
        </View>
      ) : (
        <>
          <View style={{flex: 1}}>
            <ScrollView>
              <View
                style={{
                  height: 120,
                  marginHorizontal: 15,
                  backgroundColor: Colors.LIGHT[2],
                  borderRadius: 10,
                }}>
                {!orderDetail?.loading && (
                  <MapView
                    mapType={
                      Platform.OS === 'ios' ? 'mutedStandard' : 'standard'
                    }
                    style={{
                      flex: 1,
                      borderRadius: 10,
                    }}
                    // region={{
                    //   latitude: address?.coordinates?.latitude ?? 0,
                    //   longitude: address?.coordinates?.longitude ?? 0,
                    //   latitudeDelta: 0.01,
                    //   longitudeDelta: 0.01,
                    // }}
                    region={calculateTwoMarkerMapRegion(
                      {
                        latitude: address?.coordinates?.latitude ?? 0,
                        longitude: address?.coordinates?.longitude ?? 0,
                      },
                      {
                        latitude:
                          order?.restaurant?.location.coordinates[0] ?? 0,
                        longitude:
                          order?.restaurant?.location.coordinates[1] ?? 0,
                      },
                      100000,
                    )}
                    scrollEnabled={true}>
                    <Marker
                      coordinate={{
                        latitude: address?.coordinates?.latitude ?? 0,
                        longitude: address?.coordinates?.longitude ?? 0,
                      }}>
                      <View
                        style={{
                          marginTop: -40,
                          alignItems: 'center',
                        }}>
                        <Image
                          source={{uri: user?.picture}}
                          style={{
                            height: 30,
                            width: 30,
                            borderRadius: 100,
                            borderWidth: 1,
                            borderColor: Colors.PRIMARY[2],
                          }}
                        />
                        <View
                          style={{
                            height: 10,
                            width: 1,
                            backgroundColor: Colors.PRIMARY[2],
                          }}
                        />
                      </View>
                    </Marker>

                    <Marker
                      coordinate={{
                        latitude:
                          order?.restaurant?.location?.coordinates[0] ?? 0,
                        longitude:
                          order?.restaurant?.location?.coordinates[1] ?? 0,
                      }}>
                      <View
                        style={{
                          marginTop: -40,
                          alignItems: 'center',
                        }}>
                        <Image
                          source={{uri: order?.restaurant?.logo}}
                          style={{
                            height: 30,
                            width: 30,
                            borderRadius: 100,
                            borderWidth: 1,
                            borderColor: Colors.PRIMARY[2],
                          }}
                        />
                        <View
                          style={{
                            height: 10,
                            width: 1,
                            backgroundColor: Colors.PRIMARY[2],
                          }}
                        />
                      </View>
                    </Marker>
                    <Polyline
                      coordinates={getCurvedPolylineCoordinates(
                        {
                          latitude: address?.coordinates?.latitude ?? 0,
                          longitude: address?.coordinates?.longitude ?? 0,
                        },
                        {
                          latitude:
                            order?.restaurant?.location.coordinates[0] ?? 0,
                          longitude:
                            order?.restaurant?.location.coordinates[1] ?? 0,
                        },
                      )}
                      strokeWidth={2}
                      strokeColors={[Colors?.PRIMARY[2]]}
                      miterLimit={10000}
                    />
                  </MapView>
                )}
              </View>
              <View
                style={{
                  paddingHorizontal: 15,
                  marginTop: 20,
                }}>
                <View style={{flex: 2, flexGrow: 3.5, gap: 20}}>
                  <View style={{flexDirection: 'row', gap: 6}}>
                    <Icon name="package" size={20} color={Colors.PRIMARY[2]} />
                    <View style={{gap: 4}}>
                      <Heading level="h6">
                        Order Id: #{order?.orderNumber}
                      </Heading>
                      <Paragraph level={3} style={{color: Colors.DARK[1]}}>
                        {moment(order?.createdAt).format(
                          'DD MMM, YYYY | h:m a',
                        )}
                      </Paragraph>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{flexDirection: 'row', gap: 6}}
                    activeOpacity={0.6}
                    onPress={() =>
                      navigate('Restaurant', {restaurant: order?.restaurant})
                    }>
                    <Icon name="flame" size={20} color={Colors.PRIMARY[2]} />
                    <View style={{gap: 4}}>
                      <Paragraph level={2} style={{color: Colors.LIGHT[3]}}>
                        Restaurant
                      </Paragraph>
                      <Heading
                        level="h6"
                        style={{
                          color: Colors.DARK[2],
                          fontFamily: Fonts.MEDIUM,
                        }}>
                        {order?.restaurant?.name}
                      </Heading>
                      <Heading
                        level="h6"
                        style={{
                          color: Colors.DARK[2],
                          fontFamily: Fonts.MEDIUM,
                        }}>
                        {order?.restaurant?.address}
                      </Heading>
                    </View>
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row', gap: 6}}>
                    <Icon name="location" size={20} color={Colors.PRIMARY[2]} />
                    <View style={{gap: 4}}>
                      <Paragraph level={2} style={{color: Colors.LIGHT[3]}}>
                        Delivered to
                      </Paragraph>
                      <Heading
                        level="h6"
                        style={{
                          color: Colors.DARK[2],
                          fontFamily: Fonts.MEDIUM,
                        }}>
                        {address?.landmark}, {address?.streetHouseNumber}
                      </Heading>
                      <Heading
                        level="h6"
                        style={{
                          color: Colors.DARK[2],
                          fontFamily: Fonts.MEDIUM,
                        }}>
                        {address?.area}, {address?.district},{address?.country}
                      </Heading>
                      <Heading
                        level="h6"
                        style={{
                          color: Colors.DARK[2],
                          fontFamily: Fonts.MEDIUM,
                        }}>
                        Phone:{address?.phoneNumber}
                      </Heading>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', gap: 6}}>
                    <Icon
                      name="credit-card"
                      size={20}
                      color={Colors.PRIMARY[2]}
                    />
                    <View style={{gap: 4}}>
                      <Paragraph level={2} style={{color: Colors.LIGHT[3]}}>
                        Payment Method
                      </Paragraph>

                      {payInfo?.map((info: any) => (
                        <Heading
                          key={info.label}
                          level="h6"
                          style={{
                            color: Colors.DARK[2],
                            fontFamily: Fonts.MEDIUM,
                          }}>
                          {info?.label}: {info?.value}
                        </Heading>
                      ))}
                      <GradientView
                        style={{
                          alignItems: 'center',
                          padding: 2,
                          borderRadius: 2,
                          minWidth: 50,
                          maxWidth: 100,
                        }}
                        colors={
                          order?.payment?.status === 'paid'
                            ? [Colors.PRIMARY[1], Colors.PRIMARY[2]]
                            : [Colors.YELLOW[2], Colors.YELLOW[2]]
                        }>
                        <Heading
                          level="h6"
                          style={{
                            color: Colors.LIGHT[1],
                            fontFamily: Fonts.MEDIUM,
                          }}>
                          {order?.payment?.status?.toUpperCase()}
                        </Heading>
                      </GradientView>
                    </View>
                  </View>
                  <View style={{position: 'absolute', right: 0}}>
                    <OrderStatusBadge status={order?.status} />
                  </View>
                </View>
              </View>
              <View
                style={{
                  height: 2,
                  backgroundColor: Colors.LIGHT[2],
                  marginVertical: 20,
                }}
              />

              <View style={{paddingHorizontal: 20}}>
                <View style={styles.infoContainer}>
                  <View style={{gap: 8}}>
                    <FlexText
                      left="Subtotal"
                      right={`₹${order?.payment?.info?.subTotal.toFixed(2)}`}
                    />
                    <FlexText
                      left="Discount"
                      right={` - ₹${order?.payment?.info?.discount?.toFixed(
                        2,
                      )}`}
                    />
                    <FlexText
                      left="Delivery Fee"
                      right={`+ ₹${order?.payment?.info?.deliveryFee?.toFixed(
                        2,
                      )}`}
                    />
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
                      ₹{order?.payment?.info?.total?.toFixed(2)}
                    </Heading>
                  </View>
                </View>
              </View>
              <View
                style={{
                  height: 2,
                  backgroundColor: Colors.LIGHT[2],
                  marginVertical: 20,
                }}
              />

              <View style={{paddingHorizontal: 15}}>
                <Heading
                  level="h6"
                  style={{
                    marginLeft: 5,
                    marginBottom: 5,
                    color: Colors.LIGHT[3],
                  }}>
                  Items
                </Heading>
                {order?.items.map((item: any) => (
                  <OrderDetailListItem
                    key={item.item?._id + '-' + Math.random()}
                    item={item}
                    navigation={navigation}
                  />
                ))}
              </View>
              <View style={{height: 40}} />
            </ScrollView>
          </View>
          <View style={styles.lowerSection}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              {order?.status === 'delivered' ? (
                <>
                  <View style={{flex: 1, marginTop: 5}}>
                    <Button>Order again</Button>
                  </View>
                  <View style={{flex: 1, marginTop: 5}}>
                    <Button variant="outline"> Rate order</Button>
                  </View>
                </>
              ) : (
                <View style={{flex: 1, marginTop: 5}}>
                  <Button>Cancel Order</Button>
                </View>
              )}
            </View>
          </View>
        </>
      )}
    </View>
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

export default OrderDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT[1],
  },
  infoContainer: {
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  lowerSection: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 10,
    paddingBottom: 20,
  },
});
