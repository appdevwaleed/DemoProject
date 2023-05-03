import React, {useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import GradientButton from '../../Components/GradientButton';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {hitSlopProp} from '../../styles/commonStyles';
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
import DeviceInfo from 'react-native-device-info';
import stylesFunc from './styles';
import Header from '../../Components/Header';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import TransparentButtonWithTxtAndIcon from '../../Components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OuterScreen({navigation,route}) {
    let paramsData = route?.params.data || null;
  console.log("OuterScreen - OuterScreen.js",paramsData)
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    getLanguage: '',
    isLoading: false,
  });
  const {
    appData,
    currencies,
    themeColors,
    languages,
    shortCodeStatus,
    appStyle,
  } = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});

  const {getLanguage, isLoading} = state;
  const {apple_login, fb_login, twitter_login, google_login} =
    appData?.profile?.preferences;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };


//console.log("@ device   ",DeviceInfo.getBundleId())
 
//console.log(  userStaticName.split('.'),"userStaticNameuserStaticNameuserStaticName");

  

  


  //Saving login user to backend
  const _saveSocailLogin = async (socialLoginData, type) => {
  
 let userStaticName  =DeviceInfo.getBundleId();
 userStaticName=userStaticName.split('.')
    
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let data = {};
    data['name'] =
      socialLoginData?.name ||
      socialLoginData?.userName ||
      socialLoginData?.fullName?.givenName || `${userStaticName[userStaticName.length-1]} user`;
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
          // if (
          //   !!res.data?.client_preference?.verify_email &&
          //   !!res.data?.client_preference?.verify_phone
          // ) {
            if (
              !!res.data?.verify_details?.is_email_verified &&
              !!res.data?.verify_details?.is_phone_verified
            ) {
             navigation.push(navigationStrings.DRAWER_ROUTES);
            } else {
              moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})();
            }
          }
          //  else if (
          //   !!res.data?.client_preference?.verify_email ||
          //   !!res.data?.client_preference?.verify_phone
          // ) {
          //   if (
          //     !!res.data?.verify_details?.is_email_verified ||
          //     !!res.data?.verify_details?.is_phone_verified
          //   ) {
          //    // navigation.push(navigationStrings.DRAWER_ROUTES);
          //    navigation.goBack()
          //   } else {
          //     moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})();
          //   }
          // } else {
          //   navigation.push(navigationStrings.DRAWER_ROUTES);
          // }
     //   }
        updateState({isLoading: false});
        getCartDetail();
      })
      .catch(errorMethod);
  };

  //error handling
  const errorMethod = (error) => {
    updateState({isLoading: false});
    showError(error?.error || error?.message);
  };

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
  // const openTwitterLogin = () => {
  //   // updateState({isLoading: true});
  //   _twitterSignIn()
  //     .then((res) => {
  //       if (res) {
  //         _saveSocailLogin(res, 'twitter');
  //       } else {
  //         updateState({isLoading: false});
  //       }
  //     })
  //     .catch((err) => {
  //       updateState({isLoading: false});
  //     });
  // };

  const onGuestLogin = () => {
    actions.userLogout();
    getCartDetail();
    navigation.push(navigationStrings.DRAWER_ROUTES);  
  };
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      {shortCodeStatus && (
        <Header
          leftIcon={
            imagePath.icBackb
          }
          onPressLeft={() =>
            // navigation.push(navigationStrings.SHORT_CODE, {
            //   shortCodeParam: true,
            // })
            navigation.goBack()
          }
          // rightIcon={imagePath.cartShop}
          headerStyle={
            isDarkMode
              ? {backgroundColor: MyDarkTheme.colors.background}
              : {backgroundColor: colors.white}
          }
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: moderateScaleVertical(70),
          flexGrow: 1,
        }}>
        <Text
          style={
            isDarkMode
              ? [styles.header, {color: MyDarkTheme.colors.text}]
              : styles.header
          }>
          {strings.CREATE_YOUR_ACCOUNT}
        </Text>
        <View style={{marginHorizontal: moderateScale(24)}}>
          {appData?.profile?.preferences?.home_tag_line ? (
            <View style={{marginHorizontal: moderateScaleVertical(30)}}>
              <Text numberOfLines={2} style={styles.txtSmall}>
                {appData?.profile?.preferences?.home_tag_line
                  ? appData?.profile?.preferences?.home_tag_line
                  : ''}
              </Text>
            </View>
          ) : null}

          <GradientButton
            containerStyle={{marginTop: moderateScaleVertical(50)}}
            btnText={strings.SIGNUP_NEW_USER}
            onPress={moveToNewScreen(navigationStrings.SIGN_UP)}
          />
          <GradientButton
            containerStyle={{marginTop: moderateScaleVertical(20)}}
            btnText={strings.SIGNIN_EXISTING_USER}
            onPress={moveToNewScreen(navigationStrings.LOGIN,{orginScreenIndex: paramsData?.orginScreenIndex})}
          />
          {/* <ButtonWithLoader
            btnStyle={styles.guestBtn}
            btnTextStyle={{color: themeColors.primary_color}}
            onPress={() => onGuestLogin()}
            btnText={strings.GUEST_LOGIN}
          /> */}
          <View style={{marginTop: moderateScaleVertical(50)}}>
            {/* {!!google_login ||
            !!fb_login ||
            !!twitter_login ||
            !!apple_login ? (
              <View style={styles.socialRow}>
                <View style={styles.hyphen} />
                <Text
                  style={
                    isDarkMode
                      ? [styles.orText, {color: MyDarkTheme.colors.text}]
                      : styles.orText
                  }>
                   {strings.OR_SIGNUP_WITH}
                </Text>
                <View style={styles.hyphen} />
              </View>
            ) : null} */}

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
              {/* {!!twitter_login && (
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
              )} */}

              {!!apple_login && Platform.OS == 'ios' && (
                <View
                // style={{marginVertical: moderateScaleVertical(15)}}
                >
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
        </View>
        {/* <View style={styles.bottomContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...styles.txtSmall,
                color: colors.textGreyLight,
                marginTop: 0,
              }}>
              {strings.ALREADY_HAVE_AN_ACCOUNT}
            </Text>
            <TouchableOpacity
              hitSlop={hitSlopProp}
              onPress={moveToNewScreen(navigationStrings.LOGIN)}>
              <Text
                style={{
                  color: themeColors.primary_color,
                  // lineHeight:24,
                  fontFamily: fontFamily.bold,
                }}>
                {strings.LOGIN}
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </ScrollView>
    </WrapperContainer>
  );
}
