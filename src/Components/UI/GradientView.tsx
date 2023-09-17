import {StyleSheet, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import LinearGradient from 'react-native-linear-gradient';

interface GradientViewprops {
  children?: ReactNode;
  style?: ViewStyle;
  colors: any;
}

const GradientView = ({children, style, colors}: GradientViewprops) => {
  return (
    <LinearGradient
      colors={colors}
      style={{...style}}
      start={{x: 0.0, y: 0.25}}
      end={{x: 0.5, y: 1.0}}
      locations={[0, 0.6]}>
      {children}
    </LinearGradient>
  );
};

export default GradientView;

const styles = StyleSheet.create({});
