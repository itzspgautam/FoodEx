import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import Store from './src/State/Store';
import Navigators from './src/Navigation';

const App = () => {
  return (
    <Provider store={Store}>
      <Navigators />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
