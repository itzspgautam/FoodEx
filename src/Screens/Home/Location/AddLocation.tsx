import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import Button from '../../../Components/UI/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../../../Constants/Colors';
import Fonts from '../../../Constants/Fonts';
import Heading from '../../../Components/UI/Heading';
import {Header} from '../../../Components/Section';
import Geolocation from '@react-native-community/geolocation';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../State/store';
import {
  clearProfileError,
  cretaeAddress,
} from '../../../State/Features/ProfileSlice';
import AlertModal, {AlertModalRef} from '../../../Components/Alerts/AlertModal';
import {getCurrentPosition} from '../../../Utils/LocationPermission';

const AddLocation = ({navigation}: {navigation: any}) => {
  const dispatch = useDispatch<AppDispatch>();
  const mapRef = useRef<MapView>(null);
  const markerRef = useRef(null);
  const alertModalRef = useRef<AlertModalRef>(null);

  const {address} = useSelector((state: RootState) => state.Profile);

  const [streetHouseNumber, setStreetHouseNumber] = useState('');
  const [area, setArea] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [landmark, setLandmark] = useState('');

  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: 24.1549,
    longitude: 83.7996,
  });

  const handleMarkerDragEnd = (event: any) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;

    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setMarkerCoordinate({latitude, longitude});
    mapRef.current?.animateToRegion(region, 500);
  };

  const handleLocateMe = async () => {
    const {latitude, longitude} = await getCurrentPosition();
    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setMarkerCoordinate({latitude, longitude});
    mapRef.current?.animateToRegion(region, 500); // Adjust the duration as needed
  };

  const handleSaveAddress = async () => {
    const addressData = {
      type: 'Home',
      streetHouseNumber,
      area,
      district,
      state,
      country,
      landmark,
      user: '64c4f4278afc1c7d09d670ce',
      coordinates: markerCoordinate,
    };
    const {meta} = await dispatch(cretaeAddress(addressData));
    if (meta.requestStatus === 'fulfilled') {
      AlertModel({
        status: 'success',
        title: 'Success!',
        description: 'Your address information has been successfully saved.',
        buttonText: 'Close',
        buttonFunction: () => {
          navigation.navigate('LocationList');
        },
      });
    }
  };

  const AlertModel = ({
    status,
    title,
    description,
    buttonText,
    buttonFunction,
  }: {
    status: any;
    title: string;
    description: string;
    buttonText: string;
    buttonFunction: () => void;
  }) => {
    if (alertModalRef.current) {
      alertModalRef.current.openModal(
        status,
        title,
        description,
        buttonText,
        buttonFunction,
      );
    }
  };

  useEffect(() => {
    console.log(address?.error);
    if (address?.error !== null) {
      AlertModel({
        status: 'error',
        title: 'Error!',
        description: address.error,
        buttonText: 'Close',
        buttonFunction: () => {},
      });
      dispatch(clearProfileError());
    }
  }, [address.error]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <AlertModal ref={alertModalRef} />
      <View style={{flex: 1}}>
        <MapView
          ref={mapRef}
          zoomEnabled
          style={{
            flex: 1,
          }}
          initialRegion={{
            latitude: 24.1549,
            longitude: 83.7996,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker
            ref={markerRef}
            draggable
            coordinate={markerCoordinate}
            onDragEnd={handleMarkerDragEnd}
          />
        </MapView>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: 15,
          }}>
          <Button
            variant="outline"
            buttonStyle={{
              height: 35,
              width: 120,
            }}
            onPress={() => handleLocateMe()}>
            Locate me
          </Button>
        </View>
      </View>
      <View style={styles.bottomSection}>
        <Heading
          level="h4"
          style={{
            color: Colors.DARK[1],
            paddingHorizontal: 15,
            marginVertical: 20,
          }}>
          Add new address
        </Heading>
        <ScrollView>
          <View style={styles.inputsContainer}>
            <TextInput
              style={styles.inputText}
              placeholderTextColor={Colors.LIGHT[3]}
              placeholder="House no/Street"
              onChangeText={e => setStreetHouseNumber(e)}
            />
            <TextInput
              style={styles.inputText}
              placeholderTextColor={Colors.LIGHT[3]}
              placeholder="Area"
              onChangeText={e => setArea(e)}
            />
            <TextInput
              style={styles.inputText}
              placeholderTextColor={Colors.LIGHT[3]}
              placeholder="District"
              onChangeText={e => setDistrict(e)}
            />
            <TextInput
              style={styles.inputText}
              placeholderTextColor={Colors.LIGHT[3]}
              placeholder="State"
              onChangeText={e => setState(e)}
            />
            <TextInput
              style={styles.inputText}
              placeholderTextColor={Colors.LIGHT[3]}
              placeholder="Landmark"
              onChangeText={e => setLandmark(e)}
            />
          </View>
        </ScrollView>
        <SafeAreaView
          edges={['bottom']}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 15,
            flexDirection: 'row',
            gap: 10,
          }}>
          <View style={{flex: 0.5}}>
            <Button variant="outline" onPress={() => navigation.goBack()}>
              Cancel
            </Button>
          </View>
          <View style={{flex: 1}}>
            <Button onPress={handleSaveAddress} isLoading={address?.loading}>
              Save address
            </Button>
          </View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT[1],
  },

  bottomSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  inputsContainer: {
    gap: 10,
    paddingHorizontal: 15,
  },
  inputText: {
    backgroundColor: Colors.LIGHT[2],
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 32,
    fontFamily: Fonts.REGULAR,
    color: Colors.DARK[2],
    fontSize: 16,
  },
});
