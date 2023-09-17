import {Image, Linking, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {ReactNode, useEffect} from 'react';
import Images from '../../Constants/Images';
import Heading from '../UI/Heading';
import Button from '../UI/Button';
import Paragraph from '../UI/Paragraph';
import Colors from '../../Constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../State/store';
import {
  askLocationPermission,
  isLocationPermissionGranted,
} from '../../Utils/LocationPermission';
import {setLocationPermission} from '../../State/Features/GeneralSlice';
import {selectAddress} from '../../State/Features/ProfileSlice';
import ProfileStorage from '../../storage/ProfileStorage';

const LocationPermission = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {internet} = useSelector((state: RootState) => state.General);

  const askPermission = async () => {
    const result = await askLocationPermission();
    console.log(result);
    if (result === true) {
      dispatch(setLocationPermission(true));
      const storageAddress: any = await ProfileStorage.getSelectedAddress();
      if (storageAddress) {
        const address = JSON.parse(storageAddress);
        await dispatch(selectAddress(address));
      } else {
        const address = {_id: '0'};
        await dispatch(selectAddress(address));
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={Colors.LIGHT[1]} />
      <Image
        source={Images.ERROR.LOCATION_PERMISSION}
        resizeMode="contain"
        style={{height: 300, width: '100%'}}
      />
      <View
        style={{
          paddingHorizontal: 20,
          alignItems: 'center',
          gap: 5,
          marginBottom: 15,
        }}>
        <Heading
          level="h3"
          style={{color: Colors.DARK[1], textAlign: 'center'}}>
          Delicious Food Nearby! Allow Location Access!
        </Heading>
        <Paragraph
          level={2}
          style={{textAlign: 'center', color: Colors.DARK[3], lineHeight: 16}}>
          Unlock a world of flavors! Permit location access to discover
          delightful food options near you, making dining an absolute pleasure!
        </Paragraph>
      </View>

      <Button
        variant="outline"
        containerStyle={{width: '60%'}}
        onPress={askPermission}>
        Grant Location Permission
      </Button>
    </View>
  );
};

export default LocationPermission;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT[1],
    paddingHorizontal: 15,
    alignItems: 'center',
    paddingTop: '30%',
  },
});
