import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {ReactNode} from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import ShadowBox from '../UI/ShadowBox';
import Colors from '../../Constants/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';

const Header = ({
  navigation,
  centerItem,
  rightItem,
}: {
  navigation: any;
  centerItem?: ReactNode;
  rightItem?: ReactNode;
}) => {
  return (
    <SafeAreaView edges={['top']} style={{width: '100%'}}>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}>
          <ShadowBox style={styles.backButton}>
            <Icon name="chevron-left" size={24} color={Colors.DARK[1]} />
          </ShadowBox>
        </TouchableOpacity>
        {centerItem && centerItem}
        {rightItem && (
          <TouchableOpacity activeOpacity={0.8}>
            <ShadowBox style={styles.backButton}>{rightItem}</ShadowBox>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
    backgroundColor: Colors.LIGHT[1],
    opacity: 0.9,
  },
});
