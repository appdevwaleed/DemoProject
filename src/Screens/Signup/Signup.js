import React, {useState} from 'react';
import {
  I18nManager,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {showError} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFun from './styles';
import commonStylesFun from '../../styles/commonStyles';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import AsyncStorage from '@react-native-community/async-storage';
import PasswordTextInput from '../../Components/PasswordTextInput';
import {setItem} from '../../utils/utils';

export default function Signup({navigation,route}) {
    let paramsData = route?.params.data || null;
  console.log("Signup - Signup.js")
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const userData = useSelector((state) => state.auth.userData);
  const {appData, themeColors, themeLayouts, currencies, languages} =
    useSelector((state) => state?.initBoot);
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});
  const styles = stylesFun({fontFamily});

  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  // console.log(appData, 'appDataSignup');

  const [state, setState] = useState({
    isLoading: false,
    callingCode: appData?.profile.country?.phonecode
      ? appData?.profile?.country?.phonecode
      : '91',
    cca2: appData?.profile?.country?.code
      ? appData?.profile?.country?.code
      : 'IN',
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    deviceToken: '',
    referralCode: '',
  });
  const _onCountryChange = (data) => {
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  const isValidData = () => {
    const error = validations({
      email: appData?.profile?.preferences?.verify_email ? email : 'emptyValid',
      password: password,
      name: name,
      callingCode: callingCode,
      phoneNumber: appData?.profile?.preferences?.verify_phone
        ? phoneNumber
        : 'emptyValid',
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  /** SIGNUP API FUNCTION **/
  const onSignup = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');

    let {callingCode} = state;
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }

    let data = {
      name: name,
      // phone_number: '+' + callingCode + phoneNumber,
      phone_number: phoneNumber,
      dial_code: callingCode.toString(),
      country_code: cca2,
      email: email,
      password: password,
      device_type: Platform.OS,
      device_token: DeviceInfo.getUniqueId(),
    //  refferal_code: referralCode,
      refferal_code: null,
      fcm_token: !!fcmToken ? fcmToken : DeviceInfo.getUniqueId(),
      // country_id: '1',
    };
    updateState({isLoading: true});
    actions
      .signUpApi(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, "signUpApi response ");
        setItem('isLoggedInDevice', 'true');
        updateState({isLoading: false});
        if (!!res.data) {
            if (
              !!res.data?.verify_details?.is_email_verified &&
              !!res.data?.verify_details?.is_phone_verified
            ) {
               // navigation.push(navigationStrings.TAB_ROUTES);
               ( paramsData?.orginScreenIndex === 1 ? moveToNewScreen(navigationStrings.CART,{})() :  moveToNewScreen(navigationStrings.HOME,{})())
            } else {
              moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {orginScreenIndex : paramsData?.orginScreenIndex })();
            }
          } 

      })
      .catch(errorMethod);
  };
  const errorMethod = (error) => {
    updateState({isLoading: false});
    showError(error?.message || error?.error);
    console.log(error);
  };

  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  const {
    phoneNumber,
    callingCode,
    cca2,
    name,
    email,
    isLoading,
    password,
    referralCode,
  } = state;
  return (
    <WrapperContainer
      isLoadingB={isLoading}
      source={loaderOne}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
      <View
        style={{
          height: moderateScaleVertical(60),
          paddingHorizontal: moderateScale(24),
          justifyContent: 'center',
        }}>
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
        }}>
        <View style={{flex: 1}}>
          <View style={{marginTop: moderateScaleVertical(50)}}>
            <Text
              style={
                isDarkMode
                  ? [styles.header, {color: MyDarkTheme.colors.text}]
                  : styles.header
              }>
              {strings.CREATE_YOUR_ACCOUNT}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.txtSmall, {color: MyDarkTheme.colors.text}]
                  : styles.txtSmall
              }>
              {strings.ENTER_DETAILS_BELOW}
            </Text>
          </View>

          <View
            style={{
              marginTop: moderateScaleVertical(50),
              marginHorizontal: moderateScale(24),
            }}>
            <BorderTextInput
              onChangeText={_onChangeText('name')}
              placeholder={strings.YOUR_NAME}
              value={name}
            />
            <BorderTextInput
              // autoCapitalize={'none'}
              onChangeText={_onChangeText('email')}
              placeholder={strings.YOUR_EMAIL}
              value={email}
              keyboardType={'email-address'}
            />
            <PhoneNumberInput
            /** We allow only single country now */

            /**  onCountryChange={_onCountryChange} */
              onChangePhone={(phoneNumber) =>
              updateState({phoneNumber: phoneNumber.replace(/[^0-9]/g, '')})
              } 
              cca2={cca2}
              phoneNumber={phoneNumber}
              callingCode={state.callingCode}
              placeholder={strings.YOUR_PHONE_NUMBER}
              keyboardType={'phone-pad'}
              color={isDarkMode ? MyDarkTheme.colors.text : null}
            />
            <View style={{height: moderateScaleVertical(20)}} />
            <PasswordTextInput
              secureTextEntry={true}
              onChangeText={_onChangeText('password')}
              placeholder={strings.ENTER_PASSWORD}
              value={password}
            />
            {/* <BorderTextInput
              onChangeText={_onChangeText('referralCode')}
              placeholder={strings.ENTERREFERALCODE}
              value={referralCode}
            /> */}
            <GradientButton
              onPress={onSignup}
              marginTop={moderateScaleVertical(10)}
              btnText={strings.SIGNUP_AN_ACCOUNT}
            />
          </View>
          <View style={styles.bottomContainer}>
            <Text
              style={
                isDarkMode
                  ? {...styles.txtSmall, color: MyDarkTheme.colors.text}
                  : {...styles.txtSmall, color: colors.textGreyLight}
              }>
              {strings.ALREADY_HAVE_AN_ACCOUNT}
              <Text
                onPress={moveToNewScreen(navigationStrings.LOGIN)}
                style={{
                  color: themeColors.primary_color,
                  fontFamily: fontFamily.futuraBtHeavy,
                }}>
                {strings.LOGIN}
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
