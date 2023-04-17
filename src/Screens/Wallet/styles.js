import {StyleSheet} from 'react-native';
import {color} from 'react-native-reanimated';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import commonStylesFun from '../../styles/commonStyles';

export default ({fontFamily, themeColors}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    availableBalanceCon: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingBottom: moderateScale(10),
      backgroundColor: colors.white,
    },
    balanceCon: {
      // flexDirection:'row',
      flex: 0.6,
      paddingLeft: moderateScale(10),
      paddingTop: moderateScale(10),
    },
    availableBalanceText: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(12),
      color: colors.textGreyB,
    },
    availableBalanceValue: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(17),
      marginVertical: moderateScaleVertical(7),
    },
    addMoneyCon: {
      flex: 0.4,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    addMoneybtn: {
      width: moderateScale(100),
      backgroundColor: themeColors?.primary_color,
      padding: moderateScaleVertical(10),
      marginHorizontal: moderateScaleVertical(10),
      borderRadius: moderateScale(20),
      marginTop: moderateScale(18),
      justifyContent: 'center',
      flexDirection: 'row',
    },
    addMoneyText: {
      fontSize: moderateScale(12),
      fontFamily: fontFamily.medium,
      color: themeColors?.secondary_color,
    },
    cartItemLine: {
      height: 0.5,
      backgroundColor: colors.borderLight,
      marginBottom: moderateScaleVertical(2),
      // marginVertical:moderateScaleVertical(10)
    },
    transactionHistoryCon: {
      flexDirection: 'row',
      paddingVertical: moderateScaleVertical(10),
      backgroundColor: colors.transactionHistoryBg,
      // justifyContent: 'center',
      paddingLeft: moderateScale(10),
    },
    transactionHistoryText: {
      fontFamily: fontFamily.medium,
    },
    addMoneyListDesc: {
      // height: 60,
    //  flex: 0.6,
      flex: 0.8,
      paddingTop: moderateScale(2),
      paddingLeft: moderateScale(10),
    },
    addedText: {
      fontFamily: fontFamily.medium,
      color: colors.walletTextD,
      fontSize: moderateScale(13),
      marginLeft: moderateScaleVertical(15),
    },
    addedMoneyValue: {
      fontFamily: fontFamily.medium,
    },
    addedMoneyValueCon: {
      // height: 60,
      flex: 0.2,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingRight: moderateScale(10),
      paddingVertical: moderateScaleVertical(8),
    },
    addedMoneyTime: {
      textAlign: 'right',
      fontSize: moderateScale(12),
      fontFamily: fontFamily.medium,
      color: colors.walletTimeG,
      marginTop: moderateScale(5),
    },
    addedMoneyMonth: {
      textAlign: 'right',
      fontSize: moderateScale(13),
      fontFamily: fontFamily.medium,
      color: colors.walletTextD,
    },
    addedMoneyTimeCon: {
      // height: 60,
      flex: 0.2,
      justifyContent: 'center',
    },
  });
  return styles;
};
