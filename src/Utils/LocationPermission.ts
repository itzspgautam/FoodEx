import Geolocation, {
  GeolocationError,
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {Linking, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

interface Location {
  latitude: number;
  longitude: number;
}

export const getCurrentPosition = (): Promise<Location> => {
  return new Promise<Location>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        const {latitude, longitude} = position.coords;
        console.log('Location obtained:', latitude, longitude);
        resolve({latitude, longitude});
      },
      (error: GeolocationError) => {
        console.log('Error getting location:', error.message);
        reject(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};

export const isLocationPermissionGranted = async () => {
  try {
    // Check the location permission status
    const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE); // For iOS
    // const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION); // For Android

    // Return true if the location permission is granted, false otherwise
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
};

export const askLocationPermission = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      await request(permission);
      const currentStatus = await check(permission);
      console.log('Current location permission status:', currentStatus);

      if (currentStatus === RESULTS.GRANTED) {
        // Permission already granted
        resolve(true);
        return; // Exit the function early since we don't need to request permission again
      } else if (
        currentStatus === RESULTS.DENIED ||
        currentStatus === RESULTS.BLOCKED
      ) {
        console.log('Opening app settings');
        Linking.openSettings();
      }

      // Wait for the app to come back from settings
      const checkAfterReturn = setInterval(async () => {
        const updatedStatus = await isLocationPermissionGranted();
        console.log('Updated location permission status:', updatedStatus);
        if (updatedStatus === true) {
          clearInterval(checkAfterReturn); // Stop checking once permission is granted
          resolve(true);
        }
      }, 1000); // You can adjust the interval as needed
    } catch (error) {
      console.error('Error requesting location permission:', error);
      // Reject the Promise if there was an error
      reject(error);
    }
  });
};
