import {View, Text} from 'react-native';
import React from 'react';
import Navigators from './src/Navigation';
import {Provider} from 'react-redux';
import {store} from './src/State/store';
const App = () => {
  return (
    <Provider store={store}>
      <Navigators />
    </Provider>
  );
};

export default App;
