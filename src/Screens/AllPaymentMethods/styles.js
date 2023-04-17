import {StyleSheet} from 'react-native';
import { blue100 } from 'react-native-paper/lib/typescript/styles/colors';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
  height
} from '../../styles/responsiveSize';

export default ({ fontFamily, themeColors, isDarkMode, MyDarkTheme }) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    scrollviewHorizontal: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      height: moderateScaleVertical(50),
      flex: undefined,
      borderColor: colors.borderLight,
    },
    headerText: {
      ...commonStyles.mediumFont14,
      marginRight: moderateScale(20),
      alignSelf: 'center',
    },
    packingBoxStyle: {
      height: moderateScaleVertical(120),
      borderRadius: moderateScaleVertical(13),
      borderWidth: 2,
      padding: 5,
      marginVertical: 5,
    },
    caseOnDeliveryView: {
      padding: moderateScaleVertical(5),
      borderRadius: moderateScaleVertical(13),
      // borderWidth: 2,
      // borderColor: colors.borderLight,
      alignItems:'center',
      flexDirection: 'row',
      marginVertical: 5,
      marginTop: moderateScaleVertical(10),
    },
    useNewCartView: {
      padding: moderateScaleVertical(10),
      borderRadius: moderateScaleVertical(13),
      borderWidth: 2,
      borderColor: colors.borderLight,
      flexDirection: 'row',
      marginVertical: 5,
      marginHorizontal: moderateScaleVertical(20),
      marginTop: moderateScaleVertical(15),
    },
    useNewCartText: {
      fontFamily: fontFamily.bold,
      color: colors.walletTextD,
      marginLeft: moderateScaleVertical(100),
      fontSize: moderateScaleVertical(14),
    },
    caseOnDeliveryText: {
      marginHorizontal: moderateScaleVertical(10),
      fontFamily: fontFamily.bold,
      fontSize: textScale(12),
    },
    price: {
      color: colors.textGrey,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
    },
    priceItemLabel: {
      color: colors.textGreyB,
      fontFamily: fontFamily.bold,
      fontSize: textScale(13),
      marginTop: moderateScaleVertical(10),
    },
    dropOff: {
      color: colors.textGreyB,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      marginTop: moderateScaleVertical(40),
    },
    dots: {
      width: 4,
      height: 4,
      backgroundColor: 'grey',
      borderRadius: 50,
      marginVertical: 3,
      marginLeft: 4,
    },
    priceItemLabel2: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    totalPayableView: {
      flexDirection: 'row',
      marginTop: moderateScaleVertical(20),
      paddingVertical: moderateScaleVertical(60),
      justifyContent: 'center',
    },
    totalPayableText: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(14),
      marginLeft: moderateScale(5),
      marginVertical: moderateScaleVertical(2),
    },
    totalPayableValue: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(22),
      marginVertical: moderateScaleVertical(2),
    },
    allIncludedText: {
      color: colors.walletTextD,
      fontFamily: fontFamily.bold,
      marginVertical: moderateScaleVertical(2),
    },
    cardImageView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: moderateScaleVertical(10),
      marginTop: moderateScaleVertical(5),
    },
    masterCardLogo: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
      marginRight: moderateScaleVertical(10),
    },
    //cart item display styles
    cartItemMainContainer: {
      flexDirection: 'row',
      paddingVertical: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(10),
      // backgroundColor: colors.white,
    },
    cartItemImage: {
      height: width / 4.5,
      width: width / 4.5,
      backgroundColor: colors.white,
    },
    cartItemName: {
      fontSize: textScale(15),
      fontFamily: fontFamily.bold,
      marginTop: moderateScaleVertical(5),
      color: colors.black,
      opacity: 0.8,
    },
    cartItemDetailsCon: {
      width: width - width / 4 - 20,
      paddingHorizontal: moderateScale(10),
    },
    cartItemPrice: {
      fontFamily: fontFamily.bold,
      color: colors.cartItemPrice,
      fontSize: textScale(14),
      marginVertical: moderateScaleVertical(8),
    },
    cartItemWeight: {
      color: colors.textGreyB,
    },
    cartItemWeight2: {
      color: colors.textGreyB,
      fontSize: moderateScaleVertical(11),
    },
    imageStyle: {
      height: width / 4.5,
      width: width / 4.5,
      borderRadius: moderateScale(8)
    },
    itemPriceDiscountTaxView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: moderateScaleVertical(4),
    },
    bottomTabLableValue: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    amountPayable: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(8),
    },
  paymentMethodBox:{
    borderWidth: 2,
    borderRadius: moderateScale(8),
    borderColor: themeColors.primary_color,
    marginVertical:
      Platform.OS === 'ios'
        ? moderateScaleVertical(1)
        : moderateScaleVertical(1),
    marginHorizontal: moderateScale(10),
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
  },
  paymentView: {
    marginVertical:
      Platform.OS === 'ios'
        ? moderateScaleVertical(16)
        : moderateScaleVertical(26),
    marginHorizontal: moderateScale(10),
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
  },
  placeOrderButtonStyle: {
    backgroundColor: themeColors.primary_color,
    flex: 1,
    marginHorizontal: moderateScale(5),
  },
  });
  return styles;
};
