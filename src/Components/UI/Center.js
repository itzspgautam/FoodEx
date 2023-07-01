import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Center = ({children, style}) => {
  return <View style={{...styles.container, ...style}}>{children}</View>;
};

export default Center;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
