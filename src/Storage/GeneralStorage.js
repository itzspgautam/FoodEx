import AsyncSorage from '@react-native-async-storage/async-storage';

const setAppTheme = mode => {
  return AsyncSorage.setItem('theme', mode);
};

const getAppTheme = () => {
  return AsyncSorage.getItem('theme');
};

export {setAppTheme, getAppTheme};
