import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Colors from '../../Constants/Colors';

const ButtonListItemSc = () => {
  return (
    <SkeletonPlaceholder backgroundColor={Colors.LIGHT[2]}>
      <SkeletonPlaceholder.Item width={80} height={30} borderRadius={32} />
    </SkeletonPlaceholder>
  );
};

export default ButtonListItemSc;
