// import { AppRegistry } from 'react-native';
// import { name as appName } from './app.json';
// import  App  from './App';

// AppRegistry.registerComponent(appName, () => App);

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
console.disableYellowBox = true;
import messaging from '@react-native-firebase/messaging';
import actions from './src/redux/actions';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';


// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  
  const { data, notification } = remoteMessage

  if (Platform.OS == 'android' && notification.android.sound == 'notification') {
    console.log('Message handled in the background!', data.data);
    let _data = JSON.parse(data.data)
    if (_data.vendors[0].vendor.auto_accept_order == 1) {
      StartPrinting(_data)
    } else {
      actions.isVendorNotification(true)
    }
  }
});
AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));

