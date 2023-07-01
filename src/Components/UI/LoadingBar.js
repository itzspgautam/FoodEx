import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ColorTheme from '../../Theme/Color';

const LoadingBar = ({percentage = 0, h = 4, w = '90%', progressColor}) => {
  const Color = ColorTheme();

  return (
    <View
      style={{
        height: h,
        width: w,
        backgroundColor: 'rgba(255,255,255,.5)',
        backfaceVisibility: 'hidden',
        borderRadius: 32,
        overflow: 'hidden',
        opacity: 0.8,
      }}>
      <View
        style={{
          height: '100%',
          width: percentage + '%',
          backgroundColor: progressColor || Color.WHITE,
          borderRadius: 32,
        }}
      />
    </View>
  );
};

export default LoadingBar;
