import {StyleSheet,Platform} from 'react-native';
import store from '../../../redux/store';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  StatusBarHeight,
  StatusBarHeightSecond,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {getColorCodeWithOpactiyNumber} from '../../../utils/helperFunctions';

export default ({fontFamily, themeColors}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    titleAbout: {
      ...commonStyles.futuraBtHeavyFont14,
      color: colors.textGrey,
      textAlign: 'justify',
    },
    offersViewB: {
      marginHorizontal: moderateScale(20),
      // backgroundColor: getColorCodeWithOpactiyNumber(
      //   themeColors.primary_color.substr(1),
      //   20,
      // ),
      paddingVertical: moderateScaleVertical(15),
      paddingHorizontal: moderateScaleVertical(10),
      marginVertical: moderateScaleVertical(10),
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewOffers: {
      color: themeColors.primary_color,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      paddingRight: moderateScale(5),
    },
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      height: height / 1.8,
    },

    searchbar: {
      height: moderateScale(40),
      width: moderateScale(width / 3),
      borderRadius: moderateScale(16),
      backgroundColor: colors.white,
      alignItems: 'center',
      // justifyContent: 'center',
      flexDirection: 'row',
    },
    topView: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 10,
      flexDirection: 'row',
      marginHorizontal: moderateScale(20),
      // marginVertical: moderateScaleVertical(20),
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    topView2: {
      flexDirection: 'row',
      marginHorizontal: moderateScale(20),
      marginVertical: moderateScaleVertical(20),
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    bottomView: {
      backgroundColor: colors.white,
      // borderTopLeftRadius: moderateScale(25),
      // borderTopRightRadius: moderateScale(25),
      overflow: 'hidden',
      height: height ,
      width: width,
    },
    bottomView3: {
      backgroundColor: colors.white,
      borderRadius: moderateScale(25),
      overflow: 'hidden',
      height: height / 2.5,
      maxHeight: height / 2.5,
      width: width,
    },
    addressMainTitle: {
      fontSize: textScale(16),
      color: colors.blackC,
      fontFamily: fontFamily.bold,
    },
    addressMain: {
      fontSize: textScale(14),
      color: colors.blackC,
      fontFamily: fontFamily.regular,
    },
    chooseSuitable: {
      fontSize: textScale(14),
      color: colors.blackC,
      fontFamily: fontFamily.bold,
      textAlign: 'center',
    },
    carType: {
      fontSize: textScale(12),
      color: colors.black,
      fontFamily: fontFamily.bold,
    },
    carType2: {
      fontSize: textScale(14),
      color: colors.textGreyJ,
      fontFamily: fontFamily.medium,
    },
    packageSize: {
      fontSize: textScale(12),
      color: colors.blackC,
      fontFamily: fontFamily.regular,
    },
    deliveryPrice: {
      fontSize: textScale(12),
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
    },
    priceStyle: {
      fontSize: textScale(16),
      color: colors.blackC,
      fontFamily: fontFamily.regular,
    },
    distanceDurationDeliveryLable: {
      fontSize: textScale(12),
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
    },
    distanceDurationDeliveryValue: {
      fontSize: textScale(14),
      color: colors.blackC,
      fontFamily: fontFamily.regular,
    },
    bottomAcceptanceText: {
      fontSize: textScale(12),
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
      textAlign: 'center',
      // marginTop: moderateScaleVertical(5),
    },
    modalContainer: {
      marginHorizontal: 0,
      marginVertical: 0,
      // backgroundColor: colors.white,
      borderRadius: 0,
      // backgroundColor: 'red',
    },
    status: {
      textAlign: 'left',
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
      fontSize: textScale(16),
    },
    addressStyle: {
      textAlign: 'left',
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
    },
    orderDetailLabel: {
      textAlign: 'left',
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    orderDetailValue: {
      textAlign: 'left',
      color: colors.blackC,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    noCarsAvailable: {
      textAlign: 'left',
      color: colors.blackC,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
    },
    plainView: {
      alignItems: 'center',
      justifyContent: 'center',
      width: moderateScale(100),

      backgroundColor: colors.textGreyLight,

      left: 20,
      height: moderateScaleVertical(30),
    },
    pickupDropOff: {
      textAlign: 'center',
      color: colors.white,
      fontFamily: fontFamily.bold,
      fontSize: textScale(12),
    },
    pickupDropOffAddress: {
      textAlign: 'left',
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
    },
    absolute: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      height: moderateScale(40),
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: moderateScale(16),
    },
    backButtonView: {
      height: moderateScale(40),
      width: moderateScale(40),
      borderRadius: moderateScale(15),
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: moderateScaleVertical(20),
    },
    mainViewStyleTime: {
      height: height / 1.9,
      alignSelf: 'center',
      width: width - moderateScale(40),
      borderRadius: 15,
      overflow: 'hidden',
      paddingTop: 0,
    },
    mainViewStyle: {
      height: height / 1.9,
      alignSelf: 'center',
      width: width - moderateScale(40),
      borderRadius: 15,
      overflow: 'hidden',
      paddingTop: 0,
    },
    mainViewStyleDate: {
      height: height / 1.4,
      alignSelf: 'center',
      width: width - moderateScale(40),
      borderRadius: 15,
      overflow: 'hidden',
      paddingTop: 0,
    },
    paymentMainView: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: moderateScaleVertical(20),
      paddingVertical: moderateScaleVertical(10),
      backgroundColor: colors.lightGreyBgB,
    },
    selectedMethod: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(13),
      marginLeft: moderateScale(10),
    },
    dataBoxStyle:{
      flexDirection : "column",
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: moderateScale(10),
      borderColor: '#d9d9d9',
      borderRadius: 7,
      borderWidth: 1,
      flex: .3,
      // shadowColor: 'black',
      // shadowOpacity: 0.8,
      // shadowOffset: {
      // width: 1,
      // height: 1
      // },
      // shadowRadius: 10, // <- Radius of the shadow
      // borderRadius: 8,
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
     
      // ...Platform.select({
      //   ios: {
      //     shadowColor: '#000',
      //     shadowOffset: {width: 1, height: 3},
      //     shadowOpacity: 0.2,
      //   },
      //   android: {
      //     elevation: 1,
      //   }})
    },
    dataBoxLableStyle: {
      fontSize: textScale(12),
      color: themeColors.primary_color,
      fontFamily: fontFamily.regular,
      marginVertical: moderateScaleVertical(6),
    },
    dataBoxLableSecondStyle: {
      fontSize: textScale(15),
      color: colors.black,
      fontFamily: fontFamily.regular,
      marginVertical: moderateScaleVertical(12),
    },
    dataBoxImageStyle:{
     marginTop: moderateScaleVertical(8)
    },
  });
  return styles;
};
