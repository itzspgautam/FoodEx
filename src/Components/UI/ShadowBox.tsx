import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import Colors from '../../Constants/Colors';

const ShadowBox = ({
  children,
  style,
}: {
  children?: ReactNode;
  style?: ViewStyle;
}) => {
  return <View style={[styles.container, {...style}]}>{children}</View>;
};

export default ShadowBox;

const styles = StyleSheet.create({
  container: {
    elevation: 10,
    shadowColor: Colors.LIGHT[3],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    flexDirection: 'row',
  },
});
