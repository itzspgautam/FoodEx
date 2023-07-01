import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';
import React from 'react';
import ColorTheme from '../../Theme/Color';
import Center from '../../Components/UI/Center';
import Images from '../../Theme/Images';
import Heading from '../../Components/UI/Heading';
import Texts from '../../Components/UI/Texts';
import Gap from '../../Components/UI/Gap';
import Button from '../../Components/UI/Button';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';

const LoginScreen = ({navigation}) => {
  const Color = ColorTheme();
  const {theme} = useSelector(State => State.General);
  return (
    <View style={{...styles.container, backgroundColor: Color.LIGHT[2]}}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'rgba(0,0,0,0)'}
        translucent
      />

      <LinearGradient
        colors={[Color.LIGHT[1], Color.LIGHT[2], Color.LIGHT[2]]}
        start={{x: 1, y: 0.1}}
        end={{x: 1, y: 1}}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 0,
        }}>
        <ImageBackground
          source={theme === 'light' ? Images.FOOD_BG : Images.FOOD_BG_DARK}
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            opacity: 0.5,
          }}
          resizeMode="cover"
        />
        <Gap h={80} />
        <Image
          source={theme === 'light' ? Images.LOGO_DARK : Images.LOGO_LIGHT}
          style={{width: '70%', height: 80}}
          resizeMode="contain"
        />
      </LinearGradient>

      <Center style={styles.BottomBox}>
        <Heading level={1}>Hello Foodie!</Heading>
        <Gap h={8} />
        <Texts level={'md'}>Please choose how you want to proceed.</Texts>
        <Gap h={40} />
        <Button
          variant={'light'}
          title="Continue with phone number"
          onPress={() => navigation.navigate('Home')}
        />
        <Gap h={15} />
        <Button variant={'dark'} title="Continue with google" />
      </Center>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  BottomBox: {justifyContent: 'flex-start', paddingHorizontal: 20},
});

export default LoginScreen;
