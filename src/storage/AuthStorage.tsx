import AsyncStorage from '@react-native-async-storage/async-storage';

const storeUser = async (value: string) => {
  try {
    await AsyncStorage.setItem('user', value);
    return {status: true};
  } catch (error) {
    return {status: false};
  }
};
const getUser = async () => {
  return await AsyncStorage.getItem('user');
};

const removeUser = async () => {
  await AsyncStorage.removeItem('user');
};

export default {storeUser, getUser, removeUser};
