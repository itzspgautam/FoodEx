import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Colors from '../../Constants/Colors';

const AddressListSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={4} backgroundColor={Colors.LIGHT[2]}>
      <SkeletonPlaceholder.Item flexDirection="row" gap={10}>
        <SkeletonPlaceholder.Item width={30} height={30} borderRadius={50} />
        <SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item width={100} height={15} borderRadius={10} />
          <SkeletonPlaceholder.Item marginTop={5} width={300} height={10} />
          <SkeletonPlaceholder.Item marginTop={5} width={150} height={8} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default AddressListSkeleton;
