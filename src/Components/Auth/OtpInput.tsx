import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useRef, useState} from 'react';
import Heading from '../UI/Heading';
import Paragraph from '../UI/Paragraph';
import {TextInput} from 'react-native';
import Button from '../UI/Button';
import Fonts from '../../Constants/Fonts';
import Colors from '../../Constants/Colors';
import {AppDispatch, RootState} from '../../State/store';
import {useDispatch, useSelector} from 'react-redux';
import {verifyOTP} from '../../State/Features/AuthSlice';

const OtpInput = ({
  setModalSnap,
  setLoginStep,
  navigation,
}: {
  setModalSnap: any;
  setLoginStep: any;
  navigation?: any;
}) => {
  const otpInputs = useRef<TextInput[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const {phoneAuth} = useSelector((state: RootState) => state.Auth);

  const [otp, setOTP] = useState<string>('');

  const handleOTPEnter = (index: number, value: string) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP.join(''));

    if (index < 5 && value !== '') {
      otpInputs?.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace') {
      otpInputs.current[index - 1]?.focus();
    }
  };
  const handleVerify = () => {
    dispatch(verifyOTP({otp}));
  };
  return (
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
          Enter OTP
        </Heading>
        <Paragraph
          level={2}
          fontFamily={Fonts.MEDIUM}
          style={{color: Colors.LIGHT[3]}}>
          We have sent 6 digit OTP to +9178******02
        </Paragraph>
      </View>

      <View>
        <View style={styles.otpContainer}>
          {[0, 1, 2, 3, 4, 5].map(index => (
            <TextInput
              onFocus={() => setModalSnap('70%')}
              key={index}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="phone-pad"
              onChangeText={value => handleOTPEnter(index, value)}
              ref={(input: any) => {
                otpInputs.current[index] = input;
              }}
              onKeyPress={({nativeEvent}) =>
                handleKeyPress(index, nativeEvent.key)
              }
            />
          ))}
        </View>

        <View style={{marginTop: 15}}>
          <Button onPress={handleVerify} isLoading={phoneAuth.loading}>
            Verify
          </Button>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 4,
          alignItems: 'baseline',
        }}>
        <Paragraph
          level={2}
          fontFamily={Fonts.MEDIUM}
          style={{
            color: Colors.LIGHT[3],
            textAlign: 'center',
          }}>
          Did'nt received OTP?
        </Paragraph>
        <TouchableOpacity onPress={() => setLoginStep('PHONE')}>
          <Paragraph
            level={1}
            fontFamily={Fonts.BOLD}
            style={{
              color: Colors.PRIMARY[2],
              textAlign: 'center',
            }}>
            Resend
          </Paragraph>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 0.2,
    borderColor: Colors.LIGHT[3],
    backgroundColor: Colors.LIGHT[2],
    textAlign: 'center',
    borderRadius: 5,
    fontFamily: Fonts.MEDIUM,
    fontSize: 16,
  },
});
