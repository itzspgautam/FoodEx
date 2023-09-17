import React, {ReactNode} from 'react';
import {Text, TextStyle} from 'react-native';
import Fonts from '../../Constants/Fonts';

interface ParagraphProps {
  level: 1 | 2 | 3 | 4;
  style?: TextStyle;
  children?: ReactNode;
  fontFamily?: any;
  numberOfLines?: number;
}

const Paragraph: React.FC<ParagraphProps> = ({
  level,
  style,
  fontFamily = Fonts.REGULAR,
  children,
  ...rest
}) => {
  let fontSize;
  switch (level) {
    case 1:
      fontSize = 16;
      break;
    case 2:
      fontSize = 14;
      break;
    case 3:
      fontSize = 12;
      break;
    case 4:
      fontSize = 10;
      break;
    default:
      fontSize = 16;
  }

  return (
    <Text style={[{fontSize, fontFamily}, style]} {...rest}>
      {children}
    </Text>
  );
};

export default Paragraph;
