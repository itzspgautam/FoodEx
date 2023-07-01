import React from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ColorTheme from '../../Theme/Color';

const GradientView = ({theme, children, customStyle}) => {
  const Color = ColorTheme();

  return (
    <LinearGradient
      colors={[Color.PRIMARY[1], Color.PRIMARY[2]]}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      style={{...styles.gradient, ...customStyle}}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GradientView;
