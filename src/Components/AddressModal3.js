import React, {useEffect, useRef, useState} from 'react';
import {
  I18nManager,
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Appearance
} from 'react-native';
//import {useDarkMode} from 'react-native-dark-mode';
import Geocoder from 'react-native-geocoding';

// import RNGooglePlaces from 'react-native-google-places';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MapView from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import commonStylesFun from '../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {getAddressComponent} from '../utils/helperFunctions';
import {chekLocationPermission} from '../utils/permissions';
import validations from '../utils/validations';
import BorderTextInput from './BorderTextInput';
import BorderTextInputWithLable from './BorderTextInputWithLable';
import GooglePlaceInput from './GooglePlaceInput';
import GradientButton from './GradientButton';

// navigator.geolocation = require('@react-native-community/geolocation');
navigator.geolocation = require('react-native-geolocation-service');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function AddressModal3({
  updateData,
  isVisible = false,
  onClose,
  type,
  passLocation,
  toggleModal,
  onPress,
  indicator,
  navigation,
}) {
  console.log("Components - AddressModal3.js")
  console.log(updateData?.type);
  const mapRef = useRef();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const theme = useSelector((state) => state?.initBoot?.themeColor);
  const colorScheme = Appearance.getColorScheme();
  let darkthemeusingDevice;
  if (colorScheme === 'dark') {
  // Use dark color scheme
  darkthemeusingDevice =true
  }else{
    darkthemeusingDevice =false
  }
  //const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const appData = useSelector((state) => state?.initBoot?.appData);
  const currentTheme = useSelector((state) => state.initBoot);
  const {themeColors, themeLayouts, appStyle} = currentTheme;
  const fontFamily = appStyle?.fontSizeData;
  const {profile} = appData;
  const [state, setState] = useState({
    dropDownData: [],
    address: updateData?.address ? updateData?.address : '',
    showDialogBox: false,
    isLoading: false,
    street: '',
    city: '',
    pincode: '',
    states: '',
    country: '',
    latitude: '',
    longitude: '',
    phonecode: '',
    is_primary: '',
    country_key: '',
    addressTypeArray: [
      {
        id: 1,
        lable: strings.HOME,
        icon: imagePath.home,
      },
      {id: 2, lable: 'Work', icon: imagePath.workInActive},
    ],
  //  address_type: 1,
    address_type: updateData?.type ? updateData?.type: 1,
    country_code: '',
    viewHeight: 0,
    region: {
      latitude: 30.7191,
      longitude: 76.8107,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
  });
  const [pickedItem, setPickedItem] = useState(false);

  const styles = stylesData({fontFamily, themeColors});

  //To update the states
  useEffect(() => {
    updateState({
      address: updateData?.address ? updateData?.address : '',
      showDialogBox: false,
      isLoading: false,
      street: updateData?.street ? updateData?.street : '',
      city: updateData?.city ? updateData?.city : '',
      pincode: updateData?.pincode ? updateData?.pincode : '',
      states: updateData?.state ? updateData?.state : '',
      country: updateData?.country ? updateData?.country : '',
      latitude: updateData?.latitude ? updateData?.latitude : '',
      longitude: updateData?.longitude ? updateData?.longitude : '',
      phonecode: updateData?.phonecode ? updateData?.phonecode : '',
      country_code: updateData?.country_code ? updateData?.country_code : '',
      is_primary: updateData?.is_primary ? updateData?.is_primary : '',
      address_type: updateData?.type ? updateData?.type: 1,
    });
  }, [updateData]);

  const {
    address,
    dropDownData,
    showDialogBox,
    street,
    city,
    pincode,
    states,
    country,
    latitude,
    longitude,
    addressTypeArray,
    address_type,
    phonecode,
    country_code,
    is_primary,
    viewHeight,
    region,
  } = state;
  const updateState = (data) => setState((state) => ({...state, ...data}));

  useEffect(() => {
    Geocoder.init(profile.preferences.map_key, {language: 'en'}); // set the language
  }, []);

  const _onChangeText = (key) => (val) => {
    if (key == 'address') {
      getPlacesPrediction(val);
    }
    
    updateState({[key]: val});
  };

  //Cleaer all state
  const clearState = () => {
    setTimeout(() => {
      setState({
        dropDownData: [],
        address: '',
        showDialogBox: false,
        isLoading: false,
        street: '',
        city: '',
        pincode: '',
        states: '',
        country: '',
        latitude: '',
        longitude: '',
        phonecode: '',
        country_code: '',
        is_primary: 1,
        addressTypeArray: [
          {
            id: 1,
            lable: 'Home',
            icon: imagePath.home,
          },
          {id: 2, lable: 'Work', icon: imagePath.workInActive},
        ],
        address_type: 1,
        
      });
    }, 1000);
  };

  /*************************** On Text Change
   */
  const getPlacesPrediction = (data) => {
    // console.log(data, 'data>>>>');
    // RNGooglePlaces.getAutocompletePredictions(data)
    //   .then((results) => {
    //     console.log(results,'This is my address')
    //     updateState({dropDownData: results});
    //   })
    //   .catch((error) => {});
  };

  const addressHelper = (results) => {
    setPickedItem(true)
    console.log(results, 'resultsresultsresults');
    let clonedArrayData = {...state};
    clonedArrayData = {...clonedArrayData, ...results, showDialogBox: false, street :  ''};
    updateState(clonedArrayData);
    
  };

  const handleAddressOnKeyUp = (text) => {

    console.log(text,'handleAddressOnKeyUp THIS IS MT TEXT')
    updateState({address: text});
    // if(pickedItem){
    //   updateState({address: ''});
    //   setPickedItem(false)
    // }
    // else{
    //   updateState({address: text});
    // }

  };

  /*************************** Place Id look Up
   */ const placeIdLookUp = (data) => {
    if (data?.placeID) {
      // RNGooglePlaces.lookUpPlaceByID(data.placeID)
      //   .then((results) =>
      //     addressHelper({...results, address: data.fullText || data.address}),
      //   )
      //   .catch((error) => {});
    } else {
    }
  };

  /*************************** On Text Change
   */ const placeSelectionHandler = (data) => {
    updateState({showDialogBox: false});
    placeIdLookUp(data);
    Keyboard.dismiss();
  };

  /*************************** On Text Change
   */ const renderDropDown = () => {
    if (dropDownData && dropDownData.length > 0 && showDialogBox) {
      return (
        <View>
          {dropDownData.map((x, i) => (
            <TouchableOpacity onPress={() => placeSelectionHandler(x)} key={i}>
              <Text style={styles.textInput}>{x.fullText}</Text>
              <View style={{paddingVertical: (height * 1.2) / 100}}></View>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      return null;
    }
  };

  //this function use for save user info
  const isValidDataOfAddressSave = () => {
    const error = validations({
      address: address ? address : '',
      street: street ? street : '',
      city: city ? city : '',
      states: states ? states : '',
      country: country ? country : '',
      // pincode: pincode ? pincode : '',
    });
     if (error) {
      alert(error); 
      return;
    }
    return true;
  };

  //Save your current address
  const saveAddress = async() => {
    const checkValid = isValidDataOfAddressSave();
    if (!checkValid) {
      return;
    }
    let data = {
      address: address,
      street: street,
      city: city,
      pincode: pincode,
      state: states,
      country: country,
      latitude: latitude,
      longitude: longitude,
      phonecode: phonecode,
      country_code: country_code,
      is_primary: type == 'addAddress' ? 1 : is_primary,
      address_type: address_type,
    };
    
    try{

      // let addresses_response = await  Geocoder.from(address);
      console.log("pickedItem", pickedItem);
      if(pickedItem){
        if (type == 'Home1') {
          navigation.navigate(navigationStrings.HOME, {
            details,
          });
        } 
        else if (type == 'addAddress') {
          onClose();
          clearState();

          passLocation(data);
          // clearState();
        } 
        else if (type == 'updateAddress') {
          let update = 'update';
          onClose();
          clearState();
          passLocation(data);
          // clearState();
        } 

        else {
          onClose();
          clearState();
          passLocation(data);
        }
      }
      else{
        console.log("pickedItem", pickedItem);
        alert(strings.ADDRESS_UNSELECTED_ERROR)
      }
    }
    catch(e){
      console.log("pickedItem", pickedItem);
      console.log("error--->", e);
      alert(strings.ADDRESS_UNSELECTED_ERROR)
      // console.log("error", e);
    }
    



  };
  const currentLocation = () => {
    chekLocationPermission()
      .then((result) => {
        if (result !== 'goback') {
          console.log("ADD CURRENT TIME LOCATION")
          getCurrentPosition();
        }
      })
      .catch((error) => console.log('error while accessing location ', error));
  };

  const getCurrentPosition = () => {
    return navigator.geolocation.default.getCurrentPosition(
      (position) => {
        // const location = JSON.stringify(position);
        Geocoder.from({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
          .then((json) => {
            console.log(json, 'json?>>>>>>>');
            let addressData = getAddressComponent(json?.results[0]);
            console.log(addressData, 'addressData?>>>>>>>');
            addressHelper(addressData);
          })
          .catch((error) => console.log(error, 'errro geocode'));
      },
      (error) => console.log(error.message),
      {enableHighAccuracy: true, timeout: 20000},
    );
  };

  //close your modal
  const closeModal = () => {
    clearState();
    onClose();
  };

  //Get Dyamic textinput style
  const getTextInputStyle = (input, type) => {
    return input != '' && input != undefined
      ? [
          styles.textInput,
          {color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey},
        ]
      : {fontSize: textScale(12)};
  };
console.log(address_type,'my address type');
  return (
    <Modal
      isVisible={isVisible}
      animationType={'none'}
      style={styles.modalContainer}
      onBackdropPress={onClose}
      onLayout={(event) => {
        updateState({viewHeight: event.nativeEvent.layout.height});
      }}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Image
          style={{tintColor: colors.white}}
          source={imagePath.crossB}
        />
      </TouchableOpacity>

      <View
        style={
          isDarkMode
            ? [
                styles.modalMainViewContainer,
                {
                  backgroundColor: MyDarkTheme.colors.lightDark,
                },
              ]
            : [
                styles.modalMainViewContainer,
                {paddingHorizontal: moderateScale(24)},
              ]
        }>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <View style={styles.addAddessView}>
            <Text
              numberOfLines={1}
              style={
                isDarkMode
                  ? [styles.addNewAddeessText, {color: MyDarkTheme.colors.text}]
                  : styles.addNewAddeessText
              }>
              {type === "updateAddress" ? strings.EDIT_ADDRESS : strings.ADD_ADDRESS1}
            </Text>
          </View>

          <Text
            style={{
              fontFamily: fontFamily.medium,
              fontSize: textScale(14),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyD,
              textAlign: 'left',
            }}>
            {strings.YOUR_LOCATION}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: moderateScale(7),
              marginHorizontal: moderateScale(7),
            }}>
            <TouchableOpacity onPress={currentLocation}>
              <Image source={imagePath.currentLocation} />
            </TouchableOpacity>
            <GooglePlaceInput
              onFocus={()=>{
                setPickedItem(false)
                updateState({address:""})
              }}
              getDefaultValue={address}
              type={type}
              navigation={navigation}
              googleApiKey={profile?.preferences?.map_key}
              textInputContainer={styles.textGoogleInputContainerAddress}
              listView={styles.listView}
              textInput={{
                height: moderateScaleVertical(35),
                borderRadius: 13,
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.lightDark
                  : colors.white,
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.textGreyOpcaity7,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
              }}
              addressHelper={(results) => addressHelper(results)}
              getResults={(_results)=>console.log("getResults", _results)}
              handleAddressOnKeyUp={(text) => handleAddressOnKeyUp(text)}
              placeholderTextColor={
                isDarkMode ? MyDarkTheme.colors.text : colors.textGreyOpcaity7
              }
            />
          </View>
          <View
            style={{
              marginBottom: 20,
              borderBottomWidth: 1,
              borderColor: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.borderLight,
            }}></View>

          {/* <View style={styles.textInputContainerAddress}>
            <TextInput
              onChangeText={_onChangeText('address')}
              placeholder={strings.SEARCH_LOCATION}
              style={[
                styles.addressTextStyle,
                {
                  textAlign: I18nManager.isRTL ? 'right' : 'left',
                  ...getTextInputStyle(address, 2),
                },
              ]}
              multiline={false}
              // style={getTextInputStyle(address, 2)}
              numberOfLines={2}
              value={address}
              onFocus={() => {
                updateState({showDialogBox: true});
              }}
            />
          </View> */}

          {/* {showDialogBox && dropDownData && dropDownData.length > 0 && (
          <View style={styles.addressDropDownView}>{renderDropDown()}</View>
        )} */}
          <View
            style={{
              zIndex: -1000,
              // marginTop: moderateScaleVertical(80)
            }}>
            {/* <View> */}
            {/* <View style={styles.useCurrentLocationView}>
            <Image
              style={{tintColor: themeColors.primary_color}}
              source={imagePath.locationGreen}
            />
            <TouchableOpacity>
              <Text style={styles.useCurrentLocationText}>
                {strings.USECURRENTLOACTION}
              </Text>
            </TouchableOpacity>
          </View> */}

            <BorderTextInputWithLable
              onChangeText={_onChangeText('street')}
              placeholder={strings.ENTER_STREET}
              label={strings.COMPLETE_ADDRESS}
              textInputStyle={getTextInputStyle(street)}
              value={street}
              multiline={false}
              borderWidth={0}
              marginBottomTxt={0}
              containerStyle={{borderBottomWidth: 1}}
              mainStyle={{marginTop: 10}}
              labelStyle={styles.labelStyle}
            />

            <BorderTextInputWithLable
              onChangeText={_onChangeText('city')}
              placeholder={strings.CITY}
              textInputStyle={getTextInputStyle(city)}
              value={city}
              borderWidth={0}
              marginBottomTxt={0}
              containerStyle={{borderBottomWidth: 1}}
            />

            <BorderTextInputWithLable
              onChangeText={_onChangeText('states')}
              placeholder={strings.STATE}
              textInputStyle={getTextInputStyle(states)}
              value={states}
              borderWidth={0}
              marginBottomTxt={0}
              containerStyle={{borderBottomWidth: 1}}
            />

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {/* <BorderTextInput
              containerStyle={{flex: 0.45}}
              onChangeText={_onChangeText('country')}
              placeholder={strings.COUNTRY}
              textInputStyle={getTextInputStyle(country)}
              value={country}
            /> */}
              <View
                style={{
                  flex: 0.48,
                  height: moderateScaleVertical(49),
                  borderBottomWidth: 1,
                  borderRadius: 13,
                  borderColor: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.borderLight,
                  marginBottom: 20,
                  justifyContent: 'center',
                  paddingHorizontal: 8,
                }}>
                <TextInput
                  selectionColor={
                    isDarkMode ? MyDarkTheme.colors.text : colors.black
                  }
                  placeholderTextColor={
                    isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7
                  }
                  onChangeText={_onChangeText('country')}
                  placeholder={strings.COUNTRY}
                  // textInputStyle={[getTextInputStyle(country)]}
                  value={country}
                  style={
                    isDarkMode
                      ? [styles.textInput3, {opacity: 0.7, color: '#fff'}]
                      : [
                          styles.textInput3,
                          {opacity: 0.7, color: colors.textGrey},
                        ]
                  }
                />
              </View>
              <BorderTextInput
                containerStyle={{
                  flex: 0.48,
                  color: colors.textGrey,
                  fontFamily: fontFamily.bold,
                  fontSize: textScale(12),
                  opacity: 1,
                  borderBottomWidth: 1,
                }}
                onChangeText={_onChangeText('pincode')}
                placeholder={strings.PINCODE}
                textInputStyle={getTextInputStyle(pincode)}
                value={pincode}
                keyboardType={'numeric'}
                borderWidth={0}
                borderRadius={0}
              />
            </View>
            <Text
              style={{
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
                fontFamily: fontFamily.medium,
                fontSize: textScale(14),
              }}>
              {strings.SAVE_AS}
            </Text>

            <View style={styles.addressTypeView}>
              {addressTypeArray.map((item, index) => {
                return (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => updateState({address_type: item.id})}
                      style={[
                        styles.addressHomeOrOfficeView,
                        {
                          backgroundColor: isDarkMode
                            ? MyDarkTheme.colors.background
                            : colors.white,
                        },
                      ]}>
                      {/* <Image
                    source={item.icon}
                    style={{
                      tintColor:
                        address_type == item.id
                          ? themeColors.primary_color
                          : colors.textGreyG,
                    }}
                  /> */}

                      <Text
                        style={[
                          {
                            color: isDarkMode
                              ? themeColors.primary_color
                              : colors.textGreyB,
                            fontFamily: fontFamily.bold,
                          },
                        ]}>
                        {item.lable}
                      </Text>
                      {address_type == item.id && (
                        <Image
                          source={imagePath.icRedChecked}
                          style={{position: 'absolute', right: -8, top: -8}}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>

          <GradientButton
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={styles.textStyle}
            onPress={saveAddress}
            marginTop={moderateScaleVertical(10)}
            // marginBottom={moderateScaleVertical(10)}
            btnText={strings.SAVE_ADDRESS}
            indicator={indicator}
            containerStyle={{marginTop: moderateScale(20)}}
          />
        </KeyboardAwareScrollView>
      </View>

      {/* </View> */}
      {/* </ScrollView> */}
    </Modal>
    //   </View>
    // </View>
  );
}

export function stylesData({fontFamily, themeColors}) {
  const commonStyles = commonStylesFun({fontFamily});

  const styles = StyleSheet.create({
    addressTypeView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(3),
      //backgroundColor: 'red',
    },
    closeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: moderateScaleVertical(10),
    },
    useCurrentLocationText: {
      marginHorizontal: 5,
      ...commonStyles.mediumFont12,
      color: themeColors.primary_color,
    },
    addNewAddeessText: {
      ...commonStyles.mediumTxtGreyD14,
    },
    useCurrentLocationView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: moderateScaleVertical(15),
    },
    addressDropDownView: {
      backgroundColor: 'white',
      zIndex: 99999999,
      width: '100%',
      position: 'absolute',
      top: moderateScaleVertical(120),

      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: colors.borderLight,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(10),
    },
    addAddessView: {
      justifyContent: 'space-between',
      marginBottom: moderateScaleVertical(24),
      marginTop: moderateScaleVertical(40),
      alignItems: 'center',
    },
    closeModalView: {
      alignSelf: 'center',
      height: 6,
      width: 50,
      backgroundColor: colors.backgroundGreyB,
      borderRadius: 20,
      marginTop: 10,
    },
    modalContainer: {
      marginHorizontal: 0,
      marginBottom: 0,
      marginTop: moderateScaleVertical(height / 10),
      overflow: 'hidden',
      // zIndex: -1000,
    },
    modalMainViewContainer: {
      flex: 1,
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      // overflow: 'hidden',
      paddingHorizontal: 20,
    },
    textInputContainer: {
      flexDirection: 'row',
      height: moderateScaleVertical(49),
      borderWidth: 1,
      // borderRadius: 13,
      // paddingVertical:moderateScaleVertical(5),

      borderColor: colors.borderLight,
    },
    textInputContainerAddress: {
      // flexDirection: 'row',
      // flexWrap:'wrap',
      // overflow:'hidden',
      height: moderateScaleVertical(49),
      borderWidth: 1,
      borderRadius: 13,
      borderColor: colors.borderLight,
      marginBottom: 20,
      justifyContent: 'center',
    },
    textGoogleInputContainerAddress: {
      // flexDirection: 'row',
      // flexWrap:'wrap',
      // overflow:'hidden',
      height: moderateScaleVertical(35),
      width: width - moderateScale(65),

      justifyContent: 'center',
      marginHorizontal: moderateScale(0),
      marginVertical: moderateScaleVertical(0),
      alignItems: 'center',
    },

    // textGoogleInputContainerAddress: {
    //   // flexDirection: 'row',
    //   // flexWrap:'wrap',
    //   // overflow:'hidden',
    //   height: moderateScaleVertical(49),
    //   borderWidth: 1,
    //   borderRadius: 13,
    //   borderColor: colors.borderLight,
    //   marginBottom: 20,
    //   justifyContent: 'center',
    //   marginHorizontal: moderateScale(0),
    //   marginVertical: moderateScaleVertical(0),
    //   alignItems: 'center',
    //   // backgroundColor:'red'
    // },

    listView: {
      borderWidth: moderateScale(1),
      borderColor: colors.borderLight,
      alignSelf: 'flex-start',
      marginLeft: -moderateScale(15),
    },

    textInput: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(12),

      opacity: 1,
      minWidth: width / 2,
      maxWidth: width * 2,

      // color: colors.textGreyOpcaity7,
    },

    textInput3: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(12),
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    textInput2: {
      height: moderateScaleVertical(35),
      borderRadius: 13,
    },
    addressHomeOrOfficeView: {
      flexDirection: 'row',
      marginRight: moderateScale(25),
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      backgroundColor: colors.white,
      shadowOpacity: 0.2,
      justifyContent: 'center',
      shadowOffset: {width: 0, height: 0.1},
    },
    addressTextStyle: {
      // flex: 1,
      // height:49,
      opacity: 0.7,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      paddingHorizontal: 10,
      paddingTop: 0,
      paddingBottom: 0,
    },
    bottomAddToCartView: {
      marginHorizontal: moderateScale(20),
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      height: height,
    },
    yourLocationTxt: {
      ...commonStyles.mediumTxtGreyD14,
    },
    labelStyle: {
      ...commonStyles.mediumTxtGreyD14,
    },
  });
  return styles;
}
