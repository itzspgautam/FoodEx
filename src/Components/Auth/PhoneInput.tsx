import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Heading from '../UI/Heading';
import Paragraph from '../UI/Paragraph';
import {TextInput} from 'react-native';
import Button from '../UI/Button';
import Fonts from '../../Constants/Fonts';
import Colors from '../../Constants/Colors';
import {CountryPicker} from 'react-native-country-codes-picker';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../State/store';
import {requestOTP} from '../../State/Features/AuthSlice';

const PhoneInput = ({
  setModalSnap,
  setLoginStep,
}: {
  setModalSnap: any;
  setLoginStep?: any;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const {phoneAuth} = useSelector((state: RootState) => state.Auth);
  const [countryListShow, setCountryListShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState<any>(null);

  const handleReqOTP = async () => {
    dispatch(requestOTP({phoneNumber, countryCode}));
  };
  return (
    <View style={{flex: 1}}>
      <CountryPicker
        lang={'en'}
        show={countryListShow}
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={item => {
          setCountryCode(item.dial_code);
          setCountryListShow(false);
        }}
        onBackdropPress={() => setCountryListShow(false)}
        style={{
          modal: {
            height: '60%',
            padding: 15,
          },
          textInput: {
            paddingHorizontal: 15,
            fontFamily: Fonts.REGULAR,
          },
          dialCode: {
            fontFamily: Fonts.MEDIUM,
          },
          countryName: {
            fontFamily: Fonts.REGULAR,
          },
        }}
      />
      <View
        style={{
          gap: 20,
          flex: 1,
          paddingHorizontal: 15,
        }}>
        <View
          style={{
            gap: 4,
            paddingHorizontal: 15,
            paddingTop: 15,
            alignItems: 'center',
          }}>
          <Heading level="h3" style={{color: Colors.DARK[1]}}>
            Enter you phone number
          </Heading>
          <Paragraph
            level={2}
            fontFamily={Fonts.MEDIUM}
            style={{color: Colors.LIGHT[3]}}>
            Please choose how you want to proceed.
          </Paragraph>
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: Colors.LIGHT[2],
              height: 45,
              borderRadius: 10,
              borderWidth: 0.2,
              borderColor: Colors.LIGHT[3],
            }}>
            <TouchableOpacity
              onPress={() => setCountryListShow(true)}
              style={{
                width: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Heading level="h6">{countryCode}</Heading>
            </TouchableOpacity>
            <TextInput
              style={{
                flex: 1,
                fontFamily: Fonts.MEDIUM,
                fontSize: 16,
              }}
              placeholder="enter phone number"
              value={phoneNumber}
              onFocus={() => setModalSnap('70%')}
              onBlur={() => setModalSnap('35%')}
              onChangeText={e => setPhoneNumber(e)}
            />
          </View>

          <View style={{marginTop: 15}}>
            <Button onPress={handleReqOTP} isLoading={phoneAuth.loading}>
              Continue
            </Button>
          </View>
        </View>

        <Paragraph
          level={4}
          fontFamily={Fonts.MEDIUM}
          style={{
            color: Colors.LIGHT[3],
            textAlign: 'center',
          }}>
          By Continuing, You Agree to Our Terms and Conditions
        </Paragraph>
      </View>
    </View>
  );
};

export default PhoneInput;

const styles = StyleSheet.create({});
