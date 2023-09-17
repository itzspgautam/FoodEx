import React, {ReactNode} from 'react';
import {Text, TextStyle} from 'react-native';
import Fonts from '../../Constants/Fonts';

interface HeadingProps {
  children?: ReactNode;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  style?: TextStyle;
  font?: any;
  numberOfLines?: any;
}

const Heading = ({
  level,
  style,
  children,
  font = Fonts.BOLD,
  ...rest
}: HeadingProps) => {
  let fontSize;
  switch (level) {
    case 'h1':
      fontSize = 30;
      break;
    case 'h2':
      fontSize = 26;
      break;
    case 'h3':
      fontSize = 20;
      break;
    case 'h4':
      fontSize = 18;
      break;
    case 'h5':
      fontSize = 16;
      break;
    case 'h6':
      fontSize = 14;
      break;
    default:
      fontSize = 16;
  }

  return (
    <Text style={[{fontSize, fontFamily: font}, style]} {...rest}>
      {children}
    </Text>
  );
};

export default Heading;
