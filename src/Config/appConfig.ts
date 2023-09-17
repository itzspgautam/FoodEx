import {Platform} from 'react-native';

export const AppConfig = {
  API:
    Platform.OS === 'android'
      ? 'http://172.20.10.4:3000'
      : 'http://localhost:3000',
};

// ipconfig getifaddr en0
