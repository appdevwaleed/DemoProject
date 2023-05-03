
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';
import actions from '../redux/actions';

export async function requestUserPermission() {
    // if (Platform.OS == 'ios') {
    //     await messaging().registerDeviceForRemoteMessages();
    // }
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
        console.log('Authorization status:', authStatus);
        getFcmToken()
    }
}

const getFcmToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log(fcmToken, 'the old token');
    if (!fcmToken) {
        try {
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                console.log(fcmToken, 'the new genrated token');
                // user has a device token
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        } 
        catch (error) {
            console.log(error, "error in fcmToken")
            // showError(error.message)
        }
    }
}

export const notificationListener = async () => {

    PushNotification.configure({
        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },
        requestPermissions: true,
        popInitialNotification: true,
    });

    createDefaultChannels()

    function createDefaultChannels() {
        PushNotification.createChannel(
          {
            channelId: "default-channel-id", // (required)
            channelName: `Default channel`, // (required)
            channelDescription: "A default channel", // (optional) default: undefined.
            soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
            importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
          },
          (created) => console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
        PushNotification.createChannel(
          {
            channelId: "sound-channel-id", // (required)
            channelName: `Sound channel 2`, // (required)
            channelDescription: "A sound channel 2", // (optional) default: undefined.
            soundName: "notification.wav", // (optional) See `soundName` parameter of `localNotification` function
            importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
          },
          (created) => console.log(`createChannel 'sound-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
    }

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log('Notification caused app to open from background state bla bla:', remoteMessage);
        const { data, messageId, notification } = remoteMessage
        if (Platform.OS == 'android' && notification.android.sound == 'notification') {
            actions.isVendorNotification(true)
          }
          if (Platform.OS == 'ios' && notification.sound == 'notification.wav') {
            actions.isVendorNotification(true)
          }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
          if (remoteMessage) {
              console.log("remote message inital notification", remoteMessage)
              const { data, messageId, notification } = remoteMessage
              if (Platform.OS == 'android' && notification.android.sound == 'notification') {
                  actions.isVendorNotification(true)
                }
                if (Platform.OS == 'ios' && notification.sound == 'notification.wav') {
                  actions.isVendorNotification(true)
                }
          }
      });
    return null

}