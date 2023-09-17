import AsyncStorage from '@react-native-async-storage/async-storage';

const storeCart = async (value: any) => {
  try {
    await AsyncStorage.setItem('cart', value);
    return {status: true};
  } catch (error) {
    return {status: false};
  }
};
const getCart = async () => {
  return await AsyncStorage.getItem('cart');
};
const removeCart = async () => {
  await AsyncStorage.removeItem('cart');
};

export default {storeCart, getCart, removeCart};
