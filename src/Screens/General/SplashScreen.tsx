import {Image, StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import GradientView from '../../Components/UI/GradientView';
import Colors from '../../Constants/Colors';
import Images from '../../Constants/Images';
import LoadingBar from '../../Components/UI/LoadingBar';
import Paragraph from '../../Components/UI/Paragraph';
import Fonts from '../../Constants/Fonts';
import {useSelector} from 'react-redux';
import {RootState} from '../../State/store';

const SplashScreen = ({navigation}: {navigation: any}) => {
  const {progress} = useSelector((state: RootState) => state.General);
  return (
    <GradientView
      style={{flex: 1}}
      colors={[Colors.PRIMARY[1], Colors.PRIMARY[2]]}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'light-content'}
      />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={{width: 210, alignItems: 'center'}}>
            <Image
              source={Images.LOGO_LIGHT}
              style={{width: '100%', height: 100}}
              resizeMode="contain"
            />
            <LoadingBar percentage={`${progress}%`} w={'40%'} />
          </View>
        </View>
        <View style={styles.creditContainer}>
          <Paragraph
            level={3}
            fontFamily={Fonts.MEDIUM}
            style={{color: Colors.LIGHT[1]}}>
            Developed by itzspgautam
          </Paragraph>
        </View>
      </View>
    </GradientView>
  );
};
export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditContainer: {
    flex: 0.2,
    padding: 30,
    justifyContent: 'flex-end',
  },
});
