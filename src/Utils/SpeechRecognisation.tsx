import React, {ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import Voice, {SpeechErrorEvent} from '@react-native-voice/voice';
import Colors from '../Constants/Colors';

import Lottie from 'lottie-react-native';
import Images from '../Constants/Images';
import Paragraph from '../Components/UI/Paragraph';
import Heading from '../Components/UI/Heading';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../State/store';
import {searchRestaurantAndFood} from '../State/Features/RestaurantSlice';
import {navigate} from './NavigationUtils';

const SpeechRecognisation = ({closeSpeechSearch}: {closeSpeechSearch: any}) => {
  const dispatch = useDispatch<AppDispatch>();
  const micIconRef = useRef<Lottie>(null);
  const [volume, setVolume] = useState('');
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState('');
  const [finalResult, setFinalResult] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e: any) => {
    setStarted(true);
    playIcon();
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    setError(JSON.stringify(e.error));
    pauseIcon();
  };

  const onSpeechResults = (e: any) => {
    setResults(e?.value[0]);
  };

  const onSpeechVolumeChanged = (e: any) => {
    setVolume(e.value);
  };

  const startRecording = async () => {
    try {
      await Voice.start('en_IN');
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setStarted(false);
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
  };

  const initFurtherProcess = async () => {
    setTimeout(async () => {
      if (results !== '') {
        await stopRecording();
        await setFinalResult(results);
        await dispatch(searchRestaurantAndFood(results));
        await _clearState();
        await closeSpeechSearch();
        navigate('Search');
      }
    }, 2000);
    console.log(results);
  };

  const _clearState = () => {
    setVolume('');
    setError('');
    setStarted(false);
    setResults('');
  };

  const playIcon = () => micIconRef.current?.play();
  const pauseIcon = () => micIconRef.current?.reset();

  useEffect(() => {
    startRecording();
  }, []);

  useEffect(() => {
    initFurtherProcess();
  }, [results]);
  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',

          height: 100,
          width: 100,
        }}>
        {finalResult === '' ? (
          <Lottie
            ref={micIconRef}
            source={Images.GIF.MIC_RECORDING}
            style={{flex: 1}}
          />
        ) : (
          <Lottie
            source={Images.GIF.CHECK_GREEN}
            style={{flex: 1}}
            autoPlay
            loop={false}
            resizeMode="contain"
          />
        )}
      </View>
      <View>
        {results !== '' ? (
          <Paragraph level={2} style={{color: Colors.DARK[3]}}>
            {results}
          </Paragraph>
        ) : finalResult !== '' ? (
          <Paragraph level={2} style={{color: Colors.DARK[3]}}>
            Searching "{finalResult}"
          </Paragraph>
        ) : started ? (
          <View style={{gap: 4, alignItems: 'center'}}>
            <Paragraph level={2} style={{color: Colors.LIGHT[3]}}>
              Hey! I am listening...
            </Paragraph>
            <Heading level={'h5'} style={{color: Colors.DARK[3]}}>
              Try "Chicken Biryani"
            </Heading>
          </View>
        ) : (
          <TouchableOpacity onPress={startRecording}>
            <Heading level={'h6'} style={{color: Colors.LIGHT[3]}}>
              Tap to search
            </Heading>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
});

export default SpeechRecognisation;
