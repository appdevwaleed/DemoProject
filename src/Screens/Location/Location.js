import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Geocoder from 'react-native-geocoding';
import {useSelector} from 'react-redux';
import GooglePlaceInput from '../../Components/GooglePlaceInput';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {chekLocationPermission} from '../../utils/permissions';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import {moderateScale} from '../../styles/responsiveSize';

navigator.geolocation = require('react-native-geolocation-service');

export default function Location({route, navigation}) {
  console.log("Location - Location.js")
  //get param data from specific screen
  const {type} = route.params;
  const addressType = route?.params?.addressType;

  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: true,
    address: '',
  });

  const {isLoading, address} = state;

  //Reduc store data
  const {appData, appStyle, themeColors} = useSelector(
    (state) => state?.initBoot,
  );
  const {profile} = appData;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  useEffect(() => {
    Geocoder.init(profile.preferences.map_key, {language: 'en'}); // set the language
  }, []);

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  //Get Your current location
  const getCurrentLocation = () => {
    chekLocationPermission()
      .then((result) => {
        if (result !== 'goback') {
          getCurrentPosition();
        }
      })
      .catch((error) => console.log('error while accessing location', error));
  };

  const getCurrentPosition = () => {
    return navigator.geolocation.default.getCurrentPosition(
      (position) => {
        Geocoder.from({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
          .then((json) => {
            var addressComponent = json.results[0].formatted_address;
            let details = {};
            details = {
              formatted_address: addressComponent,
              geometry: {
                location: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
              },
              address_components: json.results[0].address_components,
            };

            if (type == 'Home1') {
              navigation.navigate(navigationStrings.HOME, {
                details,
              });
            }

            if (type == 'Pickup') {
              navigation.navigate(navigationStrings.PICKUPLOCATION, {
                details,
                addressType,
              });
            }
          })
          .catch((error) => console.log(error, 'errro geocode'));
      },
      (error) => console.log(error.message),
      {enableHighAccuracy: true, timeout: 20000},
    );
  };

  const handleAddressOnKeyUp = (text) => {
    updateState({address: text});
  };
  return (
    <WrapperContainer
      statusBarColor={colors.backgroundGrey}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }>
      <Header
        leftIcon={
         imagePath.icBackb
        }
        centerTitle={strings.LOCATION}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.backgroundGrey}
        }
      />

      <View style={{height: 1, backgroundColor: colors.borderLight}} />
      <View>
        <GooglePlaceInput
          getDefaultValue={address}
          type={type}
          navigation={navigation}
          addressType={addressType}
          googleApiKey={profile?.preferences?.map_key}
          handleAddressOnKeyUp={(text) => handleAddressOnKeyUp(text)}
        />

        <View style={{zIndex: -1000}}>
          <TouchableOpacity
            style={{backgroundColor: 'transparent'}}
            onPress={() => getCurrentLocation()}>
            <View style={styles.useCurrentLocationView}>
              <Image
                style={{
                  tintColor: themeColors.primary_color,
                  height: moderateScale(16),
                  width: moderateScale(16),
                }}
                source={imagePath.icLocation1}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.detectLocation,
                  {color: themeColors.primary_color},
                ]}>
                {strings.USECURRENTLOACTION}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </WrapperContainer>
  );
}
