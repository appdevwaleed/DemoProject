import React, {useState} from 'react';

import {Image, Text, TouchableOpacity, View, I18nManager,StyleSheet } from 'react-native';
import {useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {moderateScaleVertical, moderateScale, width} from '../styles/responsiveSize';
import commonStylesFunc from '../styles/commonStyles';
import {MyDarkTheme} from '../styles/theme';
import Header from './Header';
import strings from '../constants/lang';
import validations from '../utils/validations';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import actions from '../redux/actions';
import {
  showSuccess,
  showError,
  otpTimerCounter,
} from '../utils/helperFunctions';

export default function OtpModal({
  isVisible = false,
  phoneNumber,
  callingCode,
  type,
  
  onClose,
  saveClick,
  timerStart=30,  
  transistionIn = 200,
  mainViewStyle = {},
  
  
}) {
  const styles = stylesData();
  const appData = useSelector((state) => state?.initBoot?.appData);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const userData = useSelector((state) => state?.auth?.userData);
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  
  const [phoneOtp, setPhoneOtp] = React.useState('');
  const [emailOtp, setEmailOtp] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false)
  const [timer2, setTimer2] = useState(timerStart);

  React.useEffect(() => {
    let timerId2;
    if (timer2 > 0) {
      timerId2 = setTimeout(() => {
        setTimer2(timer2 - 1)
      }, 1000);
    }
    return () => {
      if (timerId2) clearTimeout(timerId2);
    };
  }, [timer2]);

  const otpView = (type, value) => {
    return (
      <SmoothPinCodeInput
        containerStyle={{
          alignSelf: 'center',
          marginTop: moderateScale(20),
        }}
        // password
        mask={
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 25,
              backgroundColor: 'blue',
            }}></View>
        }
        cellSize={width / 10}
        codeLength={6}
        cellSpacing={10}
        editable={true}
        cellStyle={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: 'gray',
        }}
        cellStyleFocused={{
          borderColor: 'black',
        }}
        textStyle={{
          fontSize: 24,
          color: colors.textBlue,
        }}
        textStyleFocused={{
          color: colors.textBlue,
        }}
        // autoCapitalize={'none'}
        inputProps={{
          autoCapitalize: 'none',
        }}
        value={type}
        autoFocus={false}
        keyboardType={'numeric'}
        onTextChange={(val) => setPhoneOtp(val)}
        // onFulfill={(code) => onVerify(type, code)}
      />
    );
  };
  const onVerify = (type, otp) => {
    const checkValid = isValidData(otp);
    if (!checkValid) {
      return;
    }
    let data = {};
    data['type'] = type;
    data['otp'] = otp;
    if (type == 'phone') {
      data['phone_number'] = phoneNumber;
    }
    setIsLoading(true);
    actions
      .verifyAccount(data, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        showSuccess(res.message);
        if (res && res?.status == 'Success') {
          if (
            res?.data?.client_preference?.verify_phone
          ) {
            if (
              res?.data?.verify_details?.is_phone_verified
            ) {
              saveClick()
            }
          } else if (res?.data?.client_preference?.verify_phone) {
            if (res?.data?.verify_details?.is_phone_verified) {
              saveClick()
            }
          }
        }
        setIsLoading(false);
      })
      .catch(errorMethod);
  };
  const isValidData = (otp) => {
    const error = validations({
      otp,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };
  const resendOtpData=()=>{
    let data = {};
      data['phone_number'] = phoneNumber;
      data['dial_code'] = callingCode;
      data['type'] = type;
      setIsLoading(true);
    actions
      .resendOTP(data, {
        code: appData?.profile?.code,
      })  
      .then((res) => {
        showSuccess(res.message);
          setTimer2(30);
          setPhoneOtp('');
          setIsLoading(false);
      })
      .catch(errorMethod);
  }
 
  const errorMethod = (error) => {
    setIsLoading(false)
    showError(error?.message || error?.error);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      backdropTransitionInTiming={transistionIn}
      style={[styles.modalStyle]}>
      <View
        style={{
          // flex: 1,
          backgroundColor: colors.white,
          borderRadius: 15,
          paddingTop: moderateScaleVertical(30),
          ...mainViewStyle,
        }}>
        <View
                  style={{
                    marginTop: moderateScaleVertical(40),
                    marginHorizontal: moderateScale(20),
                  }}>
                  <Text
                    style={
                      isDarkMode
                        ? [styles.header, {color: MyDarkTheme.colors.text}]
                        : styles.header
                    }>
                    {strings.VERIFY_PHONE_NUMBER}
                  </Text>
                  <Text
                    style={
                      isDarkMode
                        ? [styles.txtSmall, {color: MyDarkTheme.colors.text}]
                        : styles.txtSmall
                    }>
                    {strings.ENTER_CODE_SENT_TO_MOBILE}
                  </Text>
        </View>
        <View
          style={{
            marginHorizontal: moderateScale(20),
            marginTop: moderateScale(20),
          }}>
      
          {otpView(phoneOtp, 'phoneOtp')}
          <View style={{marginVertical: 10}}>
            {timer2 > 0 ? (
              <Text
                style={{
                  ...styles.txtSmall,
                  color: colors.textGreyLight,
                }}>
                {strings.RESEND_CODE_IN}
                <Text
                  style={{
                    color: themeColors.primary_color,
                    fontFamily: fontFamily.bold,
                  }}>
                  {`${otpTimerCounter(timer2)} sec`}
                </Text>
              </Text>
            ) : (
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.didintRecieveCode,
                        {color: MyDarkTheme.colors.text},
                      ]
                    : styles.didintRecieveCode
                }>
                {strings.DONT_RECEIVE_CODE}{' '}
                <Text
                  onPress={() => resendOtpData('phone')}
                  style={styles.resend}>
                  {strings.RESEND}
                </Text>
              </Text>
            )}

            <View style={styles.verifyView}>
              <TouchableOpacity
                style={[
                  styles.btnPhoneSecond,
                  {
                    backgroundColor: !userData?.verify_details
                      ?.is_phone_verified
                      ? themeColors.primary_color
                      : colors.white,
                  },
                ]}
                onPress={() => onVerify('phone', phoneOtp)}>
                {/* onPress={() => sendOTP('phone')}> */}
                <Text
                  numberOfLines={2}
                  style={[
                    styles.phonebtnText,
                    {
                      color: !userData?.verify_details
                        ?.is_phone_verified
                        ? colors.white
                        : colors.green,
                    },
                  ]}>
                  {!userData?.verify_details?.is_phone_verified
                    ? strings.VERIFY_CAPITAL
                    : strings.VERIFIED}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}


export function stylesData(params) {
  const {themeColors, appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});


  const styles = StyleSheet.create({
    modalStyle: {
      marginHorizontal: moderateScaleVertical(20),
      marginVertical: moderateScaleVertical(50),
      // backgroundColor: colors.white,
      borderRadius: 15,
    },
    header: {
      color: colors.black,
      fontSize: moderateScale(24),
      fontFamily: fontFamily.bold,
      textAlign: 'center',
    },
    txtSmall: {
      ...commonStyles.mediumFont14,
      // lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.medium,
      // marginVertical: moderateScaleVertical(15),
    },
    inputContainer:{
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: colors.borderLight,
      height: moderateScale(49),
      borderRadius: 49 / 2,
    },
    textInputContainer:{
      flex: 0.75,
      flexDirection: 'row',
      paddingHorizontal: 15,
      height: moderateScale(47),
      borderTopLeftRadius: 47 / 2,
      borderBottomLeftRadius: 47 / 2,
      alignItems: 'center',
    },
    txtSmall: {
      ...commonStyles.mediumFont14,
      // lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.medium,
      // marginVertical: moderateScaleVertical(15),
    },
  });
  return styles;
}




