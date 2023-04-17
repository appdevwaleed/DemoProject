import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const styles = StyleSheet.create({
    detectLocation: {
      color: colors.black,
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(13),
      // textAlign: 'center',
      opacity: 0.8,
    },
    listView: {
      position: 'absolute',
      backgroundColor: colors.white,
      zIndex: 1000, //Forcing it to front
      marginTop: moderateScaleVertical(40),
      marginHorizontal: moderateScale(10),
    },
    textInputContainer: {
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScaleVertical(10),
      height: moderateScaleVertical(40),
      backgroundColor: colors.red,
    },
    predefinedPlacesDescription: {
      color: colors.themeColor,
    },
    textInput: {
      color: '#5d5d5d',
      fontSize: 16,
      fontFamily: fontFamily.medium,
      color: colors.textGreyOpcaity7,
    },
    useCurrentLocationView: {
      backgroundColor: 'transparent',
      alignItems: 'center',
      flexDirection: 'row',
      marginHorizontal: moderateScale(15),
      marginTop: moderateScaleVertical(70),
    },
  });
  return styles;
};
