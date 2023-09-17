import {FlatList, StyleSheet, Text, Touchable, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Header} from '../../../Components/Section';
import Icon from 'react-native-vector-icons/Octicons';
import MuiIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../../Constants/Colors';
import Paragraph from '../../../Components/UI/Paragraph';
import Fonts from '../../../Constants/Fonts';
import Heading from '../../../Components/UI/Heading';
import AddressListItem from '../../../Components/Section/AddressListItem';
import Button from '../../../Components/UI/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../State/store';
import {
  askLocationPermission,
  isLocationPermissionGranted,
} from '../../../Utils/LocationPermission';
import {
  SingleAddress,
  getAddresses,
  selectAddress,
} from '../../../State/Features/ProfileSlice';
import {AddressListSkeleton} from '../../../Components/Skeleton';

const LocationList = ({navigation}: {navigation: any}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {address} = useSelector((state: RootState) => state.Profile);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const setActiveAddres = (address: SingleAddress) => {
    dispatch(selectAddress(address));
    navigation.navigate('Home');
  };

  const useCurrentLocation = async () => {
    const address: SingleAddress = {_id: '0'};
    dispatch(selectAddress(address));
    navigation.navigate('Home');
  };

  useEffect(() => {
    dispatch(getAddresses());
  }, []);
  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        centerItem={<Heading level="h4">Location</Heading>}
        rightItem={
          <TouchableOpacity onPress={() => navigation.navigate('AddLocation')}>
            <Icon name="plus" size={20} color={Colors.DARK[1]} />
          </TouchableOpacity>
        }
      />

      <View style={{flex: 1}}>
        <View style={styles.searchContainer}>
          <Paragraph
            level={2}
            fontFamily={Fonts.REGULAR}
            style={{color: Colors.LIGHT[3]}}>
            Search address
          </Paragraph>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Icon name="search" size={18} color={Colors.LIGHT[3]} />
          </View>
        </View>
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={useCurrentLocation}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <MuiIcon
              name="crosshairs-gps"
              color={Colors.PRIMARY[2]}
              size={20}
            />
            <Paragraph
              level={2}
              fontFamily={Fonts.MEDIUM}
              style={{color: Colors.PRIMARY[2]}}>
              Use current location
            </Paragraph>
          </View>
          <Icon name="chevron-right" size={20} color={Colors.PRIMARY[2]} />
        </TouchableOpacity>
        <View
          style={{
            height: 1,
            width: '100%',
            backgroundColor: Colors.LIGHT[3],
            opacity: 0.2,
            margin: 20,
          }}
        />
        <Heading
          level="h5"
          style={{
            color: Colors.DARK[1],
            paddingHorizontal: 15,
            marginTop: 5,
            marginBottom: 20,
          }}>
          Saved Addresses
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
      </View>
      <SafeAreaView
        edges={['bottom']}
        style={{paddingHorizontal: 15, paddingVertical: 15}}>
        <Button onPress={() => navigation.navigate('AddLocation')}>
          Add new address
        </Button>
      </SafeAreaView>
    </View>
  );
};

export default LocationList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT[1],
  },
  searchContainer: {
    height: 45,
    backgroundColor: Colors.LIGHT[2],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 20,
    alignItems: 'center',
  },
});
