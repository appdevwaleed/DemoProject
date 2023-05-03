//import {BluetoothManager} from '@brooons/react-native-bluetooth-escpos-printer';
import React, {useState} from 'react';
import {
  Alert,
  I18nManager,
  Image,
  Platform,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../Components/Header';
import ListItemHorizontal from '../../Components/ListItemHorizontalWithImage';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import type_codes from '../../redux/types';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  getRandomColor,
} from '../../utils/helperFunctions';
import stylesFun from './styles';
import {removeItem} from '../../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Account3({navigation}) {
  console.log("Account - Account3.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const dispatcher = useDispatch();
  const {themeColors, appStyle, appData, shortCodeStatus} = useSelector(
    (state) => state?.initBoot,
  );

  const businessType = appStyle?.homePageLayout;
  const [state, setState] = useState({
    isLoading: false,
  });

  const [isVisible, setIsVisible] = useState(false);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});

  //Navigation to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const userData = useSelector((state) => state.auth.userData);
  const appMainData = useSelector((state) => state?.home?.appMainData);

  
  console.log(userData);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     _scrollRef.current.scrollTo(0);
  //   }, []),
  // );

  //Share your app
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Check out Runrun https://play.google.com/store/apps/details?id=com.deliveryzone.runrun Use My refereral Code' +
          (userData?.refferal_code && userData?.refferal_code != '' ? userData?.refferal_code : '') + '',
       // url: 'https://play.google.com/store/apps/details?id=com.udemy.android',
      });
      console.log(result);
      if (result.action === Share.sharedAction) {
        console.log('Shared Action Called');
        if (result.activityType) {
          console.log('Shared Action Called Activity Type');
        } else {
          console.log('Shared Action Called Activity Type Else');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Dismissed Shared Action ');
      }
    } catch (error) {
      console.log(' Shared Action error',error);
      alert(error.message);
    }
  };
  //Logout function
  const userlogout = () => {
    if (!!userData?.auth_token) {
      Alert.alert('', strings.LOGOUT_SURE_MSG, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {
          text: strings.CONFIRM,
          onPress: () => {
            
            dispatcher({type:type_codes.CART_ITEM_COUNT, payload:{}});
            dispatcher({type:type_codes.SELECTED_ADDRESS, payload:null});
            dispatcher({type:type_codes.STORE_SELECTED_VENDOR, payload:{}});
            dispatcher({type:type_codes.PRODUCT_LIST_DATA, payload:[]});
            dispatcher({type:type_codes.WALLET_DATA, payload:null});
            dispatcher({type:type_codes.PRODUCT_DETAIL, payload:{}});
            dispatcher({type:type_codes.USER_LOGOUT});
            removeItem('userData');
            removeItem('cartItemCount');
            removeItem('saveUserAddress');
            removeItem('walletData');
            removeItem('saveSelectedAddress');
            removeItem('isLoggedInDevice');
            removeItem('isLoggedInDevice');
            
            // actions.userLogout();
            moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
            
          },
        },
      ]);
    } else {
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
    }
  };

  const usernameFirstlater = !!userData?.name && userData?.name?.charAt(0);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        {/* <StatusBar
        backgroundColor={
          isDarkMode
            ? MyDarkTheme.colors.background
            : getColorCodeWithOpactiyNumber(
                themeColors.primary_color.substr(1),
                20,
              )
        }
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      /> */}
        {shortCodeStatus ? (
          <Header
            noLeftIcon={false}
            customLeft={() => (
              <Text
                onPress={() =>
                  navigation.push(navigationStrings.SHORT_CODE, {
                    shortCodeParam: true,
                  })
                }
                style={{
                  color: themeColors.primary_color,
                  fontFamily: fontFamily.bold,
                }}>
                {strings.EDITCODE}
              </Text>
            )}
            // rightIcon={imagePath.cartShop}
            //   centerTitle={strings.MY_ACCOUNT}
          />
        ) : (
          <Header centerTitle={strings.MY_ACCOUNT} noLeftIcon={true} />
        )}

        {/* <View style={{...commonStyles.headerTopLine}} /> */}

        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          {!!userData?.auth_token && (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={moveToNewScreen(navigationStrings.MY_PROFILE)}
                style={{
                  marginHorizontal: moderateScale(24),
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: moderateScaleVertical(35),
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.white,
                  paddingVertical: moderateScaleVertical(12),
                  borderRadius: 12,
                }}>
                {userData?.source ? (
                  <FastImage
                    source={
                      userData?.source?.image_path
                        ? {
                            uri: getImageUrl(
                              userData?.source?.proxy_url,
                              userData?.source?.image_path,
                              '200/200',
                            ),
                          }
                        : userData?.source
                    }
                    style={{
                      height: moderateScale(46),
                      width: moderateScale(46),
                      borderRadius: moderateScale(12),
                      marginHorizontal: moderateScale(15),
                      backgroundColor: colors.blackOpacity10,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      backgroundColor: getRandomColor(),
                      height: moderateScale(46),
                      width: moderateScale(46),
                      borderRadius: moderateScale(12),
                      marginHorizontal: moderateScale(15),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: textScale(20),
                        textTransform: 'uppercase',
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.blackB,
                      }}>
                      {usernameFirstlater}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: 'column',
                    marginHorizontal: moderateScale(25),
                  }}>
                  <Text
                    style={{
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyJ,
                      fontFamily: fontFamily.medium,
                      fontSize: textScale(14),
                    }}>
                    {userData?.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fontFamily.regular,
                      fontSize: textScale(14),
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyJ,
                      marginTop: moderateScaleVertical(5),
                    }}>
                    {userData?.email}
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  marginTop: moderateScale(30),
                }}></View>
            </>
            // <ListItemHorizontal
            //   centerContainerStyle={{flexDirection: 'row'}}
            //   leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            //   onPress={moveToNewScreen(navigationStrings.MY_PROFILE)}
            //   iconLeft={imagePath.icProfile}
            //   centerHeading={strings.MY_PROFILE}
            //   containerStyle={styles.containerStyle}
            //   iconRight={imagePath.goRight}
            //   rightIconStyle={{tintColor: colors.textGreyLight}}
            //   centerHeadingStyle={{fontSize: textScale(15)}}
            // />
          )}
          {/* {!!userData?.auth_token && (
          <TouchableOpacity style={{flex: 0.1}}>
            <Image
              source={imagePath.myOrder}
              style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
            />
          </TouchableOpacity>
        )} */}
          {!!userData?.auth_token &&
            (businessType == 4 ? null : (
              <ListItemHorizontal
                centerContainerStyle={{flexDirection: 'row'}}
                leftIconStyle={{flex: 0.1, alignItems: 'center'}}
                onPress={moveToNewScreen(navigationStrings.MY_ORDERS,{ fromCart : false})}
                iconLeft={imagePath.myOrder2}
                centerHeading={strings.MY_ORDERS}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            ))}

          {/* {!!userData?.auth_token && (
            <ListItemHorizontal
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.1, alignItems: 'center'}}
              onPress={moveToNewScreen(navigationStrings.SUBSCRIPTION)}
              iconLeft={imagePath.subscription}
              centerHeading={strings.SUBSCRIPTION}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          )} */}

          {/* {!!userData?.auth_token && (
            <ListItemHorizontal
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.1, alignItems: 'center'}}
              onPress={moveToNewScreen(navigationStrings.LOYALTY)}
              iconLeft={imagePath.loyalty}
              centerHeading={strings.LOYALTYPOINTS}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          )} */}

          {/* {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.NOTIFICATION)}
            iconLeft={imagePath.notifcation}
            centerHeading={strings.NOTIFICATION}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            iconRight={imagePath.goRight}
            rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )} */}
          {/* {!!userData?.auth_token && (
            <ListItemHorizontal
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.1, alignItems: 'center'}}
              onPress={moveToNewScreen(navigationStrings.WALLET)}
              iconLeft={imagePath.wallet3}
              centerHeading={strings.WALLET}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          )} */}
          {!!userData?.auth_token &&
            (businessType == 4 ? null : (
              <ListItemHorizontal
                centerContainerStyle={{flexDirection: 'row'}}
                leftIconStyle={{flex: 0.1, alignItems: 'center'}}
                onPress={moveToNewScreen(navigationStrings.WISHLIST)}
                iconLeft={imagePath.wishlist}
                centerHeading={strings.FAVOURITE}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            ))}

          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.CMSLINKS)}
            iconLeft={imagePath.links}
            centerHeading={strings.LINKS}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
            }}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
          {!!userData?.auth_token && (
            <ListItemHorizontal
              centerContainerStyle={{flexDirection: 'row'}}
              leftIconStyle={{flex: 0.1, alignItems: 'center'}}
              onPress={onShare}
              iconLeft={imagePath.share1}
              centerHeading={strings.SHARE_APP}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
          )}
         {/* 
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.SETTIGS)}
            iconLeft={imagePath.settings1}
            centerHeading={strings.SETTINGS}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
            }}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          /> */}
          {/* {!!userData?.auth_token &&
            Platform.OS === 'android' &&
            (businessType == 'taxi' ? null : (
              <ListItemHorizontal
                centerContainerStyle={{flexDirection: 'row'}}
                leftIconStyle={{flex: 0.1, alignItems: 'center'}}
                onPress={() => {
                  BluetoothManager.checkBluetoothEnabled().then(
                    (enabled) => {
                      if (Boolean(enabled)) {
                        navigation.navigate(navigationStrings.ATTACH_PRINTER);
                      } else {
                        BluetoothManager.enableBluetooth()
                          .then(() => {
                            navigation.navigate(
                              navigationStrings.ATTACH_PRINTER,
                            );
                          })
                          .catch((err) => {});
                      }
                    },
                    (err) => {
                      err;
                    },
                  );
                }}
                iconLeft={imagePath.printer}
                centerHeading={strings.ATTACH_PRINTER}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            ))} */}

          {/* {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            iconLeft={imagePath.payment}
            centerHeading={strings.PAYMENTS}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            iconRight={imagePath.goRight}
            rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )} */}
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.CONTACT_US)}
            iconLeft={imagePath.contactUs}
            centerHeading={strings.CONTACT_US}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
            }}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
          />
          <View style={styles.loginView}>
            <TouchableOpacity
              // onPress={()=>actions.isVendorNotification(true)}
              onPress={userlogout}
              style={styles.touchAbleLoginVIew}>
              <Text style={styles.loginLogoutText}>
                {!!userData?.auth_token ? strings.LOGOUT : strings.LOGIN}
              </Text>
              <Image
                source={imagePath.rightBlue}
                style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
              />
            </TouchableOpacity>
          </View>
          <View style={{height: 100}} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
