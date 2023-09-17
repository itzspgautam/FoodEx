import AsyncStorage from '@react-native-async-storage/async-storage';

const storeFirstTime = async (value: string) => {
  try {
    await AsyncStorage.setItem('isFirstTime', value);
    return {status: true};
  } catch (error) {
    return {status: false};
  }
};

const getFirstTime = async () => {
  const res = await AsyncStorage.getItem('isFirstTime');
  return res === 'true' ? true : res === 'false' ? false : true;
};

export default {storeFirstTime, getFirstTime};
