import React, {ReactNode} from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Heading from './Heading';
import Colors from '../../Constants/Colors';
import Lottie from 'lottie-react-native';
import Images from '../../Constants/Images';

interface ButtonProps extends TouchableOpacityProps {
  children?: ReactNode;
  variant?: 'outline' | 'solid';
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  height?: number;
  containerStyle?: ViewStyle;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const Button = ({
  children,
  variant = 'solid',
  buttonStyle,
  textStyle,
  height = 45,
  containerStyle,
  isLoading,
  isDisabled,
  ...rest
}: ButtonProps) => {
  const gradientColors =
    variant === 'outline'
      ? [Colors.LIGHT[1], Colors.LIGHT[1]]
      : [Colors.PRIMARY[1], Colors.PRIMARY[2]];
  const textColor = variant === 'outline' ? Colors.PRIMARY[1] : Colors.LIGHT[1];

  return (
    <TouchableOpacity
      activeOpacity={isLoading || isDisabled ? 1 : 0.6}
      style={{
        height: height,
        ...containerStyle,
      }}
      {...(!isLoading && !isDisabled && rest)}>
      <LinearGradient
        colors={gradientColors}
        style={{
          borderRadius: 32,
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: Colors.PRIMARY[1],
          borderWidth: 1,
          opacity: isLoading || isDisabled ? 0.6 : 1,
          ...buttonStyle,
        }}
        start={{x: 0.0, y: 0.5}}
        end={{x: 2, y: 0.5}}
        locations={[0, 0.5]}>
        {isLoading ? (
          <Lottie
            source={
              variant === 'solid'
                ? Images.GIF.BUTTON_LOADING
                : Images.GIF.BUTTON_LOADING_LIGHT
            }
            autoPlay
            style={{height: 70}}
          />
        ) : (
          <Heading level="h5" style={{color: textColor}}>
            {children}
          </Heading>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button;
