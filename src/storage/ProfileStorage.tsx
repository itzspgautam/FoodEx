import AsyncStorage from '@react-native-async-storage/async-storage';

const storeSelectedAddress = async (value: string) => {
  try {
    await AsyncStorage.setItem('selected-address', value);
    return {status: true};
  } catch (error) {
    return {status: false};
  }
};
const getSelectedAddress = async () => {
  return await AsyncStorage.getItem('selected-address');
};

const removeSelectedAddress = async () => {
  await AsyncStorage.removeItem('selected-address');
};

export default {
  storeSelectedAddress,
  getSelectedAddress,
  removeSelectedAddress,
};
