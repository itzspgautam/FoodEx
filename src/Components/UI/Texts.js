import {StyleSheet, Text} from 'react-native';
import React from 'react';
import Font from '../../Theme/Font';
import ColorTheme from '../../Theme/Color';

const Texts = ({children, style, level}) => {
  const Color = ColorTheme();
  const styles = StyleSheet.create({
    text: {
      color: Color.TEXT,
      fontFamily: Font.MEDIUM,
    },
  });

  const getFontSize = () => {
    switch (level) {
      case 'xsm':
        return 12;
      case 'sm':
        return 14;
      case 'md':
        return 16;
      case 'lg':
        return 20;
      case 'xl':
        return 24;
      default:
        return 16;
    }
  };

  return (
    <Text style={{...styles.text, fontSize: getFontSize(), ...style}}>
      {children}
    </Text>
  );
};

export default Texts;
