import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Colors from '../../Constants/Colors';

const OrderDetailPageSc = () => {
  return (
    <SkeletonPlaceholder backgroundColor={Colors.LIGHT[2]}>
      <>
        <SkeletonPlaceholder.Item height={120} borderRadius={10} />

        {[1, 2, 3, 4].map(item => (
          <SkeletonPlaceholder.Item
            flexDirection="row"
            gap={10}
            key={String(item + '' + Math.random())}
            marginTop={20}>
            <SkeletonPlaceholder.Item
              width={30}
              height={30}
              borderRadius={50}
            />
            <SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={100}
                height={15}
                borderRadius={10}
              />
              <SkeletonPlaceholder.Item marginTop={5} width={300} height={10} />
              <SkeletonPlaceholder.Item marginTop={5} width={150} height={8} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        ))}

        <SkeletonPlaceholder.Item marginTop={20}>
          <SkeletonPlaceholder.Item marginTop={5} height={10} />
          <SkeletonPlaceholder.Item marginTop={5} height={10} />
          <SkeletonPlaceholder.Item marginTop={5} height={10} />
          <SkeletonPlaceholder.Item marginTop={10} height={20} />
        </SkeletonPlaceholder.Item>

        {[1, 2, 3].map(item => (
          <SkeletonPlaceholder.Item
            flexDirection="row"
            gap={10}
            key={String(item)}
            marginTop={20}>
            <SkeletonPlaceholder.Item
              width={50}
              height={50}
              borderRadius={10}
            />
            <SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={100}
                height={15}
                borderRadius={10}
              />
              <SkeletonPlaceholder.Item marginTop={5} width={300} height={10} />
              <SkeletonPlaceholder.Item marginTop={5} width={150} height={8} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        ))}
      </>
    </SkeletonPlaceholder>
  );
};

export default OrderDetailPageSc;
