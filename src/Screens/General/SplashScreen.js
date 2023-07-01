import {StatusBar, StyleSheet, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import Font from '../../Theme/Font';
import Heading from '../../Components/UI/Heading';
import Texts from '../../Components/UI/Texts';
import Button from '../../Components/UI/Button';
import GradientView from '../../Components/UI/GradientView';
import Images from '../../Theme/Images';
import Center from '../../Components/UI/Center';
import Hr from '../../Components/UI/Hr';
import LoadingBar from '../../Components/UI/LoadingBar';
import ColorTheme from '../../Theme/Color';

const SplashScreen = ({navigation}) => {
  const Color = ColorTheme();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);
  }, []);

  return (
    <GradientView>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'rgba(0,0,0,0)'}
        translucent
      />
      <View style={styles.container}>
        <Center style={{flex: 0.7}}>
          <Image
            source={Images.LOGO_LIGHT}
            style={{width: '60%', height: 80}}
            resizeMode="contain"
          />
          <LoadingBar w="30%" percentage={50} />
        </Center>
      </View>
      <Center style={{flex: 0.1}}>
        <Texts level={'sm'} style={{color: Color.WHITE}}>
          Developed by itzspgautam
        </Texts>
        <Hr w="15%" />
      </Center>
    </GradientView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'space-between'},
});
