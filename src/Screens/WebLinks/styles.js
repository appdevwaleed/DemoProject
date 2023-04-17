import {I18nManager, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import {useSelector} from 'react-redux';

export default ({fontFamily}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const styles = StyleSheet.create({
    addMoneyTopCon: {
      paddingHorizontal: moderateScaleVertical(15),
      paddingVertical: moderateScaleVertical(20),
      backgroundColor: colors.white,
    },
    addMoneyInputField: {
      borderBottomWidth: 0.5,
      paddingLeft: moderateScaleVertical(14),
      paddingVertical: moderateScaleVertical(8),
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    inputAmountText: {
      fontFamily: fontFamily.bold,
      color: colors.walletTextD,
    },
    currencySymble: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(17),
    },
    selectAmountCon: {
      borderWidth: 0.5,
      width: 105,
      padding: moderateScale(10),
      marginHorizontal: moderateScaleVertical(10),
      marginTop: moderateScaleVertical(8),
      borderRadius: 3,
      justifyContent: 'center',
      flexDirection: 'row',
      borderColor: colors.walletTimeG,
    },
    chooseAddMoney: {
      // fontFamily:fontFamily.regular
    },
    title: {
      fontFamily: fontFamily.medium,
      fontSize: moderateScale(16),
      color: colors.textGreyJ,
      paddingLeft: moderateScale(10),
    },
    debitFrom: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(16),
      color: colors.blackC,
    },
    bottomButtonStyle: {
      position: 'absolute',
      bottom: 10,
      left: 20,
      right: 20,
    },
    title2: {
      fontFamily: fontFamily.medium,
      fontSize: moderateScale(16),
      color: colors.blackC,
    },
    containerStyle: {
      borderRadius: 8,
      height: moderateScaleVertical(44),
      marginBottom: moderateScaleVertical(14),
    },
    uploadImage: {
      fontSize: textScale(12),
      fontFamily: fontFamily.bold,
      color: colors.textGreyD,
    },
    imageOrderStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDarkMode ? MyDarkTheme.colors.text : colors.borderLight,
      marginHorizontal: moderateScale(12),
      height: height / 6,
    },
    imageStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      resizeMode: 'contain',
      borderColor: isDarkMode ? MyDarkTheme.colors.text : colors.borderLight,
    },
    viewOverImage: {
      height: width / 5,
      width: width / 5,

      resizeMode: 'contain',
    },
    imageView: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      height: height / 6,
      marginHorizontal: moderateScale(12),

      borderColor: isDarkMode ? MyDarkTheme.colors.text : colors.borderLight,
    },
    crossIconStyle: {
      position: 'absolute',
      top: 25,
      right: 30,
    },
    detailStyle: {
      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
      fontSize: textScale(18),
      fontFamily: fontFamily.medium,
    },
    uploadText: {
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: moderateScaleVertical(12),
      fontFamily: fontFamily.medium,
      color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyOpcaity7,
    },
  });
  return styles;
};
