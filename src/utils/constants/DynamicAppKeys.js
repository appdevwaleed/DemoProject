import {Platform} from 'react-native';
import {getBundleId} from 'react-native-device-info';

const shortCodes = {
   runrun: 'bf8608'
};

const appIds = {
  runrun: Platform.select({
    ios: 'com.deliveryzone',
    android: 'com.deliveryzone.runrun',
  })
};

const socialKeys = {
  TWITTER_COMSUMER_KEY: 'OCOQeRWzRoDAnGNbNFsbN5kuk',
  TWITTER_CONSUMER_SECRET: 'zBfzttCBVAzimuaIsDWDU1MjqI4pWzvNsrW6YOYPVZtgtzTlN8'
};

export {appIds, socialKeys, shortCodes};
