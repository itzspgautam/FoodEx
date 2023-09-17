import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Colors from '../../Constants/Colors';

const RestaurantHrListItemSc = () => {
  return (
    <SkeletonPlaceholder borderRadius={4} backgroundColor={Colors.LIGHT[2]}>
      <SkeletonPlaceholder.Item
        marginTop={15}
        flexDirection="row"
        marginHorizontal={15}
        gap={15}>
        <SkeletonPlaceholder.Item width={80} height={80} borderRadius={8} />

        <SkeletonPlaceholder.Item width={'100%'}>
          <SkeletonPlaceholder.Item
            width={'65%'}
            height={20}
            borderRadius={5}
          />
          <SkeletonPlaceholder.Item
            width={'50%'}
            height={10}
            borderRadius={5}
            marginTop={5}
          />
          <SkeletonPlaceholder.Item width={'100%'} flexDirection="row" gap={4}>
            <SkeletonPlaceholder.Item
              width={30}
              height={15}
              borderRadius={5}
              marginTop={5}
            />
            <SkeletonPlaceholder.Item
              width={30}
              height={15}
              borderRadius={5}
              marginTop={5}
            />
            <SkeletonPlaceholder.Item
              width={30}
              height={15}
              borderRadius={5}
              marginTop={5}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default RestaurantHrListItemSc;
