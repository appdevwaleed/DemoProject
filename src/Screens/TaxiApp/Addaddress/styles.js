import {StyleSheet} from 'react-native';
import store from '../../../redux/store';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import {useSelector} from 'react-redux';

export default ({
  fontFamily,
  themeColors,
  viewHeight,
  type,
  savedAddressViewHeight,
  avalibleValueInTextInput,
}) => {
  console.log(type, 'type>>>type');
  //   const theme = useSelector((state) => state?.initBoot?.themeColor);
  //   const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  //   const darkthemeusingDevice = useDarkMode();
  //   const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    titleAbout: {
      ...commonStyles.futuraBtHeavyFont14,
      color: colors.textGrey,
      textAlign: 'justify',
    },
    contentAbout: {
      fontSize: textScale(14),
      color: colors.textGreyB,
      fontFamily: fontFamily.medium,
      lineHeight: moderateScaleVertical(20),
      textAlign: 'justify',
    },
    dots: {
      width: 3,
      height: 3,
      backgroundColor: themeColors.primary_color,
      borderRadius: 50,
      marginVertical: 3,
      // marginLeft: 4,
    },
    shadowStyle: {
      height: 10,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.1,
    },
    shadowStyleAndroid: {
      height: 10,
      backgroundColor: '#fff',
      elevation: 7,
    },
    addresssLableName: {
      fontSize: textScale(12),
      color: colors.black,
      fontFamily: fontFamily.medium,
      lineHeight: moderateScaleVertical(20),
      marginLeft: moderateScale(10),
    },
    saveAddressLabel: {
      fontSize: textScale(14),
      color: colors.black,
      fontFamily: fontFamily.semiBold,
      lineHeight: moderateScaleVertical(20),
    },
    address: {
      fontSize: textScale(12),
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
      lineHeight: moderateScaleVertical(20),
      marginLeft: moderateScale(10),
      width: width - 20,
    },
    suggestions: {
      padding: moderateScale(10),
      borderBottomColor: colors.borderColorD,
      borderBottomWidth: 1,
      marginHorizontal: moderateScale(10),
    },
    textGoogleInputContainerAddress: {
      // flexDirection: 'row',
      // flexWrap:'wrap',
      // overflow:'hidden',
      flexDirection: 'row',
      width: width - moderateScale(width / 3.5),

      justifyContent: 'center',
      alignItems: 'center',
    },
    listView: {
      position: 'absolute',
      backgroundColor: colors.white,
      zIndex: 1000, //Forcing it to front
      // marginTop: moderateScaleVertical(-20),
      marginHorizontal: moderateScale(0),
      paddingHorizontal: moderateScale(10),
      width: width,
      alignSelf: 'center',
      // borderWidth: 1,
      // viewHeight,
      top:
        type == 'pickup'
          ? moderateScaleVertical(40) * 2
          : type == 'dropOffLocation'
          ? moderateScaleVertical(28)
          : -100,
      // height: height / 3,
    },

    // textInput2: {

    //   //   backgroundColor: isDarkMode
    //   //     ? MyDarkTheme.colors.background
    //   //     : colors.textGreyK,
    //   //   color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
    // },
    selectAndAddesssView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: moderateScaleVertical(24),
      marginTop: moderateScaleVertical(40),
      paddingHorizontal: moderateScale(24),
    },
    savedAddressText: {
      ...commonStyles.mediumFont16,
      color: themeColors.primary_color,
      fontSize: textScale(12),
    },
    modalMainViewContainer: {
      position: 'absolute',
      marginVertical: 10,

      padding: moderateScale(10),
      marginTop: 48 + 5,
      zIndex: type || avalibleValueInTextInput ? -1000 : 1000,
      top: 80,

      bottom: 0,
      left: 0,
      right: 0,
    },
    savedAddressView: {
      flexDirection: 'row',

      width: width - 30,

      // shadowColor: '#000',
      // shadowOffset: {
      //   width: 0,
      //   height: 7,
      // },
      // elevation: 3,
    },
  });
  return styles;
};
