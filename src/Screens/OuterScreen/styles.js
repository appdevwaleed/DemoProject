import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {getColorCodeWithOpactiyNumber} from '../../utils/helperFunctions';

export default ({fontFamily, themeColors}) => {
  const commonStyles = commonStylesFunc({fontFamily});
  const styles = StyleSheet.create({
    header: {
      color: colors.black,
      fontSize: textScale(24),
      fontFamily: fontFamily.bold,
      textAlign: 'center',
    },
    txtSmall: {
      ...commonStyles.mediumFont14,
      lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.medium,
      marginTop: moderateScaleVertical(15),
    },
    socialRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    socialRowBtn: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignSelf: 'center',
      marginTop: moderateScaleVertical(40),
    },
    hyphen: {
      width: 20,
      height: 1,
      backgroundColor: colors.textGrey,
      opacity: 0.6,
    },
    bottomContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: moderateScaleVertical(30),
    },
    guestBtn: {
      marginTop: moderateScaleVertical(20),
      backgroundColor: getColorCodeWithOpactiyNumber(
        themeColors.primary_color.substr(1),
        20,
      ),
      borderWidth: 0,
    },
    orText: {
      ...commonStyles.mediumFont14,
      lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.medium,
      opacity: 0.6,
      marginTop: 0,
      marginHorizontal: moderateScale(16),
    },
  });
  return styles;
};
