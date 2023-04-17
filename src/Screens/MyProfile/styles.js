import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const styles = StyleSheet.create({
    containerStyle: {
      paddingVertical: 0,
      height: moderateScaleVertical(58),
      alignItems: 'center',
      borderBottomColor: colors.lightGreyBorder,
      borderBottomWidth: 0.7,
    },
    userProfileView: {
      backgroundColor: colors.backgroundGrey,
      alignSelf: 'center',
      height: moderateScale(100),
      width: moderateScale(100),
      borderRadius: moderateScale(100 / 2),
      borderWidth: moderateScale(5),
      borderColor: colors.white,
      marginTop: moderateScale(20),
    },
    profileImage: {
      height: moderateScale(90),
      width: moderateScale(90),
      borderRadius: moderateScale(100 / 2),
    },
    cameraView: {
      position: 'absolute',
      right: -20,
    },
    userName: {
      fontSize: textScale(13),
      color: colors.textGreyI,
      fontFamily: fontFamily.medium,
    },
    userEmail: {
      marginTop: moderateScaleVertical(5),
      fontSize: textScale(12),
      color: colors.textGreyI,
      fontFamily: fontFamily.regular,
      opacity: 1,
      marginBottom: moderateScaleVertical(14),
    },
    borderRoundBotton: {
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      height: moderateScaleVertical(30),
    },
    topSection: {
      flex: 0.35,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      backgroundColor: colors.backgroundGreyC,
      overflow: 'visible',
      zIndex: 1000,
    },
    bottomSection: {
      flex: 0.8,
      backgroundColor: colors.backgroundGrey,
      zIndex: -10,
    },
    address: {
      fontSize: textScale(10),
      color: colors.textGrey,
      fontFamily: fontFamily.medium,
      lineHeight: moderateScale(20),
      opacity: 0.7,
    },
    textStyle: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      // opacity: 0.6,
    },
    topTextStyle: {
      fontSize: textScale(15),
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      lineHeight: moderateScaleVertical(20),
      marginVertical: moderateScaleVertical(20),
    },
    bottomTextStyle: {
      fontSize: textScale(15),
      color: colors.textGrey,
      fontFamily: fontFamily.regular,
      lineHeight: moderateScaleVertical(20),
      marginVertical: moderateScaleVertical(20),
    },
    referralCode: {
      fontSize: textScale(12),
      color: colors.textGreyC,
      fontFamily: fontFamily.regular,
      lineHeight: moderateScaleVertical(20),
    },
  });
  return styles;
};
