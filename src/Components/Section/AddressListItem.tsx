import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Heading from '../UI/Heading';
import Fonts from '../../Constants/Fonts';
import Icon from 'react-native-vector-icons/Octicons';
import Paragraph from '../UI/Paragraph';
import MuiIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../Constants/Colors';
import {TouchableOpacity} from 'react-native';
import {SingleAddress} from '../../State/Features/ProfileSlice';

const AddressListItem = ({
  address,
  setActiveAddres,
  activeAddress,
}: {
  address: SingleAddress;
  setActiveAddres: any;
  activeAddress: SingleAddress | null;
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.5}
      onPress={() => setActiveAddres(address)}>
      <View style={styles.leftData}>
        <Icon name="home" size={20} />
        <View style={{gap: 2}}>
          <Heading
            level="h5"
            font={Fonts.MEDIUM}
            style={{color: Colors.DARK[1]}}>
            {address.type}
          </Heading>
          <Paragraph
            level={3}
            style={{
              color: Colors.LIGHT[3],
            }}
            numberOfLines={2}>
            {address.landmark}
            {address.streetHouseNumber},{address.area},{address.district},
          </Paragraph>
        </View>
      </View>

      <MuiIcon
        name={
          activeAddress?._id === address?._id
            ? 'circle-slice-8'
            : 'circle-outline'
        }
        size={20}
        color={Colors.PRIMARY[2]}
      />
    </TouchableOpacity>
  );
};

export default AddressListItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftData: {
    flexDirection: 'row',
    gap: 15,
    flex: 1,
    padding: 5,
    maxWidth: '80%',
  },
});
