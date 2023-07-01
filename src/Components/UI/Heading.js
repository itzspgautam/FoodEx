import {StyleSheet, Text} from 'react-native';
import React from 'react';
import Font from '../../Theme/Font';
import ColorTheme from '../../Theme/Color';

const Heading = ({children, style, level}) => {
  const getFontSize = () => {
    switch (level) {
      case 1:
        return 28;
      case 2:
        return 24;
      case 3:
        return 20;
      case 4:
        return 16;
      default:
        return 14;
    }
  };
  const Color = ColorTheme();
  const styles = StyleSheet.create({
    text: {
      color: Color.HEADING,
      fontFamily: Font.HEAVY,
    },
  });
  return (
    <Text style={{...styles.text, fontSize: getFontSize(), ...style}}>
      {children}
    </Text>
  );
};

export default Heading;
