import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {ReactNode} from 'react';
import Images from '../../Constants/Images';
import Heading from '../UI/Heading';
import Button from '../UI/Button';
import Paragraph from '../UI/Paragraph';
import Colors from '../../Constants/Colors';
import {useSelector} from 'react-redux';
import {RootState} from '../../State/store';

const NoInternet = ({children}: {children: any}) => {
  const {internet} = useSelector((state: RootState) => state.General);
  return internet?.isConnected ? (
    <>{children}</>
  ) : (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={Colors.LIGHT[1]} />
      <Image
        source={Images.ERROR.NO_INTERNET}
        resizeMode="contain"
        style={{height: 300, width: '100%'}}
      />
      <View
        style={{
          paddingHorizontal: 20,
          alignItems: 'center',
          gap: 5,
        }}>
        <Heading level="h3">Uh-Oh! You're offline!</Heading>
        <Paragraph
          level={2}
          style={{textAlign: 'center', color: Colors.DARK[3], lineHeight: 16}}>
          Stay connected to the internet to explore nearby restaurants & enjoy
          seamless food delivery.
        </Paragraph>
      </View>
      <Button variant="outline" containerStyle={{marginTop: 20, width: '60%'}}>
        Retry
      </Button>
    </View>
  );
};

export default NoInternet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT[1],
    paddingHorizontal: 15,
    alignItems: 'center',
    paddingTop: '30%',
  },
});
