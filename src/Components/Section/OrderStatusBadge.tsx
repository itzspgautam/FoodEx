import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Heading from '../UI/Heading';
import Icon from 'react-native-vector-icons/Octicons';
import Colors from '../../Constants/Colors';

const statusArray = [
  {
    status: 'pending',
    icon: 'issue-draft',
    color: '#FFD700', // Golden Yellow
  },
  {
    status: 'processing',
    icon: 'issue-opened',
    color: '#FFA500', // Orange
  },
  {
    status: 'cooking',
    icon: 'flame',
    color: '#FF6347', // Tomato Red
  },
  {
    status: 'dispatched',
    icon: 'package',
    color: '#2196F3', // Royal Blue
  },
  {
    status: 'delivered',
    icon: 'check-circle',
    color: '#008000', // Green
  },
  {
    status: 'cancelled',
    icon: 'x-circle',
    color: '#FF0000', // Red
  },
];

const OrderStatusBadge = ({status}: {status: any}) => {
  return (
    <>
      {statusArray?.map(
        st =>
          status === st?.status && (
            <View key={st.status}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 4,
                  alignItems: 'center',
                }}>
                <Icon name={st?.icon} size={20} color={st?.color} />
                <Heading style={{color: st?.color}} level="h6">
                  {st?.status?.toLocaleUpperCase()}
                </Heading>
              </View>
            </View>
          ),
      )}
    </>
  );
};

export default OrderStatusBadge;

const styles = StyleSheet.create({});
