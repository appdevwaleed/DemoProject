import * as React from 'react';
import {showMessage} from 'react-native-flash-message';
import Geocoder from 'react-native-geocoder';
import Geolocation from 'react-native-geolocation-service';
import {BackHandler, Alert, Animated} from 'react-native';
import strings from './../constants/lang/index';
import {callingCountries} from 'country-data';
import navigationStrings from '../navigation/navigationStrings';
import actions from '../redux/actions';
import * as NavigationService from '../navigation/NavigationService';

const getCurrentLocation = (type) =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
         console.log(position,"THIS IS POSITION")
        const cords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log(position,"THIS IS POSITION")
        getLocation(
          position.coords.latitude,
          position.coords.longitude,
          type,
        ).then((res) => {
          console.log(res,"THIS IS RES AFTER POSITION")
          if (type == 'home') {
            const data = {
              ...cords,
              address: res,
            };
            resolve(data);
          } else if (type == 'address') {
            resolve(res);
          }
        });
      },
      (error) => {
        console.log(error,"THIS IS ERROR FROM POSITION");
        reject(error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
 export  const getLocationData = async (lat, lng) => {
    let res = await Geocoder.geocodePosition({lat, lng});
    console.log(res)
    console.log('This is my sea data')
    let addr = res[0].formattedAddress;
    let country_id =
      callingCountries[`${res[0].countryCode}`]?.countryCallingCodes[0];
    let street = res[0].streetName;
    let city = res[0].locality;
    let states = res[0].adminArea;
    let pincode = res[0].postalCode;
    let latitude = res[0].position.lat;
    let longitude = res[0].position.lng;

    let data = {
      address: addr,
      street: street,
      city: city,
      states: states,
      latitude: latitude,
      longitude: longitude,
      country_id: country_id,
      pincode: pincode,
      address_type: '1',
    };

    return data;
  };
const getLocation = async (lat, lng, type) => {
  if (type == 'home') {
    try {
      let res = await Geocoder.geocodePosition({lat, lng});
      let addr = res[0].formattedAddress;
      return addr;
    } catch (err) {}
  } else if (type == 'address') {
    try {
      let res = await Geocoder.geocodePosition({lat, lng});

      let addr = res[0].formattedAddress;

      let country_id =
        callingCountries[`${res[0].countryCode}`]?.countryCallingCodes[0];
      let street = res[0].streetName;
      let city = res[0].locality;
      let states = res[0].adminArea;
      let pincode = res[0].postalCode;
      let latitude = res[0].position.lat;
      let longitude = res[0].position.lng;

      let data = {
        address: addr,
        street: street,
        city: city,
        states: states,
        latitude: latitude,
        longitude: longitude,
        country_id: country_id,
        pincode: pincode,
        address_type: '1',
      };

      return data;
    } catch (err) {}
  }
};

const showError = (message) => {
  console.log(message, 'THIS IS MESSAGE');

  showMessage({
    type: 'danger',
    icon: 'danger',
    message,
  });
  // Toast.show(message);
};

const showSuccess = (message) => {
  showMessage({
    type: 'success',
    icon: 'success',
    message,
  });

  // Toast.show(message);
};
const showInfo = (message) => {
  showMessage({
    type: 'info',
    icon: 'info',
    message,
  });
  // Toast.show(message);
};

export function otpTimerCounter(seconds) {
  // alert(seconds)
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;
  return `${m}:${s}`;
}

export function getRandomColor() {
  const w = Math.floor(Math.random() * 256);
  const x = Math.floor(Math.random() * 256);
  const y = Math.floor(Math.random() * 256);
  const z = 0.3;
  const rgbaColor = 'rgba(' + w + ',' + x + ',' + y + ',' + z + ')';
  return rgbaColor;
}

export function getColorCodeWithOpactiyNumber(color, transparency) {
  /*
HEXA VALUE CHANGE IS DIFFRENT IN JS, HERE THE TRANSPERANCY YOU WANT TO ADD IS ADDED AT THE END
Using an alpha value to update a color’s transparency will change the hex code format from #RRGGBB to #RRGGBBAA (red, green, blue, alpha). 
The first six values (the red, green, and blue ones) stay the exact same. The only difference is the last two values (the AA).
  */
  switch (String(transparency)) {
    case '10':
      return `#${color}1A`;
    case '15':
      return `#${color}26`;
    case '20':
      return `#${color}33`;
    case '25':
      return `#${color}40`;
    case '30':
      return `#${color}4D`;
    case '35':
      return `#${color}59`;
    case '40':
      return `#${color}66`;
    case '50':
      return `#${color}80`;
    case '60':
      return `#${color}99`;
    case '70':
      return `#${color}B3`;
  }
}

export function getImageUrl(url1, url2, dimentions) {
  //
  return `${url1}${dimentions}${url2}`;
}

const androidBackButtonHandler = () => {
  Alert.alert(strings.HOLD_ON, strings.EXIT_WARNING, [
    {
      text: strings.CANCEL,
      onPress: () => null,
      style: 'cancel',
    },
    {text: strings.YES, onPress: () => BackHandler.exitApp()},
  ]);
  return true;
};

//Renaming the object key
const renameKey = (object, key, newKey) => {
  const clonedObj = clone(object);
  const targetKey = clonedObj[key];
  delete clonedObj[key];
  clonedObj[newKey] = targetKey;
  return clonedObj;
};
//cloning object
const clone = (obj) => Object.assign({}, obj);

export function getAddressComponent(details,geoData,update) {
  console.log(details, 'details myaddress');
  console.log(geoData, 'geoData myaddress');
  let pincode = '';
  let city = '';
  let states = '';
  let country = '';
  let country_id = '';
  let address = '';
  let latitude = '';
  let longitude = '';
  let street = '';
  let shortname='';
  pincode = details?.address_components?.find((addressComponent) =>
    addressComponent?.types.includes('postal_code'),
  )?.short_name;

  city = details?.address_components?.find((addressComponent) =>
    addressComponent?.types.includes('locality'),
  )?.short_name;

  states = details?.address_components?.find((addressComponent) =>
    addressComponent?.types.includes('administrative_area_level_1'),
  )?.short_name;

  street = details?.address_components?.find((addressComponent) =>
    addressComponent?.types.includes('route'),
  )?.short_name;

  country = details?.address_components?.find((addressComponent) =>
    addressComponent?.types?.includes('country'),
  )?.long_name;

  let country_sort = details?.address_components?.find((addressComponent) =>
    addressComponent?.types?.includes('country'),
  )?.short_name;
  country_id = callingCountries[`${country_sort}`]?.countryCallingCodes[0];
  //address = details?.formatted_address;
  console.log(details?.formatted_address,geoData?.description,'THIS IS MY ADDRESS')
  address = geoData?.description || details?.formatted_address;
  latitude = details?.geometry?.location?.lat;
  longitude = details?.geometry?.location?.lng;
  let data = {
    country_code: country_sort,
    city: city,
    states: states,
    street: street,
    country: country,
    latitude: latitude,
    longitude: longitude,
    pincode: pincode,
    phonecode: country_id,
    address: address,
    // address_type: '1',
  };
  if (update == 'update') {
    let data = {
      code: country_sort,
      city: city,
      states: states,
      street: street,
      country: country,
      latitude: latitude,
      longitude: longitude,
      pincode: pincode,
      country_id: country_id,
      address: address,
      // address_type: '1',
    };
    return data;
  }
  return data;
}

export const sessionHandler = (error) => {
  actions.userLogout();
  NavigationService.navigate(navigationStrings.OUTER_SCREEN, {}),
    Alert.alert(error, '', [
      {
        text: strings.OK,
        // cancelable: false,
        onPress: () => console.log('okay Pressed'),
        //   onPress: () =>
        //     NavigationService.navigate(navigationStrings.OUTER_SCREEN, {}),
      },
    ]);
};

export const getScaleTransformationStyle = (
  animated: Animated.Value,
  startSize: number = 1,
  endSize: number = 0.95,
) => {
  const interpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [startSize, endSize],
  });
  return {
    transform: [{scale: interpolation}],
  };
};

export const pressInAnimation = (
  animated: Animated.Value,
  duration: number = 150,
) => {
  animated.setValue(0);
  Animated.timing(animated, {
    toValue: 1,
    duration,
    useNativeDriver: true,
  }).start();
};

export const pressOutAnimation = (
  animated: Animated.Value,
  duration: number = 150,
) => {
  animated.setValue(1);
  Animated.timing(animated, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  }).start();
};

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const getUrlRoutes = (url, indexOfRoute) => {
  const route = url.replace(/.*?:\/\//g, '');
  const routeName = route.split('/')[0 + indexOfRoute];

  return routeName;
};

const timeInLocalLangauge = (value, selectedLanguage) => {
  return `${value.toLocaleDateString(selectedLanguage, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}, ${value.toLocaleTimeString(selectedLanguage, {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const checkEvenOdd = (num) => {
  return num % 5 === 0 ? num : num - (num % 5);
};

export {
  showError,
  showSuccess,
  showInfo,
  getCurrentLocation,
  androidBackButtonHandler,
  renameKey,
  getParameterByName,
  getUrlRoutes,
  timeInLocalLangauge,
  checkEvenOdd,
};
