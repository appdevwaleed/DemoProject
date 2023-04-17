import {cloneDeep} from 'lodash';
import React, {useEffect, useState, useRef} from 'react';
import {
  I18nManager,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import CountryPicker from 'react-native-country-picker-modal';

import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {showError} from '../../utils/helperFunctions';
import {
  fbLogin,
  googleLogin,
  handleAppleLogin,
  _twitterSignIn,
} from '../../utils/socialLogin';
import validator from '../../utils/validations';
import stylesFunc from './styles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import TransparentButtonWithTxtAndIcon from '../../Components/ButtonComponent';
import AsyncStorage from '@react-native-community/async-storage';
import {mobile} from 'is_js';
import {setItem} from '../../utils/utils';
import PasswordTextInput from '../../Components/PasswordTextInput';

export default function Login({navigation,route}) {
  let paramsData = route?.params.data || null;
  console.log("Login - Login.js",paramsData)
  const {appData, themeColors, currencies, languages, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const {apple_login, fb_login, twitter_login, google_login} = useSelector(
    (state) => state?.initBoot?.appData?.profile?.preferences,
  );
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  var clonedState = {};

  const [state, setState] = useState({
    // email: '',
    // password: '',
    isLoading: false,
    phoneInput: false,
    phoneNoVisibility: false,
    phoneNumber: '',
    email: {
      value: '',
      focus: true,
    },
    mobilNo: {
      phoneNo: '',
      callingCode: appData?.profile.country?.phonecode
        ? appData?.profile?.country?.phonecode
        : '91',
      cca2: appData?.profile?.country?.code
        ? appData?.profile?.country?.code
        : 'IN',
      focus: false,
      countryName: '',
    },
  });

  const fontFamily = appStyle?.fontSizeData;
  //CLone deep all the states
  useEffect(() => {
    clonedState = cloneDeep(state);
  }, []);

  //Update states
  const updateState = (data) => setState((state) => ({...state, ...data}));
  //Styles in app
  const styles = stylesFunc({themeColors, fontFamily});

  //all states used in this screen
  const {
    password,
    isLoading,
    phoneInput,
    phoneNoVisibility,
    mobilNo,
    email,
    number,
  } = state;

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };
  //On change textinput
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  //Validate form
  const isValidData = () => {
    const error = email.focus
      ? validator({email: email.value, password})
      : validator({
          phoneNumber: mobilNo.phoneNo,
          callingCode: mobilNo.callingCode,
        });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  //Login api fucntion
  const _onLogin = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');

    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }

    let data = {
      username: email.focus ? email.value : mobilNo.phoneNo,
      password: password,
      device_type: Platform.OS,
      device_token: DeviceInfo.getUniqueId(),
      fcm_token: !!fcmToken ? fcmToken : DeviceInfo.getUniqueId(),
      dialCode: mobilNo.focus ? mobilNo.callingCode : '',
      countryData: mobilNo.focus ? mobilNo.cca2 : '',
    };
    updateState({isLoading: true});
    actions
      .loginUsername(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log("_onLogin", res)
        setItem('isLoggedInDevice', 'true');
        if (!!res.data) {
          (!!res.data?.verify_details?.is_email_verified &&
             !!res.data?.verify_details?.is_phone_verified) ?
             navigation.navigate(navigationStrings.TAB_ROUTES, { screen: navigationStrings.ACCOUNTS}) :
             moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})()
          res.data.is_phone
            ? navigation.navigate(navigationStrings.OTP_VERIFICATION, {
                username: mobilNo?.phoneNo,
                dialCode: mobilNo?.callingCode,
                countryData: mobilNo?.cca2,
              })
            : !!res.data?.client_preference?.verify_email ||
              !!res.data?.client_preference?.verify_phone
            ? !!res.data?.verify_details?.is_email_verified &&
              !!res.data?.verify_details?.is_phone_verified
              ? ( paramsData?.orginScreenIndex === 1 ? moveToNewScreen(navigationStrings.CART,{})() :  moveToNewScreen(navigationStrings.HOME,{})())
              : moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})()
            : ( paramsData?.orginScreenIndex === 1 ? moveToNewScreen(navigationStrings.CART,{})() :  moveToNewScreen(navigationStrings.HOME,{})())
        }
        updateState({isLoading: false});
        getCartDetail();
      })
      .catch(errorMethod);
  };

  //Get your cart detail
  const getCartDetail = () => {
    actions
      .getCartDetail(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        actions.cartItemQty(res);
      })
      .catch((error) => {});
  };
  //Error handling in api
  const errorMethod = (error) => {
    updateState({isLoading: false});

    setTimeout(() => {
      showError(error?.message || error?.error);
    }, 500);
  };

  //Saving login user to backend
  const _saveSocailLogin = async (socialLoginData, type) => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let data = {};
    data['name'] =
      socialLoginData?.name ||
      socialLoginData?.userName ||
      socialLoginData?.fullName?.givenName;
    data['auth_id'] =
      socialLoginData?.id ||
      socialLoginData?.userID ||
      socialLoginData?.identityToken;
    data['phone_number'] = '';
    data['email'] = socialLoginData?.email;
    data['device_type'] = Platform.OS;
    data['device_token'] = DeviceInfo.getUniqueId();
    data['fcm_token'] = !!fcmToken ? fcmToken : DeviceInfo.getUniqueId();

    let query = '';
    if (
      type == 'facebook' ||
      type == 'twitter' ||
      type == 'google' ||
      type == 'apple'
    ) {
      query = type;
    }
    actions
      .socailLogin(`/${query}`, data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        if (!!res.data) {
          !!res.data?.client_preference?.verify_email ||
          !!res.data?.client_preference?.verify_phone
            ? !!res.data?.verify_details?.is_email_verified &&
              !!res.data?.verify_details?.is_phone_verified
              ? navigation.push(navigationStrings.DRAWER_ROUTES)
              : moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})()
            : navigation.push(navigationStrings.DRAWER_ROUTES);
        }
        updateState({isLoading: false});
        getCartDetail();
      })
      .catch(errorMethod);
  };

  //Apple Login Support
  const openAppleLogin = () => {
    updateState({isLoading: false});
    handleAppleLogin()
      .then((res) => {
        _saveSocailLogin(res, 'apple');
        // updateState({isLoading: false});
      })
      .catch((err) => {
        updateState({isLoading: false});
      });
  };

  //Gmail Login Support
  const openGmailLogin = () => {
    updateState({isLoading: true});
    googleLogin()
      .then((res) => {
        if (res?.user) {
          _saveSocailLogin(res.user, 'google');
        } else {
          updateState({isLoading: false});
        }
      })
      .catch((err) => {
        console.log(err, 'error in gmail login');
        updateState({isLoading: false});
      });
  };
  const _responseInfoCallback = (error, result) => {
    updateState({isLoading: true});
    if (error) {
      updateState({isLoading: false});
    } else {
      if (result && result?.id) {
        _saveSocailLogin(result, 'facebook');
      } else {
        updateState({isLoading: false});
      }
    }
  };
  //FacebookLogin
  const openFacebookLogin = () => {
    fbLogin(_responseInfoCallback);
  };

  //twitter login
  const openTwitterLogin = () => {
    _twitterSignIn()
      .then((res) => {
        if (res) {
          _saveSocailLogin(res, 'twitter');
        }
      })
      .catch((err) => {});
  };
  const _onCountryChange = (data) => {
    updateState({
      mobilNo: {
        phoneNo: mobilNo.phoneNo,
        cca2: data.cca2,
        callingCode: data.callingCode,
      },
      // cca2: data.cca2,
      // callingCode: data.mobilNo.callingCode[0],
    });
    return;
  };

  /*************************** Check Input Handler */
  const checkInputHandler = (data = '') => {
    let re = /^[0-9]{1,45}$/;
    let c = re.test(data);

    if (c) {
      updateState({
        phoneInput: true,
        mobilNo: {
          ...mobilNo,
          phoneNo: data,
          focus: true,
        },
        email: {
          ...email,
          focus: false,
        },
      });
    } else {
      updateState({
        phoneInput: false,
        email: {
          value: data,
          focus: true,
        },
        mobilNo: {
          ...mobilNo,
          focus: false,
        },
      });
    }
  };
  /*************************** On Text Change
   */ const textChangeHandler = (type, data, value = 'value') => {
    updateState((preState) => {
      return {
        [type]: {
          ...preState[type],
          [value]: data,
        },
      };
    });
  };

  return (
    <WrapperContainer
      isLoadingB={isLoading}
      source={loaderOne}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={{alignSelf: 'flex-start'}}>
          <Image
            source={
              imagePath.icBackb
            }
            style={
              isDarkMode
                ? {
                    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                    tintColor: MyDarkTheme.colors.text,
                  }
                : {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}
            }
          />
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
          marginHorizontal: moderateScale(24),
        }}>
        <View style={{height: moderateScaleVertical(28)}} />
        <Text
          style={
            isDarkMode
              ? [styles.header, {color: MyDarkTheme.colors.text}]
              : styles.header
          }>
          {strings.LOGIN_YOUR_ACCOUNT}
        </Text>

        <Text
          style={
            isDarkMode
              ? [styles.txtSmall, {color: MyDarkTheme.colors.text}]
              : styles.txtSmall
          }>
          {strings.ENTE_REGISTERED_EMAIL}
        </Text>
        <View style={{height: moderateScaleVertical(30)}} />
        {/* <BorderTextInput
            onChangeText={_onChangeText('email')}
            placeholder={strings.YOUR_EMAIL}
            value={email}
            keyboardType={'email-ad
            autoCapitalize={'none'}
          /> */}
        {!phoneInput && (
          <>
            <BorderTextInput
              onChangeText={(data) => checkInputHandler(data)}
              placeholder={strings.YOUR_EMAIL_PHONE}
              value={email.value}
              keyboardType={'email-address'}
              autoCapitalize={'none'}
              autoFocus={true}
            />
            <PasswordTextInput
              secureTextEntry={true}
              onChangeText={_onChangeText('password')}
              placeholder={strings.ENTER_PASSWORD}
              value={password}
            />
            {/* <BorderTextInput
              onChangeText={_onChangeText('password')}
              placeholder={strings.ENTER_PASSWORD}
              value={password}
              secureTextEntry={true}
            /> */}
          </>
        )}
        {phoneInput && (
          <View style={{marginBottom: moderateScale(18)}}>
            <PhoneNumberInput
              onCountryChange={_onCountryChange}
              onChangePhone={(data) => checkInputHandler(data)}
              cca2={mobilNo.cca2}
              phoneNumber={mobilNo.phoneNo}
              callingCode={mobilNo.callingCode}
              placeholder={strings.YOUR_PHONE_NUMBER}
              keyboardType={'phone-pad'}
              color={isDarkMode ? MyDarkTheme.colors.text : null}
              autoFocus={true}
            />
          </View>
        )}

        <View style={styles.forgotContainer}>
          <Text
            onPress={moveToNewScreen(navigationStrings.FORGOT_PASSWORD)}
            style={{
              fontFamily: fontFamily.bold,
              color: themeColors.primary_color,
            }}>
            {' '}
            {strings.FORGOT}
          </Text>
        </View>

        <GradientButton
          containerStyle={{marginTop: moderateScaleVertical(10)}}
          onPress={_onLogin}
          btnText={strings.LOGIN_ACCOUNT}
        />
        <View style={{marginTop: moderateScaleVertical(30)}}>
          {/* {!!google_login || !!fb_login || !!twitter_login || !!apple_login ? (
            <View style={styles.socialRow}>
              <View style={styles.hyphen} />
              <Text
                style={
                  isDarkMode
                    ? [styles.orText, {color: MyDarkTheme.colors.text}]
                    : styles.orText
                }>
                {strings.OR_LOGIN_WITH}
              </Text>
              <View style={styles.hyphen} />
            </View>
          ) : null} */}
          {/* <View style={styles.socialRowBtn}>
            {!!google_login && (
              <TouchableOpacity
                onPress={() => openGmailLogin()}
                style={{marginHorizontal: moderateScale(20)}}>
                <Image source={imagePath.google} />
              </TouchableOpacity>
            )}
            {!!fb_login && (
              <TouchableOpacity
                onPress={() => openFacebookLogin()}
                style={{marginHorizontal: moderateScale(20)}}>
                <Image source={imagePath.fb} />
              </TouchableOpacity>
            )}
            {!!twitter_login && (
              <TouchableOpacity
                onPress={() => openTwitterLogin()}
                style={{marginHorizontal: moderateScale(20)}}>
                <Image source={imagePath.twitterIcon} />
              </TouchableOpacity>
            )}

            {!!apple_login && Platform.OS == 'ios' && (
              <TouchableOpacity
                onPress={() => openAppleLogin()}
                style={{marginHorizontal: moderateScale(20)}}>
                <Image source={imagePath.apple} />
              </TouchableOpacity>
            )}
          </View> */}
          <View
            style={{
              flexDirection: 'column',
            }}>
            {/* {!!google_login && (
              <View style={{marginTop: moderateScaleVertical(15)}}>
                <TransparentButtonWithTxtAndIcon
                  icon={imagePath.ic_google2}
                  btnText={strings.CONTINUE_GOOGLE}
                  containerStyle={{
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.white,
                    borderColor: colors.borderColorD,
                    borderWidth: 1,
                  }}
                  textStyle={{
                    color: isDarkMode ? colors.white : colors.textGreyB,
                    marginHorizontal: moderateScale(15),
                  }}
                  onPress={() => openGmailLogin()}
                />
              </View>
            )} */}
            {!!fb_login && (
              <View style={{marginVertical: moderateScaleVertical(15)}}>
                <TransparentButtonWithTxtAndIcon
                  icon={imagePath.ic_fb2}
                  btnText={strings.CONTINUE_FACEBOOK}
                  containerStyle={{
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.white,
                    borderColor: colors.borderColorD,
                    borderWidth: 1,
                  }}
                  textStyle={{
                    color: isDarkMode ? colors.white : colors.textGreyB,
                    marginHorizontal: moderateScale(5),
                  }}
                  onPress={() => openFacebookLogin()}
                />
              </View>
            )}
            {!!twitter_login && (
              <TransparentButtonWithTxtAndIcon
                icon={imagePath.ic_twitter2}
                btnText={strings.CONTINUE_TWITTER}
                containerStyle={{
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.white,
                  borderColor: colors.borderColorD,
                  borderWidth: 1,
                }}
                textStyle={{
                  color: isDarkMode ? colors.white : colors.textGreyB,
                  marginHorizontal: moderateScale(10),
                }}
                nPress={() => openTwitterLogin()}
              />
            )}

            {!!apple_login && Platform.OS == 'ios' && (
              <View style={{marginVertical: moderateScaleVertical(15)}}>
                <TransparentButtonWithTxtAndIcon
                  icon={isDarkMode ? imagePath.ic_apple : imagePath.ic_apple2}
                  btnText={strings.CONTINUE_APPLE}
                  containerStyle={{
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.white,
                    borderColor: colors.borderColorD,
                    borderWidth: 1,
                  }}
                  textStyle={{
                    color: isDarkMode ? colors.white : colors.textGreyB,
                    marginHorizontal: moderateScale(17),
                  }}
                  onPress={() => openAppleLogin()}
                />
              </View>
            )}
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Text
            style={
              isDarkMode
                ? {...styles.txtSmall, color: MyDarkTheme.colors.text}
                : {...styles.txtSmall, color: colors.textGreyLight}
            }>
            {strings.DO_NOT_HAVE_ACCOUNT}
            <Text
              onPress={moveToNewScreen(navigationStrings.SIGN_UP)}
              style={{
                fontFamily: fontFamily.bold,
                color: themeColors.primary_color,
              }}>
              {' '}
              {strings.SIGN_UP}
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
