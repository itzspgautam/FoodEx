import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ColorTheme from '../../Theme/Color';

const Hr = ({h = 2, w = '100%', color, gap = 5}) => {
  const Color = ColorTheme();

  return (
    <View
      style={{
        height: h,
        width: w,
        backgroundColor: color || Color.LIGHT[2],
        borderRadius: 32,
        opacity: 0.8,
        marginVertical: gap,
      }}
    />
  );
};

export default Hr;
