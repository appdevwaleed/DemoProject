import { useFocusEffect } from '@react-navigation/native';
import { cloneDeep } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
  BackHandler
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import AddressModal from '../../Components/AddressModal';
import BorderTextInput from '../../Components/BorderTextInput';
import CustomTopTabBar from '../../Components/CustomTopTabBar';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import TransparentButtonWithTxtAndIcon from '../../Components/TransparentButtonWithTxtAndIcon';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { cameraHandler } from '../../utils/commonFunction';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFunc from './styles';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../../styles/theme';
import { androidCameraPermission } from '../../utils/permissions';
import AutoUpLabelTxtInput from '../../Components/AutoUpLabelTxtInput';
import PhoneNumberInput2 from '../../Components/PhoneNumberInput2';
import PhoneNumberInputWithUnderline from '../../Components/PhoneNumberInputWithUnderline';
import BorderTextInputWithLable from '../../Components/BorderTextInputWithLable';
import TextInputWithUnderlineAndLabel from '../../Components/TextInputWithUnderlineAndLabel';
import { string } from 'is_js';
import AddressModal3 from '../../Components/AddressModal3';
import OtpModal from '../../Components/OtpModal';
import  {saveUserData} from "../../redux/actions/auth"

export default function MyProfile3({ route, navigation }) {
  console.log("MyProfile - MyProfile3.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const currentTheme = useSelector((state) => state?.initBoot);

  const { themeColors, themeLayouts, appStyle } = currentTheme;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });
  const commonStyles = commonStylesFunc({ fontFamily });
  const paramData = route?.params;

  const appData = useSelector((state) => state?.initBoot?.appData);
  const userData = useSelector((state) => state?.auth?.userData);
  const [phoneverified, setPhoneVerified] = React.useState(false);
  const [emailvarified, setEmailVerified] = React.useState(false);
  const [otpModal, showOtpModal] = useState(false);
  const [verificationType, setVerificationType] = useState("");
  const [timer2, setTimer2] = useState(0);


  

  const tabBarDataBase = [
    { title: strings.BASIC_INFO, isActive: true },
    { title: strings.CHANGE_PASS, isActive: false },
    { title: strings.ADDRESS, isActive: false },
  ]
  const socialLogin = userData?.social_login;
  const tabBarDataFiltered = socialLogin ? tabBarDataBase.filter(item => item.title !== strings.CHANGE_PASS) : tabBarDataBase
 // console.log(userData, 'MY PARAM');
  const [state, setState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    tabBarData: tabBarDataFiltered,
    // tabBarData: [
    //   {title: strings.BASIC_INFO, isActive: true},
    //   {title: strings.CHANGE_PASS, isActive: false},
    //   {title: strings.ADDRESS, isActive: false},
    // ],
    selectedTab: strings.BASIC_INFO,
    callingCode: userData?.dial_code
      ? userData?.dial_code
      : appData?.profile?.country?.phonecode
        ? appData?.profile?.country?.phonecode
        : '91',
    cca2: userData?.cca2
      ? userData?.cca2
      : appData?.profile?.country?.code
        ? appData?.profile?.country?.code
        : 'IN',
    name: userData?.name,
    email: userData?.email,
    password: '',
    phoneNumber: userData?.phone_number ? userData?.phone_number : '',
    currentpassword: '',
    newPassword: '',
    confirmPassword: '',
    isLoading: false,
    locationData: [],
    profileImage: {
      uri: 'https://www.hayalanka.com/wp-content/uploads/2017/07/avtar-image.jpg',
    },
    address: [],
    isVisible: false,
    newAddress: null,
    updatedAddress: null,
    type: '',
    selectedId: '',
    del: false,
    updateData: {},
    indicator: false,
  });
  const {
    address,
    tabBarData,
    selectedTab,
    confirmPassword,
    phoneNumber,
    callingCode,
    cca2,
    name,
    email,
    password,
    currentpassword,
    newPassword,
    profileImage,
    isLoading,
    locationData,
    isVisible,
    newAddress,
    updatedAddress,
    type,
    selectedId,
    del,
    updateData,
    indicator,
  } = state;
 // console.log(socialLogin, userData?.social_login, "MY SOCAIL LOGIN");
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const profileAddress = useSelector((state) => state?.home?.profileAddress);
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true
    );
    return () => backHandler.remove();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getAllAddress();
      if(userData?.phone_number!==""){
        setPhoneVerified(true)
      }
      if(userData?.email!==""){
        setEmailVerified(true)
      }
    }, []),
  );

  useEffect(()=>{
    if(userData?.phone_number!==""&&userData?.phone_number !==phoneNumber){
      setPhoneVerified(false)
    }
    else{
      setPhoneVerified(true)
    }
}, [phoneNumber, callingCode])

