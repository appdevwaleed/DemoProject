import {useFocusEffect} from '@react-navigation/native';
import {wrap} from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Keyboard,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import {abs} from 'react-native-reanimated';
import {useSelector} from 'react-redux';
import GooglePlaceInput from '../../../Components/GooglePlaceInput';
import GradientButton from '../../../Components/GradientButton';
import Header from '../../../Components/Header';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang/index';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {
  getAddressComponent,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import {chekLocationPermission} from '../../../utils/permissions';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import AddressModal3 from '../../../Components/AddressModal3';

export default function Addaddress({navigation, route}) {
  console.log("TaxiApp - Addaddress.js")
  const paramData = route?.params;
  console.log("THIS IS MY paramData",paramData);

  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const userData = useSelector((state) => state?.auth?.userData);
  const {appData, allAddresss, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const [state, setState] = useState({
    pickUpLocation: '',
    pickUpLocationLatLng: null,
    pickUpLocationAddressData: null,
    dropOffLocation: '',
    dropOffLocationLatLng: null,
    dropOffLocationAddressData: null,
    dropOffLocationTwo: '',
    dropOffLocationTwoLatLng: null,
    dropOffLocationTwoAddressData: null,
    dropOffLocationThree: '',
    dropOffLocationThreeLatLng: null,
    dropOffLocationThreeAddressData: null,
    pickUpLocationFocus: true,
    dropOffLocationFocus: false,
    dropOffLocationTwoFocus: false,
    dropOffLocationThreeFocus: false,
    dot: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    suggestions: [],
    viewHeight: null,
    showDropOfTwo: false,
    showDropOfThree: false,
    pageNo: 1,
    limit: 5,
    pickUpVendors: [],
    allSavedAddress: [],
    selectedAddress: null,
    savedAddressViewHeight: 0,
    avalibleValueInTextInput: false,
    vendorId: null,
    isVisible: false,
    updateData: {},
    indicator: false,
    type: 'addAddress',
    del: false,
  });
  const {
    pickUpLocationAddressData,
    dropOffLocationAddressData,
    dropOffLocationTwoAddressData,
    dropOffLocationThreeAddressData,
    viewHeight,
    pickUpLocation,
    pickUpLocationLatLng,
    dropOffLocation,
    dropOffLocationTwo,
    dropOffLocationThree,
    pickUpLocationFocus,
    dropOffLocationFocus,
    dropOffLocationTwoFocus,
    dropOffLocationThreeFocus,
    dropOffLocationLatLng,
    dropOffLocationTwoLatLng,
    dropOffLocationThreeLatLng,
    dot,
    showDropOfTwo,
    showDropOfThree,
    suggestions,
    pageNo,
    limit,
    pickUpVendors,
    allSavedAddress,
    selectedAddress,
    savedAddressViewHeight,
    avalibleValueInTextInput,
    isVisible,
    updateData,
    indicator,
    type,
    del,
  } = state;

  useEffect(() => {
   console.log( paramData?.data?.pickuplocationAllData,'THISISMYPARAMDATA')
    if (
      paramData?.data?.pickuplocationAllData != undefined &&
      paramData?.data?.pickuplocationAllData[0]?.task_type_id === 1
    ) {
      updateState({
        pickUpLocation: paramData?.data.pickuplocationAllData[0]?.address,
        pickUpLocationLatLng: {
          latitude: paramData?.data.pickuplocationAllData[0]?.latitude,
          longitude: paramData?.data.pickuplocationAllData[0]?.longitude,
        },

        pickUpLocationAddressData: paramData?.data.pickuplocationAllData[0],
      });
    }
    if (
      paramData?.data?.pickuplocationAllData != undefined &&
      paramData?.data?.pickuplocationAllData[0]?.task_type_id === 2
    ) {
      updateState({
        dropOffLocation: paramData?.data.pickuplocationAllData[0]?.address,

        dropOffLocationLatLng: {
          latitude: paramData?.data.pickuplocationAllData[0]?.latitude,
          longitude: paramData?.data.pickuplocationAllData[0]?.longitude,
        },
        dropOffLocationAddressData: paramData?.data.pickuplocationAllData[0],
      });
    }

    if (!!(userData && userData?.auth_token)) {
      getAllAddress();
    }
  }, [paramData]);

  //get All address
  const getAllAddress = () => {
    actions
      .getAddress(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
    
        // actions.saveAllUserAddress(res.data);
        updateState({
          allSavedAddress: res.data,
          isLoading: false,
          indicator: false,
        });
      })
      .catch((error) => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };

  useEffect(() => {
    chekLocationPermission()
      .then((result) => {
        if (result === 'goback') {
          navigation.goBack();
        }
        Geocoder.init(profile?.preferences?.map_key, {language: 'en'}); // set the language
      })
      .catch((error) => console.log('error while accessing location', error));
  }, []);

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({
    fontFamily,
    themeColors,
    savedAddressViewHeight,
    avalibleValueInTextInput,
  });
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;

  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  useFocusEffect(
    React.useCallback(() => {
      getAllPickUpVendors();
    }, [pageNo]),
  );

  const getAllPickUpVendors = () => {
    actions
      .getDataByCategoryId(
        `/${
          paramData?.data?.id ? paramData?.data?.id : paramData?.cat?.id
        }?limit=${limit}&page=${pageNo}`,
        {},
        {code: appData?.profile?.code},
      )
      .then((res) => {
   
        updateState({
          isLoading: false,
          isRefreshing: false,
          pickUpVendors:
            pageNo == 1
              ? res.data.listData.data
              : [...pickUpVendors, ...res.data.listData.data],
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({isLoading: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  const _onFocus = (type) => {
    updateState({[type]: true});
  };
  /*************************** On Text Change
   */ const addressHelper = (results) => {
    let clonedArrayData = {...state};
    clonedArrayData = {...clonedArrayData, ...results, showDialogBox: false};
    updateState(clonedArrayData);
  };

  const handleAddressOnKeyUp = (text, type) => {
    console.log('IAMPRESSED')
    if (text == '') {
      updateState({[type]: '', avalibleValueInTextInput: false});
    } else {
      updateState({[type]: text, avalibleValueInTextInput: true});
    }
  };

  const setModalVisible = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({
        updateData: data,
        isVisible: visible,
        type: 'addAddress',
        selectedId: id,
      });
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  const addUpdateLocation = (childData) => {
    //setModalVisible(false);

    updateState({isLoading: true});

    actions
      .addAddress(childData, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        updateState({del: del ? false : true});
        showSuccess(res.message);
      })
      .catch((error) => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };

  const _setModalVisiblity = () => {
    updateState({
      isVisible: true,
    });
  };

  const _rendorCustomRow = (itm) => {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 0.1,
            marginRight: 10,
            justifyContent: 'space-around',
          }}>
          <Image source={imagePath.locationRoundedBackground} />
        </View>
        <View
          style={{
            flex: 0.15,
          }}>
          <Text style={styles.address}>{itm.description}</Text>
        </View>
      </View>
    );
  };

  console.log(profile?.preferences?.map_key,'MY MAP KEY')

  const updateTheAddress = (details, addressType, type, addOnData) => {
  //  const address = details?.formatted_address || details?.address;
    const address = addOnData?.description || details?.formatted_address 
    let latlng = {
      latitude: details?.geometry?.location?.lat
        ? JSON.stringify(details?.geometry?.location?.lat)
        : details?.latitude,
      longitude: details?.geometry?.location?.lng
        ? JSON.stringify(details?.geometry?.location?.lng)
        : details?.longitude,
    };
    console.log(details,'TESTEST')
    console.log(getAddressComponent(details),'TESTTESTING')
    let addressData = details?.user_id ? details : getAddressComponent(details);

    let updatedAddress = {
      task_type_id: addressType == 'pickup' ? 1 : 2,
      post_code: addressData?.pincode,
      short_name: addressData?.states || addressData?.state,
      address: addressData?.address,
      latitude: details?.user_id
        ? addressData?.latitude
        : JSON.stringify(addressData?.latitude),
      longitude: details?.user_id
        ? addressData?.longitude
        : JSON.stringify(addressData?.longitude),
    };

    if (addressType == 'pickup') {
      updateState({
        pickUpLocation: address,
        pickUpLocationAddressData: updatedAddress,
        pickUpLocationLatLng: latlng,
        pickUpLocationFocus: false,
      });
      Keyboard.dismiss();
    }
    if (addressType == 'dropoff') {
      if (type == 'dropOffLocation') {
        updateState({
          dropOffLocation: address,
          dropOffLocationAddressData: updatedAddress,
          dropOffLocationLatLng: latlng,
          dropOffLocationFocus: false,
        });
        Keyboard.dismiss();
      }
      if (type == 'dropOffLocationTwo') {
        updateState({
          dropOffLocationTwo: address,
          dropOffLocationTwoAddressData: updatedAddress,
          dropOffLocationTwoLatLng: latlng,
          dropOffLocationTwoFocus: false,
          // showDropOfThree: true,
        });
        Keyboard.dismiss();
      }
      if (type == 'dropOffLocationThree') {
        updateState({
          dropOffLocationThree: address,
          dropOffLocationThreeAddressData: updatedAddress,
          dropOffLocationThreeLatLng: latlng,
          dropOffLocationThreeFocus: false,
        });
        Keyboard.dismiss();
      }
    }
  };

  useEffect(() => {
    updateTheAddress(
      paramData?.details,
      paramData?.addressType,
      paramData?.type,
    );
  }, [paramData?.type]);

  const _moveToNextScreen = (type) => {
    console.log("IAMGOINGTOPIN",type,pickUpLocationLatLng,dropOffLocationLatLng)
    navigation.navigate(navigationStrings.PINADDRESSONMAP, {data: type, pickUpLocationLatLng : pickUpLocationLatLng,dropOffLocationLatLng : dropOffLocationLatLng,locationType : type});
  };

  const renderDotContainer = () => {
    return (
      <>
        <View style={{height: 40, overflow: 'hidden', alignItems: 'center'}}>
          <View
            style={{
              height: 40,
              width: 0.5,
              backgroundColor: colors.textGreyLight,
            }}
          />
        </View>

        <Image
          style={{
            tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}
          source={imagePath.blackSquare}
        />
      </>
    );
  };
  const getHeight = () => {
    if (showDropOfTwo && showDropOfThree) {
      return 160;
    } else if (showDropOfTwo || showDropOfThree) {
      return 110;
    } else {
      return 60;
    }
  };

  const addRemoveAddress = (type) => {
    Keyboard.dismiss();
    if (type == 'dropOffLocation') {
      updateState({
        // dropOffLocation: '',
        // dropOffLocationLatLng: false,
        // dropOffLocationFocus: false,
        showDropOfTwo: true,
        savedAddressViewHeight: savedAddressViewHeight + 1,
      });
    }
    if (type == 'dropOffLocationTwo') {
      updateState({
        dropOffLocationTwo: '',
        dropOffLocationTwoLatLng: false,
        dropOffLocationTwoFocus: false,
        showDropOfTwo: false,
        savedAddressViewHeight: savedAddressViewHeight - 1,
      });
    }
    if (type == 'dropOffLocationThree') {
      updateState({
        dropOffLocationThree: '',
        dropOffLocationThreeLatLng: false,
        dropOffLocationThreeFocus: false,
        savedAddressViewHeight: savedAddressViewHeight - 1,
      });
    }
  };

  const renderCross = (type) => {
    return (
      <>
        <View
          style={{
            height: moderateScale(5),
            marginTop: moderateScaleVertical(10),
          }}
        />
        <TouchableOpacity
          //  onPress={() => addRemoveAddress(type)}
          onPress={() => _moveToNextScreen('drop')}
          style={{
            height: moderateScale(48),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              height: 25,
              width: 25,
            }}
            source={imagePath.blackNav}
          />
        </TouchableOpacity>
      </>
    );
  };

  const saveAddressAndRedirect = () => {
    if (pickUpLocationLatLng?.latitude == undefined) {
      showError(strings.PLEASE_SELECT_PICKUP_LOCATION);
    } else if (dropOffLocationLatLng?.latitude == undefined) {
      showError(strings.PLEASE_SELECT_DROP_OFF_LOCATION);
    } else {
      let location = [];
      let addressData = [];
      location.push(pickUpLocationLatLng);

      addressData.push(pickUpLocationAddressData);
      if (dropOffLocationLatLng) {
        location.push(dropOffLocationLatLng);
        addressData.push(dropOffLocationAddressData);
      }
      // if (dropOffLocationTwoLatLng) {
      //   location.push(dropOffLocationTwoLatLng);
      //   addressData.push(dropOffLocationTwoAddressData);
      // }
     console.log(addressData, 'addressData')
     console.log("paramData",  paramData)

      navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
        location: location,
        id: paramData?.data?.id,
        pickup_taxi: paramData?.data?.pickup_taxi,
        tasks: addressData,
        cabVendors: pickUpVendors,
        datetime: paramData?.datetime,
        pickUpTimeType: paramData?.pickUpTimeType,
      });
    }
  };

  const _redirectToMapScreen = (type, addressType) => {
    navigation.navigate(navigationStrings.SETLOACTIONMAP, {
      type: type,
      addressType: addressType,
    });
  };

  //All Saved address

  const selectAddress = (address) => {
    console.log(address, 'THIS IS MY SAVED ADDRESS DATA')
    let addOnData = {description :address?.address }
    if (pickUpLocationFocus) {
      updateTheAddress(address, 'pickup', 'pickUpLocation',addOnData);
    }
    if (dropOffLocationFocus) {
      updateTheAddress(address, 'dropoff', 'dropOffLocation',addOnData);
    }
    if (dropOffLocationTwoFocus) {
      updateTheAddress(address, 'dropoff', 'dropOffLocationTwo',addOnData);
    }
  };

  //address view tab
  const addressView = (image) => {
    return (
      allSavedAddress &&
      allSavedAddress.map((itm, inx) => {
        return (
          <ScrollView
            keyboardShouldPersistTaps={'handled'}
            style={{width: width - 40}}>
            <TouchableOpacity
              key={inx}
              style={{
                marginTop: moderateScaleVertical(10),
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                marginHorizontal: moderateScale(10),
              }}
              onPress={() => selectAddress(itm)}>
              <View>
                <Image source={image} />
              </View>
              <View style={{marginHorizontal: moderateScale(10)}}>
                <Text numberOfLines={2} style={[styles.address]}>
                  {itm?.address}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        );
      })
    );
  };
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}>
      <View style={{flex: 1}}>
        <Header
          rightViewStyle={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.greyColor,
            alignItems: 'center',
            paddingVertical: moderateScaleVertical(8),
            borderRadius: 14,
            flex: 0.15,
          }}
          leftIcon={imagePath.backArrowCourier}
          centerTitle={strings.ADD_ADDRESS}
          // rightIcon={imagePath.cartShop}
          headerStyle={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
            marginVertical: moderateScaleVertical(10),
            rightViewStyle: {backgroundColor: colors.greyColor},
          }}
        />

        <View style={{flex: 1}}>
          <View
            onLayout={(event) => {
              updateState({viewHeight: event.nativeEvent.layout.height});
            }}
            style={{
              flex: 1,
              flexDirection: 'row',
            }}>
            <View
              style={{
                flex: 0.15,
                alignItems: 'center',
                marginVertical: moderateScaleVertical(30),
              }}>
              <View
                style={{
                  flex: 0.3,
                  zIndex: -1000,
                  // height: getHeight(),
                  marginTop: moderateScaleVertical(8),
                  alignItems: 'center',
                }}>
                <Image source={imagePath.grayDot} />
                {renderDotContainer()}
                {showDropOfTwo ? renderDotContainer() : null}
              </View>
            </View>
            <View
              style={{
                flex: 0.7,
                zIndex: -1000,
                paddingVertical: 10,
              }}>
              <View
                style={{
                  height: 48,
                  alignItems: 'center',
                }}>
                <GooglePlaceInput
                  selectionColor={themeColors.primary_color}
                  placeholder={strings.PICKUP_LOCATION}
                  autoFocus={pickUpLocationFocus}
                  getDefaultValue={pickUpLocation}
                  type={'Pickup'}
                  navigation={navigation}
                  addressType={'pickup'}
                  googleApiKey={profile?.preferences?.map_key}
                  placeholderTextColor={
                    isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7
                  }
                  textInputContainer={styles.textGoogleInputContainerAddress}
                  listView={
                    stylesFun({
                      fontFamily,
                      themeColors,
                      viewHeight: viewHeight,
                      type: 'pickup',
                    }).listView
                  }
                  onFocus={() => updateState({pickUpLocationFocus: true})}
                  textInput={
                    isDarkMode
                      ? {
                          height: moderateScaleVertical(30),
                          borderRadius: 13,
                          color: colors.white,
                          backgroundColor: MyDarkTheme.colors.background,
                        }
                      : {
                          height: moderateScaleVertical(30),
                          borderRadius: 13,

                          backgroundColor: colors.white,
                        }
                  }
                  addressHelper={(results) => addressHelper(results)}
                  handleAddressOnKeyUp={(text) =>
                    handleAddressOnKeyUp(text, 'pickUpLocation')
                  }
                  onBlur={() => {
                    if (pickUpLocation == '') {
                      updateState({
                        pickUpLocation: '',
                        pickUpLocationLatLng: false,
                        pickUpLocationFocus: false,
                      });
                    } else {
                      updateState({
                        pickUpLocationFocus: false,
                      });
                    }
                  }}
                  showList={true}
                  showListOutside={(results, dataSource) =>
                    showListOutside(results, 'pickUpLocation', dataSource)
                  }
                  rowStyle={styles.address}
                  renderCustomRow={(itm) => _rendorCustomRow(itm)}
                  updateTheAddress={(details, addressType,addOnData) =>
                    updateTheAddress(details, addressType, 'pickUpLocation',addOnData)
                  }
                  // ListHeaderComponent={() =>
                  //   _renderBottomComponent('pickUpLocation', 'pickup')
                  // }
                />
                <View
                  style={{
                    backgroundColor: colors.textGreyLight,
                    height: 0.5,
                    width: width - 100,
                    marginLeft: moderateScale(40),
                  }}
                />
              </View>

              <View style={{height: 5}}></View>
              <View
                style={{
                  height: 48,
                  alignItems: 'center',
                }}>
                <GooglePlaceInput
                  selectionColor={themeColors.primary_color}
                  autoFocus={dropOffLocationFocus}
                  getDefaultValue={dropOffLocation}
                  type={'Pickup'}
                  navigation={navigation}
                  addressType={'dropoff'}
                  placeholderTextColor={
                    isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7
                  }
                  placeholder={strings.DROPOFFLOCATION}
                  googleApiKey={profile?.preferences?.map_key}
                  textInputContainer={styles.textGoogleInputContainerAddress}
                  listView={styles.listView}
                  listView={
                    stylesFun({
                      fontFamily,
                      themeColors,
                      viewHeight: viewHeight,
                      type: 'dropOffLocation',
                    }).listView
                  }
                  onFocus={() => updateState({dropOffLocationFocus: true})}
                  onBlur={() => {
                    if (dropOffLocation == '') {
                      updateState({
                        dropOffLocation: '',
                        dropOffLocationLatLng: false,
                        dropOffLocationFocus: false,
                      });
                    }
                  }}
                  textInput={
                    isDarkMode
                      ? {
                          height: moderateScaleVertical(30),
                          borderRadius: 13,
                          color: MyDarkTheme.colors.text,
                          backgroundColor: MyDarkTheme.colors.background,
                        }
                      : {
                          height: moderateScaleVertical(30),
                          borderRadius: 13,
                          backgroundColor: colors.white,
                        }
                  }
                  addressHelper={(results) => addressHelper(results)}
                  handleAddressOnKeyUp={(text) =>
                    handleAddressOnKeyUp(text, 'dropOffLocation')
                  }
                  showList={true}
                  showListOutside={(results, dataSource) =>
                    showListOutside(results, 'dropOffLocation', dataSource)
                  }
                  rowStyle={styles.address}
                  renderCustomRow={(itm) => _rendorCustomRow(itm)}
                  updateTheAddress={(details, addressType,addOnData) =>
                    updateTheAddress(details, addressType, 'dropOffLocation',addOnData)
                  }
                  // ListHeaderComponent={() =>
                  //   _renderBottomComponent('dropOffLocation', 'dropoff')
                  // }
                />
                <View
                  style={{
                    backgroundColor: colors.textGreyLight,
                    height: 0.5,
                    width: width - 100,
                    marginLeft: moderateScale(40),
                    marginTop: moderateScaleVertical(5),
                  }}
                />
              </View>
            </View>
            <View style={{flex: 0.1, zIndex: -1000, paddingVertical: 10}}>
              <View style={{height: moderateScale(48)}} />
              {renderCross('dropOffLocation')}
              {showDropOfTwo ? renderCross('dropOffLocationTwo') : null}
              {/* {showDropOfThree ? renderCross('dropOffLocationThree') : null} */}
            </View>
            <View style={{position: 'absolute', end: 28, top: 27}}>
              <TouchableOpacity onPress={() => _moveToNextScreen('pickup')}>
                <Image
                  style={{
                    height: 25,
                    width: 25,
                  }}
                  source={imagePath.blackNav}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* <View style={{flex: 0.7, zIndex: -1000}}> */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            horizontal={false}
            scrollEnabled={false}
            keyboardShouldPersistTaps={'handled'}
            style={[styles.modalMainViewContainer]}>
            {!!(allSavedAddress && allSavedAddress.length) ? (
              <>
                <View style={styles.savedAddressView}>
                  <Image
                    style={{marginHorizontal: moderateScale(12)}}
                    source={imagePath.starRoundedBackground}
                  />
                  <Text
                    numberOfLines={1}
                    style={
                      isDarkMode
                        ? [
                            styles.addresssLableName,
                            {color: MyDarkTheme.colors.text},
                          ]
                        : styles.addresssLableName
                    }>
                    {strings.SAVED_LOCATIONS}
                  </Text>
                </View>

                {addressView(imagePath.RecentLocationImage)}
              </>
            ) : (
              <View style={styles.savedAddressView}>
                <Text
                  numberOfLines={1}
                  style={
                    isDarkMode
                      ? [
                          styles.addresssLableName,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.addresssLableName
                  }>
                  {/* {strings.SAVED_ADDRESS} */}
                </Text>
              </View>
            )}
          </ScrollView>
          {/* </View> */}
        </View>

        <View
          style={{
            marginVertical: moderateScaleVertical(10),
            marginHorizontal: moderateScale(20),
            justifyContent: 'flex-end',
          }}>
          <GradientButton
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={{textTransform: 'none', fontSize: textScale(16)}}
            onPress={saveAddressAndRedirect}
            marginTop={moderateScaleVertical(10)}
            marginBottom={moderateScaleVertical(10)}
            btnText={strings.DONE}
          />
        </View>
      </View>
      <AddressModal3
        navigation={navigation}
        updateData={updateData}
        isVisible={isVisible}
        indicator={indicator}
        onClose={() => setModalVisible(false)}
        type={type}
        passLocation={(data) => addUpdateLocation(data)}
        // onPress={currentLocation}
      />
    </WrapperContainer>
  );
}
