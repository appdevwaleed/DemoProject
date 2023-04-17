import {StyleSheet} from 'react-native';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';

export default ({fontFamily}) => {
  const styles = StyleSheet.create({
    containerStyle: {
      flex: 1,
    },
    renderItemStyle: {
      borderBottomWidth: 0.2,
      borderColor: colors.lightGreyBgColor,
      opacity: 1,
    },
    textStyle: {
      alignSelf: 'center',
      marginStart: moderateScale(12),
      fontFamily: fontFamily.reguler,
    },
    imageStyle: {
      alignSelf: 'center',
    },
  });
  return styles;
};
