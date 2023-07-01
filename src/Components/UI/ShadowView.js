import React from 'react';
import {View, StyleSheet} from 'react-native';
import ColorTheme from '../../Theme/Color';
const ShadowView = ({children, style}) => {
  const Color = ColorTheme();
  const styles = StyleSheet.create({
    container: {
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 8,
      backgroundColor: Color.CARD,
      borderRadius: 8,
    },
  });

  return <View style={{...styles.container, ...style}}>{children}</View>;
};

export default ShadowView;
