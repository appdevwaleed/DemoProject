import {callingCodes} from 'country-data';
import React, {useState} from 'react';
import {
  I18nManager,
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import CountryPicker, {Flag} from 'react-native-country-picker-modal';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {moderateScale, textScale, width} from '../styles/responsiveSize';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';

export default function PhoneNumberInput({
  cca2 = '',
  callingCode = '',
  onChangePhone = ()=>{},
  onCountryChange = ()=>{},
  phoneNumber,
  placeholder,
  containerStyle,
  color,
  autoFocus = false,
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    countryPickerModalVisible: false,
  });

  const {appStyle} = useSelector((state) => state?.initBoot);

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
        borderWidth: 1,
        borderRadius: 13,
        borderColor: isDarkMode ? MyDarkTheme.colors.text : colors.borderLight,
        height: moderateScale(49),
        ...containerStyle,
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: moderateScale(88),
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text> +</Text>
          <Text
            style={{
              fontFamily: fontFamily.medium,
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.textGreyOpcaity7,
            }}>
            {callingCode}
          </Text>
        </View>

        <View style={{marginRight: moderateScale(-10)}}>
          <Flag countryCode={cca2} />
        </View>

      {/*
        We allow only single country now

       <Image source={imagePath.dropdownTriangle} />
        onPress={_openCountryPicker}     */}
      </TouchableOpacity>
      <TextInput
        selectionColor={colors.black}
        placeholder={placeholder}
        keyboardType="numeric"
        value={phoneNumber}
        placeholderTextColor={
          isDarkMode ? MyDarkTheme.colors.text : colors.textGreyOpcaity7
        }
        onChangeText={onChangePhone}
        style={{
          // flex: 1,
          width: width / 1.57,
          borderLeftWidth: 1,
          fontFamily: fontFamily.medium,
          color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
          fontSize: textScale(14),
          borderLeftColor: colors.borderLight,
          opacity: 0.7,
          paddingTop: 0,
          paddingBottom: 0,
          marginVertical: 8,
          paddingHorizontal: 10,
          textAlign: I18nManager.isRTL ? 'right' : 'left',
        }}
        autoFocus={autoFocus}
      />
      {countryPickerModalVisible && (
        <CountryPicker
          withCallingCode={callingCode}
          cca2={cca2}
          visible={countryPickerModalVisible}
          withFlagButton={false}
          withFilter
          onClose={_onCountryPickerModalClose}
          onSelect={_onCountryChange}
          closeButtonImage={imagePath.closeButton}
        />
      )}
    </View>
  );
}
