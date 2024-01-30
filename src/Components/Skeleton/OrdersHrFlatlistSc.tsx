import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Colors from '../../Constants/Colors';

const ordersHrFlatlistSc = () => {
  return (
    <SkeletonPlaceholder borderRadius={4} backgroundColor={Colors.LIGHT[2]}>
      <SkeletonPlaceholder.Item marginTop={10}>
        <SkeletonPlaceholder.Item width={230} height={90} borderRadius={10} />
        <SkeletonPlaceholder.Item marginTop={10} width={200} height={20} />
        <SkeletonPlaceholder.Item marginTop={8} width={120} height={10} />
        <SkeletonPlaceholder.Item width={'100%'} flexDirection="row" gap={4}>
          <SkeletonPlaceholder.Item
            width={50}
            height={15}
            borderRadius={5}
            marginTop={5}
          />
          <SkeletonPlaceholder.Item
            width={100}
            height={15}
            borderRadius={5}
            marginTop={5}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default ordersHrFlatlistSc;
