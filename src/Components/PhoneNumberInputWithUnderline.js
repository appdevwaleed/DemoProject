import React, {useState} from 'react';
import {
  I18nManager,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import CountryPicker, {Flag} from 'react-native-country-picker-modal';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {TextInput} from 'react-native-paper';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';

export default function PhoneNumberInputWithUnderline({
  cca2 = '',
  callingCode = '',
  onChangePhone =()=>{},
  onCountryChange =()=>{},
  phoneNumber,
  placeholder,
  textInputStyle = {},
  undnerlineColor = colors.transparent,
  labelStyle = {},
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {themeColors, appStyle} = useSelector((state) => state?.initBoot);
  const [state, setState] = useState({
    countryPickerModalVisible: false,
  });

  const fontFamily = appStyle?.fontSizeData;

  const _onCountryChange = (data) => {
    setState({countryPickerModalVisible: false});
    onCountryChange(data);
  };
  const _openCountryPicker = () => {
    setState({countryPickerModalVisible: true});
  };
  const _onCountryPickerModalClose = () => {
    setState({countryPickerModalVisible: false});
  };
  const {countryPickerModalVisible} = state;
  return (
    <View
      style={{
        flexDirection: 'row',

        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.lightDark
          : colors.textGreyK,
        marginTop: moderateScale(20),
        overflow: 'hidden',
        alignItems: 'center',
        ...textInputStyle,
      }}>
      <View>
        <Text
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyB,
            ...labelStyle,
          }}>
          {placeholder}
        </Text>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: moderateScale(70),
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.textGreyK,
            ...textInputStyle,
            marginTop: moderateScaleVertical(10),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 7,
              marginRight: 3,
            }}>
            <Text>+</Text>
            <Text
              style={{
                marginRight: -5,
                fontFamily: fontFamily.regular,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {callingCode}
            </Text>
          </View>

          <View
            style={{
              marginRight: moderateScale(-16),
              marginBottom: 7,
              flexDirection: 'row',
            }}>
            <Flag countryCode={cca2} />
          </View>
          {/* 
          We allow only single country now
          onPress={_openCountryPicker}
          <Image
            style={{tintColor: colors.textGreyB, marginBottom: 10}}
            source={imagePath.dropdownTriangle}
          /> */}
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: undnerlineColor,
            height: StyleSheet.hairlineWidth,

            width: moderateScale(70),
            marginRight: 40,
          }}></View>
      </View>
      <View
        style={{
          width: '88%',
          position: 'absolute',
          start: '25%',
        }}>
        <TextInput
          underlineColor={undnerlineColor}
          selectionColor={
            isDarkMode ? MyDarkTheme.colors.text : colors.textGreyB
          }
          onChangeText={onChangePhone}
          value={phoneNumber}
          theme={{
            colors: {
              primary: undnerlineColor,
              text: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            },
          }}
          keyboardType="numeric"
          style={{
            opacity: 0.7,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.textGreyK,
            height: moderateScaleVertical(40),
            marginTop: moderateScaleVertical(15),
            ...textInputStyle,
          }}
        />
      </View>
      {/* <TextInput
        selectionColor={colors.black}
        placeholder={placeholder}
        keyboardType="numeric"
        value={phoneNumber}
        placeholderTextColor={colors.textGreyOpcaity7}
        onChangeText={onChangePhone}
        style={{
          // flex: 1,
          width: width / 1.57,
          borderLeftWidth: 1,
          fontFamily: fontFamily.medium,
          color: colors.textGrey,
          fontSize: textScale(14),
        }}
      /> */}
      {countryPickerModalVisible && (
        <CountryPicker
          withCallingCode={callingCode}
          cca2={cca2}
          visible={countryPickerModalVisible}
          withFlagButton={false}
          withFilter
          onClose={_onCountryPickerModalClose}
          onSelect={_onCountryChange}
        />
      )}
    </View>
  );
}
