import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Colors from '../../Constants/Colors';
import Images from '../../Constants/Images';
import Heading from '../../Components/UI/Heading';
import Paragraph from '../../Components/UI/Paragraph';
import Fonts from '../../Constants/Fonts';
import Button from '../../Components/UI/Button';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import PhoneInput from '../../Components/Auth/PhoneInput';
import OtpInput from '../../Components/Auth/OtpInput';

import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../State/store';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {clearAuthError, loginWithGoogle} from '../../State/Features/AuthSlice';
import AlertModal, {AlertModalRef} from '../../Components/Alerts/AlertModal';
GoogleSignin.configure({
  webClientId:
    '866869612615-g87mab8ko06jtmp4ruudrmovlc4sog2f.apps.googleusercontent.com',
});

const LoginScreen = ({navigation}: {navigation: any}) => {
  const phoneLoginRef = useRef<BottomSheetModal>(null);
  const dispatch = useDispatch<AppDispatch>();
  const alertModalRef = useRef<AlertModalRef>(null);

  const {phoneAuth, user, googleAuth} = useSelector(
    (state: RootState) => state.Auth,
  );

  const [isModOpen, setIsModOpen] = useState(false);
  const [modalSnap, setModalSnap] = useState('35%');

  const [loginStep, setLoginStep] = useState('PHONE');

  //Open Speech search Modal
  const openPhoneLogin = (item: any) => {
    phoneLoginRef.current?.present();
    setIsModOpen(true);
  };
  //Close Speech search Modal
  const closePhoneLogin = () => {
    phoneLoginRef.current?.close();
    setIsModOpen(false);
    setModalSnap('35%');
  };

  const handleGoogleLogin = async () => {
    dispatch(loginWithGoogle());
  };

  //alert modal
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
    if (phoneAuth?.error) {
      AlertModel({
        status: 'error',
        title: 'Error!',
        description: phoneAuth.error,
        buttonText: 'Close',
        buttonFunction: () => {},
      });
      dispatch(clearAuthError());
    }
  }, [phoneAuth?.error]);

  useEffect(() => {
    if (user) {
      navigation.navigate('User'); // Replace 'HomeScreen' with the actual name of your home screen
    }
  }, [user, navigation]);

  return (
    <>
      <AlertModal ref={alertModalRef} />
      {isModOpen && (
        <TouchableOpacity
          activeOpacity={0}
          onPress={closePhoneLogin}
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
      <ImageBackground
        source={Images.FOOD_BG}
        style={styles.imageBg}
        imageStyle={{opacity: 0.2}}>
        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
        <View style={styles.logoContainer}>
          <Image
            source={Images.LOGO_DARK}
            resizeMode="contain"
            style={{width: '60%', height: 65}}
          />
          <Heading level="h6" style={{color: Colors.PRIMARY[1]}}>
            Delivering Happiness!
          </Heading>
        </View>
        <View style={styles.dataContainer}>
          <Heading
            level="h2"
            font={Fonts.HEAVY}
            style={{color: Colors.DARK[1]}}>
            Hello, Foodie!
          </Heading>
          <Paragraph
            level={2}
            fontFamily={Fonts.MEDIUM}
            style={{color: Colors.DARK[2]}}>
            Please choose how you want to proceed.
          </Paragraph>
          <View style={styles.buttonStack}>
            <Button onPress={openPhoneLogin}>Continue with Phone</Button>
            <Button
              variant="outline"
              onPress={handleGoogleLogin}
              isLoading={googleAuth.loading}>
              Continue with Google
            </Button>
          </View>
        </View>
      </ImageBackground>

      <BottomSheetModalProvider>
        <BottomSheetModal
          containerStyle={{zIndex: 2}}
          animateOnMount
          ref={phoneLoginRef}
          snapPoints={[modalSnap]}
          backgroundStyle={{
            backgroundColor: Colors.LIGHT[1],
            borderRadius: 30,
          }}>
          {phoneAuth?.step === 'PHONE' && (
            <PhoneInput
              setModalSnap={setModalSnap}
              setLoginStep={setLoginStep}
            />
          )}
          {phoneAuth?.step === 'OTP' && (
            <OtpInput
              setModalSnap={setModalSnap}
              navigation={navigation}
              setLoginStep={setLoginStep}
            />
          )}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  imageBg: {
    flex: 1,
    backgroundColor: Colors.LIGHT[1],
  },
  logoContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  dataContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  buttonStack: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 20,
    marginTop: 40,
  },
});
