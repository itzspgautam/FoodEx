import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../State/store';
import auth from '@react-native-firebase/auth';
import Button from '../../Components/UI/Button';
import {logoutUser} from '../../State/Features/AuthSlice';

const ProfileScreen = ({navigation}: {navigation: any}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {user, token} = useSelector((state: RootState) => state.Auth);
  console.log('Profile=>', token);

  const logoutHandle = async () => {
    // await dispatch(logoutUser(navigation)); // Pass the navigation object to the logoutUser action creator
    // Do not navigate to 'Login' here; navigation will be handled in the logoutUser action creator
    await dispatch(logoutUser(navigation));
  };
  return (
    <View>
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>
      <Text>{user?.phone_number}</Text>
      <Text>{user?.photoURL}</Text>
      <Text>{user?._id}</Text>
      <Text>{user?.firebaseId}</Text>
      <Text>Token:{token}</Text>
      <Button onPress={logoutHandle}>Logout</Button>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
