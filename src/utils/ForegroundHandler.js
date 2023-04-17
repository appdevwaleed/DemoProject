import { useEffect } from 'react';
import { Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import actions from '../redux/actions';



const ForegroundHandler = (props) => {

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("remote message foreground", remoteMessage)
      const { data, messageId, notification } = remoteMessage
      {
        Platform.OS == 'ios' ?
          PushNotificationIOS.addNotificationRequest({
            id: messageId,
            body: data?.body || '',
            title: data?.title || '',
            sound: notification.sound,
          })
          :
          PushNotification.localNotification({
            channelId: notification.android.channelId,
            id: messageId,
            body: data?.message || '',
            title: data?.type || '',
            soundName: notification.android.sound,
            vibrate: true,
            playSound: true
          })
      }


      if (Platform.OS == 'android' && notification.android.sound == 'notification') {
        actions.isVendorNotification(true)
        const { data } = remoteMessage.data
        let _data = JSON.parse(data)
        console.log('foreground notification listener checking data >>>>',_data)
        console.log('foreground notification listener checking data >>>>',_data.vendors[0].vendor.auto_accept_order == 1)
        if(_data.vendors[0].vendor.auto_accept_order == 1){
          StartPrinting(_data)
        }
      }

      if (Platform.OS == 'ios' && notification.sound == 'notification.wav') {
        actions.isVendorNotification(true)
      }

    });
    return unsubscribe;
  }, []);

  return null;
};

export default ForegroundHandler;