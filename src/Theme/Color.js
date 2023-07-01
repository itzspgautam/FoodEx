import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

const Color = () => {
  const {theme} = useSelector(State => State.General);
  const lightTheme = {
    PRIMARY: {
      //orange
      1: '#DC220F',
      2: '#F05600',
    },

    BUTTON: {
      //orange
      1: '#DC220F',
      2: '#F05600',
    },
    BUTTON_DARK: {
      //grey
      1: '#535865',
      2: '#535865',
    },

    CARD: '#FFFFFF',
    BG: '#FCFCFC',

    HEADING: '#2A2C39',

    TEXT: '#2A2C39',

    WHITE: '#FFFFFF',
    BLACK: '#000000',
    DEFAULT: '#F05600',

    DARK: {
      1: '#22222C',
      2: '#2A2C39',
      3: '#535865',
      4: '#83849C',
      5: '#B9BBC9',
    },
    LIGHT: {
      1: '#FFFFFF',
      2: '#FCFCFC',
      3: '#F2F3FA',
      4: '#D3D3D3',
      5: '#A9A9A9',
    },
  };

  const darkTheme = {
    PRIMARY: {
      //grey
      1: '#F05600',
      2: '#F05600',
    },

    BUTTON: {
      //grey
      1: '#535865',
      2: '#535865',
    },
    BUTTON_DARK: {
      //orange
      1: '#F05600',
      2: '#F05600',
    },

    CARD: '#2A2C39',
    BG: '#22222C',

    HEADING: '#FFFFFF',

    TEXT: '#000000',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    DEFAULT: '#F05600',

    SECONDARY: {
      DARK: '#DC220F',
      LIGHT: '#F05600',
    },
    DARK: {
      1: '#FFFFFF',
      2: '#FCFCFC',
      3: '#F0EFEF',
      4: '#D3D3D3',
      5: '#A9A9A9',
    },
    LIGHT: {
      1: '#000000',
      2: '#2A2C39',
      3: '#535865',
      4: '#83849C',
      5: '#B9BBC9',
    },
  };

  return theme === 'light' ? lightTheme : darkTheme;
};

export default Color;