useEffect(()=>{
  if(userData?.email!==""&&userData?.email !==email){
    setEmailVerified(false)
  }
  else{
    setEmailVerified(true)
  }
}, [email]);

  // changeTab function
  const changeTab = (tabData) => {
    let clonedArray = cloneDeep(tabBarData);
    clonedArray.map((item) => {
      if (item.title == tabData.title) {
        item.isActive = true;
        return item;
      } else {
        item.isActive = false;
        return item;
      }
    });

    updateState({
      ['tabBarData']: clonedArray,
      ['selectedTab']: tabData.title,
    });
  };

  //select tje country
  const _onCountryChange = (data) => {
    updateState({ cca2: data.cca2, callingCode: data.callingCode[0] });
    return;
  };

  // on change text
  const _onChangeText = (key) => (val) => {
    updateState({ [key]: val });
  };

  //this function use for save user info
  const isValidDataOfBasicInfo = () => {
    const error = validations({
      email: email,
      name: name,
      phoneNumber: phoneNumber,
      callingCode: callingCode,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };
  const saveUserInfo = () => {
    if (!!userData?.auth_token) {
      const checkValid = isValidDataOfBasicInfo();
      if (!checkValid) {
        return;
      }
      let data = {
        name: name,
        email: email,
        // phone_number: '+' + callingCode + phoneNumber,
        phone_number: phoneNumber,
        country_code: cca2,
        callingCode: callingCode,
      };
      updateState({ isLoading: true });
      actions
        .profileBasicInfo(data, {
          code: appData?.profile?.code,
        })
        .then((res) => {
          console.log("dial_code", res)
          //here we need 4 conditions either user is verified , or user phone is unvarified, or email is unvarified or both are un varified 
          // incase both are un varified then we need phone opt first 
          let obj = {};
          obj['name'] = res.data.name;
          obj['email'] = res.data.email;
          obj['phone_number'] = res.data.phone_number;
          obj['cca2'] = res.data.cca2;
          obj['dial_code'] = res.data.callingCode || callingCode;

          actions.updateProfile({ ...userData, ...obj , verify_details:{...userData?.verify_details, is_email_verified:res?.data?.is_email_verified, is_phone_verified:res?.data?.is_phone_verified }});
          updateState({ isLoading: false });
          showSuccess(res.message);
          if((userData?.client_preference?.verify_phone&&!res?.data?.is_phone_verified)||(userData?.client_preference?.verify_email&&!res?.data?.is_email_verified)){
            setTimeout(() => {
              moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {from: navigationStrings.MY_PROFILE, onVerification:()=>onVerification()})();
            }, 1000);
            
          }
          else{
            navigation.goBack()
          }
        })
        .catch(errorMethod);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  const errorMethod = (error) => {
    updateState({ isLoading: false, isLoadingB: false, isRefreshing: false });
    showError(error?.message || error?.error);
  };

  const addUpdateLocation = (childData) => {
    //setModalVisible(false);

    if (type == 'addAddress') {
      // updateState({isLoading: true});
      updateState({ isLoading: true });

      actions
        .addAddress(childData, {
          code: appData?.profile?.code,
        })
        .then((res) => {
          updateState({ del: del ? false : true });
          showSuccess(res.message);

          // setTimeout(() => {
          //   getAllAddress();
          // }, 1000);
        })
        .catch((error) => {
          updateState({ isLoading: false });
          showError(error?.message || error?.error);
        });
    } else if (type == 'updateAddress') {
      updateState({ isLoading: true });
      let query = `/${selectedId}`;

      actions
        .updateAddress(query, childData, {
          code: appData?.profile?.code,
        })
        .then((res) => {
          updateState({ del: del ? false : true });
          showSuccess(res.message);
        })
        .catch((error) => {
          updateState({ isLoading: false });
          showError(error?.message || error?.error);
        });
    }
  };
  //this function use for chnage password
  const isValidDataOfChangePass = () => {
    const error = validations({
      password: currentpassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const changePassword = () => {
    if (!!userData?.auth_token) {
      const checkValid = isValidDataOfChangePass();
      if (!checkValid) {
        return;
      }
      let data = {
        current_password: currentpassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };
      updateState({ isLoading: true });
      actions
        .changePassword(data, {
          code: appData?.profile?.code,
        })
        .then((res) => {
        
          console.log(res,'MY RES FROM PASSWORD')
          // showSuccess(res.message)
          updateState({ isLoading: false });
          showSuccess(res.message);
          updateState({
            currentpassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        })
        .catch((err) => { 
          updateState({ isLoading: false });
          console.log(err,'MY error FROM PASSWORD') ;
          showError(err?.message || err?.error);
        }
        );
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  //Select Primary Address
  const setPrimaryLocation = (id) => {
    updateState({ isLoading: true });
    let data = {};
    let query = `/${id}`;
    actions
      .setPrimaryAddress(query, data, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        updateState({ isLoading: false, del: del ? false : true });
        showSuccess(res.message);
      })
      .catch((error) => {
        updateState({ isLoading: false });
        showError(error?.message || error?.error);
      });
  };

  //this function use for open actionsheet
  let actionSheet = useRef();
  const showActionSheet = () => {
    {
      !!userData?.auth_token ? actionSheet.current.show() : null;
    }
  };

  // this funtion use for camera handle
  const cameraHandle = async (index) => {
    const permissionStatus = await androidCameraPermission();
    if (permissionStatus) {
      if (index == 0 || index == 1) {
        cameraHandler(index, {
          width: 300,
          height: 400,
          cropping: true,
          cropperCircleOverlay: true,
          mediaType: 'photo',
        })
          .then((res) => {
            if (res?.data) {
              updateState({ isLoading: true });
            }
            let data = {
              type: 'jpg',
              avatar: res?.data,
            };

            actions
              .uploadProfileImage(data, {
                code: appData?.profile?.code,
              })
              .then((res) => {
                const source = {
                  uri: getImageUrl(
                    res.data.proxy_url,
                    res.data.image_path,
                    '200/200',
                  ),
                };
                const image = {
                  source,
                };
                actions.updateProfile({ ...userData, ...image });
                updateState({ isLoading: false });
                showSuccess(res.message);
              })
              .catch((err) => { });
          })
          .catch((err) => { });
      } else if (index == 2) {
        updateState({ isLoading: true });
        actions
          .removeProfileImage({}, {
            code: appData?.profile?.code,
          })
          .then((res) => {
           // console.log(res,'THIS IS PROFILE IMAGE');
            const source = {
              uri: getImageUrl(
                res.data.proxy_url,
                res.data.image_path,
                '200/200',
              ),
            };
            const image = {
              source,
            };
            actions.updateProfile({ ...userData, ...image });
            updateState({ isLoading: false });
            showSuccess(res.message);
          })
          .catch((err) => { });

      }
    }
  };

  useEffect(() => {
    if (!!userData?.auth_token) {
      getAllAddress();
    }
  }, [del]);

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
        actions.saveAllUserAddress(res.data);
        updateState({ address: res.data, isLoading: false, indicator: false });
        setModalVisible(false);
      })
      .catch((error) => {
        updateState({ isLoading: false });
        showError(error?.message || error?.error);
        setModalVisible(false);
      });
  };

  const setModalVisible = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({
        updateData: data,
        isVisible: visible,
        type: type,
        selectedId: id,
      });
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  //Delete address
  const delAddress = (id) => {
    updateState({ isLoading: true });

    let data = {};
    let query = `/${id}`;

    actions
      .deleteAddress(query, data, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        updateState({ del: del ? false : true });

        showSuccess(res.message);
      })
      .catch((error) => {
        updateState({ isLoading: false });
        showError(error?.message || error?.error);
      });
  };

  const _sendRefferal = () => {
    moveToNewScreen(navigationStrings.SENDREFFERAL)();
  };

  // Basic information tab
  const basicInfoView = () => {
    return (
      <KeyboardAwareScrollView
        style={{ height: height / 2 }}
        enableAutomaticScroll={true}>
        <View
          style={{
            marginVertical: moderateScaleVertical(30),
            marginHorizontal: moderateScale(24),
            height: height / 1.5,
          }}>
          {/* {userData?.refferal_code && userData?.refferal_code != '' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: moderateScaleVertical(20),
              }}>
              <View
                style={{
                  flex: 0.6,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.referralCode, { color: MyDarkTheme.colors.text }]
                      : styles.referralCode
                  }>{`${strings.YOUR_REFFERAL_CODE} ${userData?.refferal_code}`}</Text>
              </View>
              <View
                style={{
                  flex: 0.4,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Text
                  onPress={() => _sendRefferal()}
                  style={[
                    styles.referralCode,
                    {
                      color: themeColors.primary_color,
                      fontFamily: fontFamily.bold,
                    },
                  ]}>
                  {strings.SEND_REFFERAL}
                </Text>
              </View>
            </View>
          ) : null} */}

          <TextInputWithUnderlineAndLabel
            onChangeText={_onChangeText('name')}
            value={name}
            label={strings.YOUR_NAME}
            autoCapitalize={'none'}
            containerStyle={{ marginVertical: moderateScaleVertical(10) }}
            undnerlinecolor={colors.textGreyB}
            txtInputStyle={{
              fontFamily: fontFamily.regular,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}
            labelStyle={{
              color: colors.textGreyB,
              textTransform: 'uppercase',
              fontSize: textScale(12),
            }}
          />

          <TextInputWithUnderlineAndLabel
            onChangeText={_onChangeText('email')}
            value={email}
            label={strings.EMAIL}
            autoCapitalize={'none'}
            containerStyle={{ marginVertical: moderateScaleVertical(10) }}
            txtInputStyle={{
              fontFamily: fontFamily.regular,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}
            undnerlinecolor={colors.textGreyB}
            labelStyle={{
              color: colors.textGreyB,
              textTransform: 'uppercase',
              fontSize: textScale(12),
            }}
          />

          <PhoneNumberInputWithUnderline
            /** We allow only single country now */
            /**   onCountryChange={_onCountryChange}*/
            onChangePhone={(phoneNumber) =>
              updateState({ phoneNumber: phoneNumber.replace(/[^0-9]/g, '') })
            }
            placeholder={strings.PHONE_NUMBER}
            cca2={cca2}
            phoneNumber={phoneNumber}
            callingCode={callingCode}
            undnerlineColor={colors.textGreyB}
            textInputStyle={{
              fontFamily: fontFamily.regular,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontSize: textScale(14),
            }}
            labelStyle={{
              color: colors.textGreyB,
              textTransform: 'uppercase',
              fontSize: textScale(12),
            }}
          />

          <View style={{ height: moderateScaleVertical(20) }} />

          <GradientButton
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={styles.textStyle}
            onPress={()=>saveUserInfo()}
            // marginTop={moderateScaleVertical(20)}
            marginBottom={moderateScaleVertical(50)}
            btnText={strings.SAVE_CHANGES}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  };
  //Change password info tab
  const changePasswordView = () => {
    return (
      <KeyboardAwareScrollView
        style={{ height: height / 2 }}
        enableAutomaticScroll={true}>
        <View
          style={{
            height: height / 1.7,
            marginVertical: moderateScaleVertical(50),
            marginHorizontal: moderateScale(24),
          }}>
          <TextInputWithUnderlineAndLabel
            onChangeText={_onChangeText('currentpassword')}
            label={strings.ENTER_CURRENT_PASSWORD}
            value={currentpassword}
            secureTextEntry={true}
            containerStyle={{ marginVertical: moderateScaleVertical(10) }}
            undnerlinecolor={colors.textGreyB}
            labelStyle={{
              color: colors.textGreyB,
              textTransform: 'uppercase',
              fontSize: textScale(12),
            }}
          />

          <TextInputWithUnderlineAndLabel
            onChangeText={_onChangeText('newPassword')}
            value={newPassword}
            label={strings.ENTER_NEW_PASSWORD}
            undnerlinecolor={colors.textGreyB}
            labelStyle={{
              color: colors.textGreyB,
              textTransform: 'uppercase',
              fontSize: textScale(12),
            }}
            secureTextEntry={true}
            containerStyle={{ marginVertical: moderateScaleVertical(10) }}
          />
          <TextInputWithUnderlineAndLabel
            onChangeText={_onChangeText('confirmPassword')}
            value={confirmPassword}
            label={strings.ENTER_CONFIRM_PASSWORD}
            undnerlinecolor={colors.textGreyB}
            labelStyle={{
              color: colors.textGreyB,
              textTransform: 'uppercase',
              fontSize: textScale(12),
            }}
            secureTextEntry={true}
            containerStyle={{ marginVertical: moderateScaleVertical(10) }}
          />
          <GradientButton
            btnStyle={{ marginTop: moderateScaleVertical(57) }}
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={styles.textStyle}
            onPress={changePassword}
            // marginTop={moderateScaleVertical(50)}
            marginBottom={moderateScaleVertical(50)}
            btnText={strings.CHANGE_PASS_CAPS}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  };

  //address view tab
  const addressView = () => {
    return (
      <ScrollView
        style={{
          marginVertical: moderateScaleVertical(30),
          // borderBottomColor:colors.lightGreyBorder,
          // borderBottomWidth:moderateScaleVertical(1)
          // profileAddress?.address && userData?.auth_token?
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: moderateScale(20),
            justifyContent: 'space-between',
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: textScale(16),
              fontFamily: fontFamily.medium,
              width: moderateScale(180),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : getColorCodeWithOpactiyNumber(colors.black.substr(1), 60),
            }}>
            {strings.SAVED_LOCATIONS}
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true, 'addAddress')}>
            <Text
              style={{
                fontSize: textScale(12),
                fontFamily: fontFamily.medium,
                color: themeColors.primary_color,
              }}>
              {strings.ADD_NEW_ADDRESS}
            </Text>
          </TouchableOpacity>
        </View>
        {address &&
          address.map((itm, inx) => {
            // if (profileAddress?.address && userData?.auth_token) {
            return (
              <View
                key={inx}
                style={{
                  borderBottomColor: colors.lightGreyBorder,
                  borderBottomWidth: moderateScaleVertical(1),
                }}>
                <TouchableOpacity onPress={() => setPrimaryLocation(itm.id)}>
                  <View
                    style={{
                      marginHorizontal: moderateScale(24),
                      marginTop: moderateScaleVertical(20),
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: moderateScaleVertical(12),
                    }}>
                    <View
                      style={{
                        flex: 0.1,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                      }}>
                      <Image
                        style={
                          isDarkMode
                            ? { tintColor: MyDarkTheme.colors.text }
                            : null
                        }
                        source={
                          itm?.type == 1
                            ? imagePath.home
                            : imagePath.workInActive
                        }
                      />
                    </View>
                    <View style={{ flex: 0.8 }}>
                      <Text
                        numberOfLines={2}
                        style={
                          isDarkMode
                            ? [
                              styles.address,
                              {
                                textAlign: 'left',
                                color: MyDarkTheme.colors.text,
                              },
                            ]
                            : [styles.address, { textAlign: 'left' }]
                        }>
                        {itm?.address}
                      </Text>
                    </View>
                    {itm && !!itm.is_primary && (
                      <View
                        style={{
                          flex: 0.1,
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}>
                        <Image
                          style={{ tintColor: themeColors.primary_color }}
                          source={imagePath.done}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: moderateScale(24),
                  }}>
                  <View style={{ flex: 0.1 }} />
                  <View
                    style={{
                      flex: 0.8,
                      flexDirection: 'row',
                      // justifyContent: 'flex-start',
                      paddingVertical: moderateScaleVertical(10),
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        setModalVisible(true, 'updateAddress', itm.id, itm)
                      }
                      style={{
                        width: width / 4.5,
                        backgroundColor: getColorCodeWithOpactiyNumber(
                          themeColors.primary_color.substr(1),
                          20,
                        ),
                        padding: moderateScaleVertical(6),
                        borderRadius: 20,
                        // alignItems:'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
                      <Image
                        style={{ tintColor: themeColors.primary_color }}
                        source={imagePath.editBlue}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: fontFamily.bold,
                          color: themeColors.primary_color,
                          fontSize: textScale(12),
                          paddingLeft: moderateScale(5),
                        }}>
                        {strings.EDIT}
                      </Text>
                    </TouchableOpacity>
                    <View style={{ flex: 0.05 }} />
                    <TouchableOpacity
                      onPress={() => delAddress(itm.id)}
                      style={{
                        width: width / 4.5,
                        backgroundColor: getColorCodeWithOpactiyNumber(
                          'F94444',
                          20,
                        ),
                        borderRadius: 20,
                        padding: moderateScaleVertical(6),
                        borderRadius: 20,
                        // alignItems:'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
                      <Image source={imagePath.deleteRed} />
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: fontFamily.bold,
                          color: colors.redB,
                          fontSize: textScale(12),
                          paddingLeft: moderateScale(5),
                        }}>
                        {strings.DELETE}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 0.1 }} />
                </View>
              </View>
            );
            // } else {
            //   return;
            // }
          })}
      </ScrollView>
    );
  };

  const resendOtpData=()=>{
    let data = {};
      data['phone_number'] = phoneNumber;
      data['dial_code'] = callingCode;
      data['type'] = type;
      updateState({ isLoading: true });
    actions
      .resendOTP(data, {
        code: appData?.profile?.code,
      })  
      .then((res) => {
        showSuccess(res.message);
          setTimer2(30)
          showOtpModal(true)
          updateState({ isLoading: false });
      })
      .catch(errorMethod);
  }


  const options = [
    strings.CAMERA,
    strings.GALLERY,
    strings.REMOVE_PROFILE_PHOTO,
    strings.CANCEL
  ]


 
  const onVerification=async()=>{
    console.log("userData", userData)
    let check = true;
    if(userData?.client_preference?.verify_phone||userData?.client_preference?.verify_email){
      if(!userData?.verify_details?.is_phone_verified){
        check=false
      }
      if(!userData?.verify_details?.is_email_verified){
        check=false
      }
      if(check){
        navigation.goBack()
      }
    }
    else {

    }
  }
  //
  return (
    <WrapperContainer
      isLoadingB={isLoading}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGreyC}
      source={loaderOne}>
      <Header
        leftIcon={imagePath.icBackb}
        centerTitle={strings.MY_PROFILE}
        headerStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.backgroundGreyC,
        }}
      />
      <View style={{ ...commonStyles.headerTopLine }} />
      {/* top section user general info */}

      <View
        style={
          isDarkMode
            ? [
              styles.topSection,
              { backgroundColor: MyDarkTheme.colors.background },
            ]
            : styles.topSection
        }>
        <TouchableWithoutFeedback onPress={showActionSheet}>
          <View
            style={{
              backgroundColor: colors.backgroundGrey,
              alignSelf: 'center',
              height: moderateScale(90),
              width: moderateScale(90),
              borderRadius: moderateScale(12),
              borderWidth: moderateScale(5),
              borderColor: colors.white,
              marginTop: moderateScale(20),
            }}>
            <FastImage
              source={
                userData?.source?.image_path
                  ? {
                    uri: getImageUrl(
                      userData?.source?.proxy_url,
                      userData?.source?.image_path,
                      '200/200',
                    ),
                    priority: FastImage.priority.high,
                  }
                  : userData?.source
              }
              style={{
                height: moderateScale(80),
                width: moderateScale(80),
                borderRadius: moderateScale(12),
              }}
            />
            <View style={{ position: 'absolute', right: -15 }}>
              <Image
                style={{ height: 30, width: 30 }}
                source={imagePath?.camera}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: moderateScaleVertical(20),
          }}>
          <Text
            style={
              isDarkMode
                ? [styles.userName, { color: MyDarkTheme.colors.text }]
                : styles.userName
            }>
            {userData?.name}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.userEmail, { color: MyDarkTheme.colors.text }]
                : styles.userEmail
            }>
            {userData?.email}
          </Text>
        </View>
      </View>

      <View
        style={
          isDarkMode
            ? [
              styles.bottomSection,
              { backgroundColor: MyDarkTheme.colors.background },
            ]
            : styles.bottomSection
        }>
        {/* scrolllablr tob bar */}
        <CustomTopTabBar
          scrollEnabled={true}
          tabBarItems={tabBarData}
          onPress={(tabData) => changeTab(tabData)}
          numberOfLines={1}
          // containerStyle={{  width: width / 3}}
          textTabWidth={width / 2.8}
          customTextContainerStyle={{
            width: width / 2.8,

            // flexWrap: 'wrap',
            // alignSelf:'center'
            // justifyContent: 'center',
          }}
          textStyle={{
            fontSize: textScale(13),
          }}
          socialLogin={socialLogin}
        />

        {selectedTab && selectedTab == strings.BASIC_INFO && basicInfoView()}
        {selectedTab &&
          selectedTab == strings.CHANGE_PASS &&
          changePasswordView()}
        {selectedTab && selectedTab == strings.ADDRESS && addressView()}
      </View>

      <ActionSheet
        ref={actionSheet}
        // title={'Choose one option'}
        options={options}
        cancelButtonIndex={3}
        destructiveButtonIndex={3}
        onPress={(index) => cameraHandle(index)}
      />

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
      <OtpModal
        isVisible={otpModal}
        phoneNumber={phoneNumber}
        callingCode={callingCode}
        type={type}
        timerStart={timer2}
        onClose={()=>{showOtpModal(false)}}
        saveClick={()=>saveUserInfo()}
      />

    </WrapperContainer>
  );
}
