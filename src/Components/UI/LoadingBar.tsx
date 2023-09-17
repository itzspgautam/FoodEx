import React, {CSSProperties, FC, PropsWithChildren} from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';

interface LoadingBarProps extends PropsWithChildren {
  percentage: any;
  h?: number;
  w: any;
  progressColor?: string;
}

const LoadingBar = ({
  percentage,
  h = 4,
  w = '100%',
  progressColor,
}: LoadingBarProps) => {
  const styles = StyleSheet.create({
    container: {
      height: h,
      width: w,
      backgroundColor: 'rgba(255,255,255,.5)',
      backfaceVisibility: 'hidden',
      borderRadius: 32,
      overflow: 'hidden',
      opacity: 0.8,
    },
    fill: {
      height: '100%',
      width: percentage,
      backgroundColor: progressColor || 'white',
      borderRadius: 32,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.fill} />
    </View>
  );
};

export default LoadingBar;
