import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../State/store';
import auth from '@react-native-firebase/auth';
import Button from '../../Components/UI/Button';
import {logoutUser} from '../../State/Features/AuthSlice';
import Heading from '../../Components/UI/Heading';
import Icon from 'react-native-vector-icons/Octicons';
import {Header} from '../../Components/Section';
import Colors from '../../Constants/Colors';
import Images from '../../Constants/Images';
import Paragraph from '../../Components/UI/Paragraph';
import ShadowBox from '../../Components/UI/ShadowBox';
import {getAllOrders, singleOrderProps} from '../../State/Features/OrderSlice';
import OrderListItem from '../../Components/Section/OrderListitem';
import {OrdersHrFlatlistSc} from '../../Components/Skeleton';
const profileNavItems = [
  {
    title: 'Orders',
    description: 'View your order history and rate orders.',
    icon: 'package',
    screen: 'Orders', // Replace with the name of your Orders screen
  },
  {
    title: 'Saved Addresses',
    description: 'Manage and edit your saved addresses.',
    icon: 'location',
    screen: 'SavedAddresses', // Replace with the name of your Saved Addresses screen
  },
];

const ProfileScreen = ({navigation}: {navigation: any}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {user, token} = useSelector((state: RootState) => state.Auth);
  const {allOrders} = useSelector((state: RootState) => state.Order);

  const logoutHandle = async () => {
    // await dispatch(logoutUser(navigation)); // Pass the navigation object to the logoutUser action creator
    // Do not navigate to 'Login' here; navigation will be handled in the logoutUser action creator
    await dispatch(logoutUser(navigation));
  };

  useEffect(() => {
    dispatch(getAllOrders());
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={Images.FOOD_BG}>
        <Header
          navigation={navigation}
          showBackButton={true}
          centerItem={<Heading level="h4">Profile</Heading>}
          rightItem={
            <TouchableOpacity
              onPress={() => navigation.navigate('AddLocation')}>
              <Icon name="gear" size={20} color={Colors.DARK[1]} />
            </TouchableOpacity>
          }
        />

        <View style={styles.userDetailsContainer}>
          <View style={styles.avatarContainer}>
            <Image source={{uri: user?.picture}} style={styles.avatar} />
          </View>
          <View style={{gap: 4, alignItems: 'center'}}>
            <Heading level="h4" style={{color: Colors.DARK[2]}}>
              {user?.name}
            </Heading>
            <Paragraph level={2} style={{color: Colors.LIGHT[3]}}>
              {user?.email}
            </Paragraph>
          </View>
        </View>
      </ImageBackground>
      <ScrollView style={{marginTop: 20}}>
        <View style={{gap: 10}}>
          {profileNavItems?.map(item => (
            <ProfileList key={item.title} item={item} />
          ))}
        </View>
        {allOrders?.all?.length !== 0 && (
          <Heading
            level="h5"
            style={{
              marginHorizontal: 20,
              marginTop: 25,
              color: Colors.DARK[1],
            }}>
            Recent Orders
          </Heading>
        )}
        {allOrders?.loading ? (
          <FlatList
            data={[1, 2, 3, 4]}
            keyExtractor={(item: any) => String(item)}
            renderItem={({item}) => <OrdersHrFlatlistSc />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 15, marginTop: 5}}
            ItemSeparatorComponent={() => <View style={{width: 10}} />}
          />
        ) : (
          <FlatList
            data={allOrders?.all}
            keyExtractor={(item: any) => item?._id}
            renderItem={({item}) => (
              <OrderListItem item={item} navigation={navigation} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 10}}
            ItemSeparatorComponent={() => <View style={{width: 10}} />}
          />
        )}
      </ScrollView>
    </View>
  );
};

const renderSeparator = () => <View style={{height: 7}} />;

const ProfileList = ({item}: {item: any}) => {
  return (
    <TouchableOpacity activeOpacity={0.6}>
      <ShadowBox
        style={{
          backgroundColor: Colors.LIGHT[1],
          borderRadius: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 15,
          marginHorizontal: 15,
        }}>
        <View style={{gap: 10, flexDirection: 'row', alignItems: 'center'}}>
          <Icon name={item?.icon} size={25} color={Colors.PRIMARY[2]} />
          <View style={{gap: 4}}>
            <Heading level="h5" style={{color: Colors.DARK[2]}}>
              {item?.title}
            </Heading>
            <Paragraph level={3} style={{color: Colors.LIGHT[3]}}>
              {item?.description}
            </Paragraph>
          </View>
        </View>
        <Icon name="chevron-right" size={25} color={Colors.LIGHT[3]} />
      </ShadowBox>
    </TouchableOpacity>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT[1],
  },
  userDetailsContainer: {
    alignItems: 'center',
    gap: 5,
  },
  avatarContainer: {
    backgroundColor: Colors.LIGHT[2],
    borderRadius: 100,
    padding: 8,
    borderColor: Colors.PRIMARY[2],
    borderWidth: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: Colors.LIGHT[1],
  },
});
