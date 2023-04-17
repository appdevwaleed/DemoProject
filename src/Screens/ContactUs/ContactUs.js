import React, {useEffect, useState} from 'react';
import {Image, View,TouchableOpacity,Linking,Button,Pressable} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {showError, showSuccess} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import Communications from 'react-native-communications';
import navigationStrings from '../../navigation/navigationStrings';
import BorderTextArea from "../../Components/BorderTextArea"
export default function ContactUs({navigation}) {
  console.log("ContactUs - ContactUs.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const {appData, currencies, languages, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  console.log(appData.profile,"THIS IS MY CONTACT US")
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const currentTheme = useSelector((state) => state.appTheme);
  const userData = useSelector((state) => state?.auth?.userData);
  const [state, setState] = useState({
    callingCode: appData?.profile?.country?.phonecode
      ? appData?.profile?.country?.phonecode
      : 'UAE',
    cca2: appData?.profile?.country?.code
      ? appData?.profile?.country?.code
      : '971',
    name: userData && userData?.name ? userData?.name : '',
    email: userData && userData?.email ? userData?.email : '',
    phoneNumber:
      userData && userData?.phone_number ? userData?.phone_number : '',
    message: '',
    isLoading: false,
  });

  const {message, phoneNumber, cca2, name, email, isLoading, callingCode} =
    state;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFun({fontFamily});
  //Update states
  const updateState = (data) => setState((state) => ({...state, ...data}));
  useEffect(() => {
    updateState({
      cca2: appData?.profile?.country?.code
        ? appData?.profile?.country?.code
        : 'UAE',
      callingCode: appData?.profile?.country?.phonecode
        ? appData?.profile?.country?.phonecode
        : '971',
    });
  }, [appData]);
  //select the country
  const _onCountryChange = (data) => {
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };

  // on change text
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  //validate form
  const isValidData = () => {
    const error = validations({
      email: email,
      name: name,
      phoneNumber: phoneNumber,
      message: message,
      callingCode: callingCode,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };
  //Save user info
  const saveUserInfo = () => {
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }
    // else if(message==''){
    //   return showError('Enter message')
    // }
    let data = {
      name: name,
      email: email,
      phone_number: '+' + callingCode + phoneNumber,
      message: message,
      callingCode: callingCode,
    };

    updateState({
      isLoading: true,
    });
    actions
      .contactUs(data, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        updateState({
          isLoading: false,
        });
        showSuccess(res?.message);
        navigation.goBack();
      })
      .catch((err) => {
        console.log(err, 'err>>>');
        updateState({
          isLoading: false,
        });
        showError(err?.message || err?.error);
      });
  };

  // Basic information tab
  const basicInfoView = () => {
    return (
      <View
        style={{
          marginTop: moderateScaleVertical(40),
          marginHorizontal: moderateScale(24),
        }}>
        <BorderTextInput
          onChangeText={_onChangeText('name')}
          placeholder={strings.YOUR_NAME}
          value={name}
        />
        <BorderTextInput
          onChangeText={_onChangeText('email')}
          placeholder={strings.YOUR_EMAIL}
          value={email}
          keyboardType={'email-address'}
        />
        <PhoneNumberInput
          onCountryChange={_onCountryChange}
          placeholder={strings.YOUR_PHONE_NUMBER}
          onChangePhone={(phoneNumber) =>
            updateState({phoneNumber: phoneNumber.replace(/[^0-9]/g, '')})
          }
          cca2={cca2}
          phoneNumber={phoneNumber}
          callingCode={callingCode}
          keyboardType={'number-pad'}
          returnKeyType={'done'}
          color={isDarkMode ? MyDarkTheme.colors.text : null}
        />
        <View style={{height: moderateScaleVertical(20)}} />
        <BorderTextArea
          onChangeText={_onChangeText('message')}
          placeholder={strings.MESSSAGE_FOR_US}
          value={message}
          containerStyle={{height: moderateScaleVertical(108), padding: 5}}
          // textInputStyle={{height:moderateScaleVertical(108)}}
          textAlignVertical={'top'}
          multiline={true}
        />
        <GradientButton
          textStyle={styles.textStyle}
          onPress={saveUserInfo}
          marginTop={moderateScaleVertical(50)}
          marginBottom={moderateScaleVertical(50)}
          btnText={strings.SUBMIT}
        />
      </View>
    );
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          imagePath.icBackb
        }
        centerTitle={strings.CONTACT_USS}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      <View style={{...commonStyles.headerTopLine}} />
      {/* top section user general info */}
      <KeyboardAwareScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <View style={styles.userProfileView}>
            <Image source={imagePath.contactIllustration} />
          </View>
        </View>
        <View style={styles.callImageContainer}>
       
                <Pressable
                  onPress={() =>
                    appData?.profile?.contact_phone_number
                      ? Communications.phonecall(
                        appData?.profile?.contact_phone_number,
                          true,
                        )
                      : console.log()
                  }>
                  <Image source={isDarkMode
            ? imagePath?.callDark :  imagePath?.call} />
                </Pressable>
                <Pressable
                  hitSlop ={10}
                  onPress={() =>
                    // appData?.profile?.contact_email
                    //   ? Communications.email(
                    //     [appData?.profile?.contact_email],
                    //      [ appData?.contact_email],null,null,null
                    //     )
                    //   : console.log()
                   { if(appData?.profile?.contact_email)
                          {
                            console.log('I HAVE DATA TO OPEN MAIL')
                            Linking.openURL(`mailto:${appData?.profile?.contact_email}`)
                          } 
                    else {
                      console.log('No Data')
                    }  
                  }
                  }>
                  <Image source={ isDarkMode
            ?imagePath?.messageDark : imagePath.message} />
                </Pressable>
                {/* <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(navigationStrings.CHAT_BOT)
                  }>
                  <Image source={imagePath?.message} />
                </TouchableOpacity> */}
          </View>
        <View style={styles.bottomSection}>{basicInfoView()}</View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
