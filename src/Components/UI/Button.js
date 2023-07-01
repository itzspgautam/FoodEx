import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colorvariant from '../../Theme/Color';
import Font from '../../Theme/Font';
import Texts from './Texts';

const Button = ({variant, title, onPress}) => {
  const Color = Colorvariant();
  const getButtonColors = () => {
    if (variant === 'dark') {
      return [Color.BUTTON_DARK[1], Color.BUTTON_DARK[2]];
    } else if (variant === 'light') {
      return [Color.BUTTON[1], Color.BUTTON[2]];
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={getButtonColors()}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.button}>
        <Texts level={'md'} style={{color: Color.WHITE, fontFamily: Font.BOLD}}>
          {title}
        </Texts>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '100%',
  },
});

export default Button;
