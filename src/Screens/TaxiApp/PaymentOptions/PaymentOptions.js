
import { useFocusEffect,StackActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useDarkMode } from 'react-native-dark-mode';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import * as RNLocalize from 'react-native-localize';
import { useSelector } from 'react-redux';
import ButtonComponent from '../../../Components/ButtonComponent';
import Header from '../../../Components/Header';
import { loaderOne } from '../../../Components/Loaders/AnimatedLoaderFiles';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import ProductListLoader from '../../../Components/Loaders/ProductListLoader';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import {
  getImageUrl,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import stylesFun from './styles';
import { RadioButton } from 'react-native-paper';
import {
  CardField, createToken, initStripe, useStripe,
  BillingDetails,
  Address,
  PaymentSheetError,
} from '@stripe/stripe-react-native';
import appearance from './Apperance';
import { Switch } from 'react-native-paper';
let addressTypeArray = [strings.HOME, 'Work']
const PaymentOptions =({ navigation, route }) =>{
  console.log("AllPaymentMethods - AllPaymentMethods.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const checkCartItem = useSelector((state) => state?.cart?.cartItemCount);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const location = useSelector((state) => state?.home?.location);
  //console.log(location,'My Location');
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  let paramsData = route?.params.data;
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const recommendedVendorsdata = appMainData?.vendors;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [state, setState] = useState({
    isVisibleTimeModal: false,
    isVisible: false,
    cartItems: [],
    cartData: {},
    isLoadingB: false,
    isModalVisibleForClearCart: false,
    isVisibleAddressModal: false,
    type: '',
    nearestSavedAddress: '',
    selectedAddress: null,
    selectedPayment: {
      id: -1,
      off_site: -1,
      title: 'Select Payment Method',
      title_lng: strings.SELECT_PAYMENT_METHOD,
    },
    // selectedPayment: null,
    isRefreshing: false,
    selectedTipvalue: null,
    selectedTipAmount: null,
    viewHeight: 0,
    tableData: [],
    isTableDropDown: false,
    defaultSelectedTable: '',
    deepLinkUrl: null,
    selectedTimeOptions: [
      { id: 1, title: strings.NOW, type: 'now' },
      { id: 2, title: strings.SCHEDULE_ORDER, type: 'schedule' },
    ],
    selectedTimeOption: null,
    sheduledorderdate: null,
    scheduleType: null,
    swipeKey: 'randomStrings',
    wishlistArray: [],
    btnLoader: false,
    placeLoader: false,
    localeSheduledOrderDate: null,
    btnLoadrId: null,
    instruction: '',
    isPaymentMethodSelected: 1,
    showPlaceOrder: true,
    checked: '',
    isPaymentMethodDisabled: false,
    isWalletEnabled: false,
    isStripeDataExists: false,
  });
  const {
    viewHeight,
    isVisibleTimeModal,
    cartItems,
    cartData,
    isLoadingB,
    isModalVisibleForClearCart,
    isVisibleAddressModal,
    isVisible,
    type,
    selectedAddress,
    selectedPayment,
    isRefreshing,
    nearestSavedAddress,
    selectedTipvalue,
    selectedTipAmount,
    tableData,
    isTableDropDown,
    defaultSelectedTable,
    deepLinkUrl,
    selectedTimeOptions,
    selectedTimeOption,
    sheduledorderdate,
    scheduleType,
    swipeKey,
    wishlistArray,
    btnLoader,
    placeLoader,
    localeSheduledOrderDate,
    btnLoadrId,
    instruction,
    isPaymentMethodSelected,
    showPlaceOrder,
    checked,
    isPaymentMethodDisabled,
    isWalletEnabled,
    isStripeDataExists,
  } = state;
  const [clientSecret, setClientSecret] = useState('');

  //Redux store data


  const userData = useSelector((state) => state?.auth?.userData);
  const { appData, allAddresss, themeColors, currencies, languages, appStyle } =
    useSelector((state) => state?.initBoot);
  const selectedLanguage = languages?.primary_language?.sort_code;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily, themeColors, isDarkMode, MyDarkTheme });

  const selectedAddressData = useSelector(
    (state) => state?.cart?.selectedAddress,
  );

  const dineInType = useSelector((state) => state?.home?.dineInType);

  //Update states on screens
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  let businessType = appData?.profile?.preferences?.business_type || null;
  let max_cod_amount=appData?.profile?.preferences?.max_cod_amount  || 0


  useFocusEffect(
    React.useCallback(() => {
      updateState({ checked: '' })
    }, [])
  )
  useEffect(() => {
    initialisePaymentSheet();
  }, []);

  



  //Error handling in screen
  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
      btnLoader: false,
      placeLoader: false,
    });
    showError(error?.message || error?.error);
  };


  
  const swipeRef = useRef(null);
  // const fetchPaymentSheetParams = async () => {
  //   console.log(' i am fetchPaymentSheetParams');
  //   let orderMetaData = {}
  //   orderMetaData.address_id = selectedAddressData?.id
  //   orderMetaData.payment_option_id = 4
  //   orderMetaData.type = dineInType || '';
  //   const response = await actions
  //     .postStripeIntent(
  //       orderMetaData,
  //       {
  //         code: appData?.profile?.code,
  //         currency: currencies?.primary_currency?.id,
  //         language: languages?.primary_language?.id,
  //       },
  //     )
  //   const { paymentIntent, ephemeralKey, customer } = response
  //   // updateState({ clientSecret: paymentIntent })
  //   console.log(paymentIntent, ephemeralKey, customer, 'I AM OUTPUT FETCHPARAM');
  //   return {
  //     paymentIntent,
  //     ephemeralKey,
  //     customer,
  //   };


  //   // const response = await fetch(`${API_URL}/payment-sheet`, {
  //   //   method: 'POST',
  //   //   headers: {
  //   //     'Content-Type': 'application/json',
  //   //   },
  //   // });
  //   // const { paymentIntent, ephemeralKey, customer } = await response.json();
  //   // updateState({clientSecret : paymentIntent})
  //   // return {
  //   //   paymentIntent,
  //   //   ephemeralKey,
  //   //   customer,
  //   // };
  // };

  const openPaymentSheet = async () => {
    console.log('i am called 1');
    if (!clientSecret) {
      updateState({ isPaymentMethodDisabled: false })
      console.log('i am called 3');
      return;
    }
    updateState({ loading: true });
    const { error } = await presentPaymentSheet();
    // const resss =await presentPaymentSheet();
    // console.log(resss,'DATADATDATAD');

    if (!error) {
      //  placeOrder()
      //  console.log(cartData,'DATA');
      let data = { delivery_cart_id: paramsData.data.delivery_cart_id }
      actions
        .updateStripePaidStatusDelivery(
          data,
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => { })
        .catch((err) => { });
      moveToNewScreen(navigationStrings.ORDERSUCESS, {
        // orderDetail: res.data,
      })();
      // showSuccess(res?.message);
      // Alert.alert('Success', 'The payment was confirmed successfully');
    } else if (error.code === PaymentSheetError.Failed) {
      console.log("error", error);
      updateState({ isPaymentMethodDisabled: false, showPlaceOrder: true, checked: '' })
      Alert.alert(
        `PaymentSheet present failed with error code: ${error.code}`,
        error.message
      );
    } else if (error.code === PaymentSheetError.Canceled) {
      updateState({ isPaymentMethodDisabled: false, showPlaceOrder: true, checked: '' })
      // Alert.alert(
      //   `PaymentSheet present was canceled with code: ${error.code}`,
      //   error.message
      // );
    }
    console.log('i am called 2');
    //updateState({ paymentSheetEnabled: false })
    updateState({ loading: false });
  };

  const initialisePaymentSheet = async () => {
    console.log('i am called initialisePaymentSheet');
    // const { paymentIntent, ephemeralKey, customer } =
    //   await fetchPaymentSheetParams();
   console.log(paramsData,"MY PARAMSDATA");
   let paymentIntent = paramsData.data.paymentIntent;
   let  ephemeralKey=paramsData.data.ephemeralKey;
   let  customer=paramsData.data.customer
   console.log(paymentIntent,"MY PARAMSDATA");
   console.log(ephemeralKey,"MY PARAMSDATA");
   console.log(customer,"MY PARAMSDATA");
    setClientSecret(paymentIntent);
    const address = {
      city: 'Abu Dhabi',
      country: 'AE',
      line1: 'Opp. Sheraton Al Khalidya',
      line2: 'Mr Bakers Building',
      postalCode: '00000',
      state: 'Abu Dhabi',
    };
    const billingDetails = {
      name: 'Deliveryzone',
      email: 'aps@deliveryzone.ae',
      phone: '555-555-555',
      address: address,
    };
    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      customFlow: false,
      merchantDisplayName: 'Example Inc.',
      applePay: { merchantCountryCode: 'US' },
     // style: 'automatic',
      style:'alwaysLight',
      googlePay: {
        merchantCountryCode: 'US',
        testEnv: true,
      },
      returnURL: 'stripe-example://stripe-redirect',
      defaultBillingDetails: billingDetails,
      allowsDelayedPaymentMethods: true,
      appearance:  {
        font: {
          scale: 1.1,
        //  family: Platform.OS === 'android' ? 'macondoregular' : 'Macondo-Regular', 
        },
        colors: {
          light: {
            primary: colors.dark,
            background: '#ffffff',
            componentBackground: '#ffffff',
            componentBorder: themeColors.primary_color,
            componentDivider: themeColors.primary_color,
            primaryText: colors.dark,
            secondaryText: colors.dark,
            componentText: colors.dark,
            placeholderText: colors.dark,
            icon: '#F92672',
            error: '#F92672',
          },
          // dark: {
          //   primary: '#ffffff',
          //   background: '#ffffff',
          //   componentBackground: '#ffffff',
          //   componentBorder: '#62ff08',
          //   componentDivider: '#d6de00',
          //   primaryText: '#5181fc',
          //   secondaryText: '#ff7b00',
          //   componentText: '#00ffff',
          //   placeholderText: '#00ffff',
          //   icon: '#f0f0f0',
          //   error: '#0f0f0f',
          // },
        },
        shapes: {
          borderRadius: 10,
          borderWidth: 1,
          shadow: {
            opacity: 1,
            color: themeColors.primary_color,
            offset: { x: -5, y: -5 },
            blurRadius: 1,
          },
        },
        primaryButton: {
          colors: {
            background: themeColors.primary_color,
            text: colors.dark,
            border:  themeColors.primary_color,
          },
          shapes: {
            borderRadius: 10,
            borderWidth: 2,
            shadow: {
              opacity: 1,
              color: themeColors.primary_color,
              offset: { x: 5, y: 5 },
              blurRadius: 1,
            },
          },
        },
      }
    });
    if (!error) {
      console.log(error,"error");
      updateState({ isStripeDataExists: true, isLoadingB : false })
      //  openPaymentSheet(paymentIntent)
      //  updateState({ paymentSheetEnabled: true ,placeLoader: false})
    } else if (error.code === PaymentSheetError.Failed) {
      Alert.alert(
        `PaymentSheet init failed with error code: ${error.code}`,
        error.message
      );
    } else if (error.code === PaymentSheetError.Canceled) {
      // Alert.alert(
      //   `PaymentSheet init was canceled with code: ${error.code}`,
      //   error.message
      // );
    }


  };

  const renderCardItemLoader = () => {
    return (
      <View>
        <HeaderLoader
          widthLeft={moderateScale(140)}
          rectWidthLeft={moderateScale(140)}
          heightLeft={15}
          rectHeightLeft={15}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(30),
          }}
          isRight={false}
        />
        <ProductListLoader
          widthLeft={moderateScale(100)}
          mainView={{
            marginHorizontal: moderateScale(15),
            marginTop: moderateScale(5),
            alignItems: 'flex-start',
          }}
        />
        <HeaderLoader
          widthLeft={width - moderateScale(30)}
          rectWidthLeft={width - moderateScale(30)}
          heightLeft={moderateScale(35)}
          rectHeightLeft={moderateScale(35)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(15),
          }}
          isRight={false}
        />
        <HeaderLoader
          widthLeft={moderateScale(90)}
          rectWidthLeft={moderateScale(90)}
          heightLeft={moderateScale(15)}
          rectHeightLeft={moderateScale(15)}
          rectHeightRight={moderateScale(15)}
          heightRight={moderateScale(15)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(15),
          }}
        />
        <HeaderLoader
          widthLeft={moderateScale(90)}
          rectWidthLeft={moderateScale(90)}
          heightLeft={moderateScale(15)}
          rectHeightLeft={moderateScale(15)}
          rectHeightRight={moderateScale(15)}
          heightRight={moderateScale(15)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(8),
          }}
        />
      </View>
    );
  };











  if (isLoadingB) {
    return (
      <WrapperContainer
        bgColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }
        statusBarColor={colors.backgroundGrey}
        source={loaderOne}
      // isLoadingB={isLoadingB}
      >
        <Header centerTitle={strings.CART} leftIcon={imagePath.icBackb} />
        {/* <View
          style={{
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#fff',
          }}>
          <FastImage
            source={{ uri: Image.resolveAssetSource(imagePath.icEmptyCartD).uri }}
            style={{
              marginVertical: moderateScaleVertical(20),
              height: moderateScale(120),
              width: moderateScale(120),
            }}

          // resizeMode="contain"s
          />
          <Text style={{ ...styles.textStyle }}>
            {strings.YOUR_CART_EMPTY_ADD_ITEMS}
          </Text>
        </View> */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <HeaderLoader
            widthLeft={width - moderateScale(30)}
            rectWidthLeft={width - moderateScale(30)}
            heightLeft={15}
            rectHeightLeft={15}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(10),
            }}
            isRight={false}
          />
          <HeaderLoader
            widthLeft={moderateScale(100)}
            rectWidthLeft={moderateScale(100)}
            heightLeft={15}
            rectHeightLeft={15}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(10),
              alignSelf: 'center',
            }}
            isRight={false}
          />
          {renderCardItemLoader()}
          {renderCardItemLoader()}
          <HeaderLoader
            widthLeft={moderateScale(60)}
            rectWidthLeft={moderateScale(60)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(30),
            }}
          />
          <HeaderLoader
            widthLeft={moderateScale(60)}
            rectWidthLeft={moderateScale(60)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(8),
            }}
          />
          <HeaderLoader
            widthLeft={width - moderateScale(90)}
            rectWidthLeft={width - moderateScale(90)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(20),
            }}
            isRight={false}
          />
          <View style={{ flexDirection: 'row' }}>
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(15),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
          </View>
          <HeaderLoader
            widthLeft={moderateScale(90)}
            rectWidthLeft={moderateScale(90)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(15),
            }}
          />
          <HeaderLoader
            widthLeft={width - moderateScale(30)}
            rectWidthLeft={width - moderateScale(30)}
            heightLeft={moderateScale(40)}
            rectHeightLeft={moderateScale(40)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(15),
            }}
            isRight={false}
          />
        </ScrollView>
      </WrapperContainer>
    );
  }

  const itemRender =   cartItems[0]?.vendor_products.map((i, inx) => {
    return (
      <View style={[styles.cartItemMainContainer]}>
        <View
          style={[
            styles.cartItemImage,
            {
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.white,
            },
          ]}>
          <FastImage
            source={
              i?.cartImg != '' && i?.cartImg != null
                ? {
                  uri: getImageUrl(
                    i?.cartImg?.path?.proxy_url,
                    i?.cartImg?.path?.image_path,
                    '300/300',
                  ),
                  priority: FastImage.priority.high,
                }
                : imagePath.patternOne
            }
            style={styles.imageStyle}
          />
        </View>

        <View style={styles.cartItemDetailsCon}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{ flex: 0.6 }}>
              <Text
                numberOfLines={1}
                style={{
                  ...styles.priceItemLabel2,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity86,
                  fontSize: textScale(12),
                  fontFamily: fontFamily.medium,
                }}>
                {i?.product?.translation[0]?.title},
              </Text>

              <Text
                style={{
                  ...styles.priceItemLabel2,
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : '#B3B3B3',
                  marginTop: moderateScaleVertical(4),
                  fontFamily: fontFamily.regular,
                }}>
                <Text style={{}}>
                  {`${currencies?.primary_currency?.symbol}${
                    // Number(i?.pvariant?.multiplier) *
                    Number(i?.variants?.price).toFixed(2)
                    }`}
                </Text>{' '}
                X {i?.quantity} ={' '}
                <Text
                  style={{
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                  }}>
                  {`${currencies?.primary_currency?.symbol}${
                    // Number(i?.pvariant?.multiplier) *
                    Number(i?.variants?.quantity_price).toFixed(
                      2,
                    )
                    }`}
                </Text>
              </Text>

              {i?.variant_options.length
                ? i?.variant_options.map((j, jnx) => {
                  return (
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={
                          isDarkMode
                            ? [
                              styles.cartItemWeight2,
                              {
                                color:
                                  MyDarkTheme.colors.text,
                              },
                            ]
                            : styles.cartItemWeight2
                        }
                        numberOfLines={1}>
                        {j.title}{' '}
                      </Text>
                      <Text
                        style={
                          isDarkMode
                            ? [
                              styles.cartItemWeight2,
                              {
                                color:
                                  MyDarkTheme.colors.text,
                              },
                            ]
                            : styles.cartItemWeight2
                        }
                        numberOfLines={
                          1
                        }>{`(${j.option})`}</Text>
                    </View>
                  );
                })
                : null}
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{ flex: 0.5, justifyContent: 'center' }}>
              {!!i?.product_addons.length && (
                <View>
                  <Text
                    style={
                      isDarkMode
                        ? [
                          styles.cartItemWeight2,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                        : styles.cartItemWeight2
                    }>
                    {strings.EXTRA}
                  </Text>
                </View>
              )}
              {i?.product_addons.length
                ? i?.product_addons.map((j, jnx) => {
                  return (
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={
                          isDarkMode
                            ? [
                              styles.cartItemWeight2,
                              {
                                color:
                                  MyDarkTheme.colors.text,
                              },
                            ]
                            : styles.cartItemWeight2
                        }
                        numberOfLines={1}>
                        {j.addon_title}
                      </Text>
                      <Text
                        style={
                          isDarkMode
                            ? [
                              styles.cartItemWeight2,
                              {
                                color:
                                  MyDarkTheme.colors.text,
                              },
                            ]
                            : styles.cartItemWeight2
                        }
                        numberOfLines={
                          1
                        }>{`(${j.option_title})`}</Text>
                      <Text
                        style={
                          isDarkMode
                            ? [
                              styles.cartItemWeight2,
                              {
                                color:
                                  MyDarkTheme.colors.text,
                              },
                            ]
                            : [
                              styles.cartItemWeight2,
                              { color: colors.textGrey },
                            ]
                        }
                        numberOfLines={1}>{` ${currencies?.primary_currency?.symbol
                          }${(
                            Number(j.price) * Number(j.multiplier)
                          ).toFixed(2)} `}</Text>
                    </View>
                  );
                })
                : null}
            </View>
          </View>
        </View>
      </View>
    );
  })
   
  const _finalPayment = () => {
    let data =paramsData.deliveryCartData
    console.log(data,"For CASH");
    updateState({
      isLoading: true,
    });
    actions
      .placeDelievryOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        if (res && res?.status == 200) {
          moveToNewScreen(navigationStrings.ORDERSUCESS, {
            // orderDetail: res.data,
          })();
          // updateState({
          //   isModalVisible: false,
          //   isLoading: false,
          //   isRefreshing: false,
          // });
          // navigation.navigate(navigationStrings.CABDRIVERLOCATIONANDDETAIL, {
          //   orderDetail: res?.data,
          //   selectedCarOption: selectedCarOption,
          // });
        //   navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS, {
        //     orderId: res?.data?.id,
        //     fromVendorApp: true,
        //     selectedVendor: {id: selectedCarOption?.vendor_id},
        //     orderDetail: res?.data,
        //     fromCab: paramData?.pickup_taxi ? false : true,
        //     pickup_taxi: paramData?.pickup_taxi,
        //     totalDuration: totalDuration,
        //     selectedCarOption: selectedCarOption?.sku,
        //   });
        // } else {
        //   updateState({
        //     isModalVisible: false,
        //     isLoading: false,
        //     isRefreshing: false,
        //   });
        //   showError(res?.message || res?.error);
        // }
      }})
      .catch(errorMethod);
  };


  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
    // isLoadingB={isLoadingB}
    >
      <Header
        centerTitle={strings.PAYMENT_METHOD}
        leftIcon={imagePath.icBackb}
      />
      <ScrollView>
      <View
        style={
          isDarkMode
            ? [
              styles.mainComponent,
              { backgroundColor: MyDarkTheme.colors.background },
            ]
            : styles.mainComponent
        }>
       
      { paramsData.deliveryCartData.amount > 0 && <View>
        
       <RadioButton.Item
        value={1}
        label={strings.CASH_ON_DELIVERY}
        status={checked === 1 ? 'checked' : 'unchecked'}
        onPress={() => {
          //  setChecked(1)
          updateState({ checked: 1 })
        }}
      />
      {isStripeDataExists && <RadioButton.Item
        value={2}
        label={strings.PAY_BY_CARD}
        status={checked === 2 ? 'checked' : 'unchecked'}
        onPress={() => {
          // setChecked(2)
          updateState({ showPlaceOrder: false, isPaymentMethodDisabled: true, checked: 2 })
          openPaymentSheet()
        }}
        disabled={isPaymentMethodDisabled}
      />}
       </View>}
      { (checked === 1|| paramsData.deliveryCartData.amount === 0 ) &&  <View
          pointerEvents={placeLoader ? 'none' : 'auto'}
          style={styles.paymentView}>
          <ButtonComponent
            onPress={() => {
              _finalPayment()
            }}
            btnText={strings.PLACE_ORDER}
            borderRadius={moderateScale(13)}
            textStyle={{ color: colors.white }}
            containerStyle={{backgroundColor:"rgba(67,162,231,1)", marginTop:20, marginHorizontal:10}}
            placeLoader={placeLoader}
          />
        </View>}
      </View>
      </ScrollView>
    </WrapperContainer>
  );
}
export default PaymentOptions

// import React, {useState, useEffect} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import WrapperContainer from '../../../Components/WrapperContainer';
// import Header from '../../../Components/Header';
// import {useDarkMode} from 'react-native-dark-mode';
// import {MyDarkTheme} from '../../../styles/theme';
// import {useSelector} from 'react-redux';
// import colors from '../../../styles/colors';
// import stylesFun from './styles';

// import {
//   height,
//   moderateScale,
//   moderateScaleVertical,
//   textScale,
//   width,
// } from '../../../styles/responsiveSize';
// import imagePath from '../../../constants/imagePath';
// import strings from '../../../constants/lang';
// import OffersCard2 from '../../../Components/OffersCard2';
// import navigationStrings from '../../../navigation/navigationStrings';
// import {showError} from '../../../utils/helperFunctions';
// import actions from '../../../redux/actions';

// const PaymentOptions = ({navigation, route}) => {
//   console.log("TaxiApp - PaymentOptions.js")
//   const [state, setState] = useState({
//     paymentMethods: [
//       {id: 1, title: 'Cash On Delivery', image: imagePath.cash},
//       {id: 2, title: 'Wallet', image: imagePath.card},
//       // {id: 2, title: 'UPI', image: imagePath.upi},
//     ],
//     allAvailableCoupons: [
//       {
//         id: 0,
//         title: 'FLAT20',
//         expiry_date: '20 jan 2022',
//         name: '78878',
//       },
//       {
//         id: 1,
//         title: 'FLAT50',
//         expiry_date: '11 jan 2022',
//         name: '78878',
//       },
//     ],
//     pageNo: 1,
//     limit: 12,
//   });
//   const {appData, appStyle, themeColors, themeLayouts, currencies, languages} =
//     useSelector((state) => state.initBoot);
//   const theme = useSelector((state) => state?.initBoot?.themeColor);
//   const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);

//   const darkthemeusingDevice = useDarkMode();
//   const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

//   const walletAmount = useSelector(
//     (state) => state?.product?.walletData?.wallet_amount,
//   );
//   const updateState = (data) => setState((state) => ({...state, ...data}));
//   const vendorInfo = route?.params?.data;
//   const fontFamily = appStyle?.fontSizeData;
//   const styles = stylesFun({fontFamily, themeColors});

//   const {paymentMethods, allAvailableCoupons, pageNo, limit} = state;

//   const _onPressPaymentOption = (item) => {

//     if (item?.id == 1) {
//       navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
//         selectedMethod: item,
//       });
//       // selectedMethod: selectedPaymentMethod,
//     } else {
//       if (walletAmount >= 0) {
//         navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
//           selectedMethod: item,
//         });
//       } else {
//         showError('Please Recharge Your Wallet');
//       }
//     }
//   };

//   useEffect(() => {
//     getWalletData();
//   }, [pageNo]);

//   const getWalletData = () => {
//     actions
//       .walletHistory(
//         `?page=${pageNo}&limit=${limit}`,
//         {},
//         {
//           code: appData?.profile?.code,
//         },
//       )
//       .then((res) => {
//         updateState({
//           isRefreshing: false,
//           isLoading: false,
//           isLoadingB: false,
//           wallet_amount: res?.data?.wallet_amount,
//           walletHistory:
//             pageNo == 1
//               ? res.data.transactions.data
//               : [...walletHistory, ...res.data.transactions.data],
//         });
//       })
//       .catch(errorMethod);
//   };
//   const errorMethod = (error) => {
//     updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
//     showError(error?.message || error?.error);
//   };
//   const _renderItem = ({item}) => {
//     return (
//       <TouchableOpacity
//         onPress={() => _onPressPaymentOption(item)}
//         style={styles.renderItemStyle}>
//         <View
//           style={{
//             flexDirection: 'row',
//             marginBottom: moderateScale(20),
//           }}>
//           <Image source={item.image} style={styles.imageStyle} />
//           <Text
//             style={[
//               styles.textStyle,
//               {color: isDarkMode ? MyDarkTheme.colors.text : '#1C1C1C'},
//             ]}>
//             {item.title}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };
//   const _headerComponent = () => {
//     return (
//       <View style={{marginTop: moderateScale(18)}}>
//         <Text
//           style={{
//             textTransform: 'uppercase',
//             opacity: 0.7,
//             fontFamily: fontFamily.reguler,
//             fontSize: textScale(12),
//             color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
//             marginBottom: moderateScaleVertical(20),
//           }}>
//           {strings.PAYMENT_METHOD}
//         </Text>
//       </View>
//     );
//   };
//   const _headerVouchers = () => {
//     return (
//       <View
//         style={{
//           marginHorizontal: moderateScale(18),
//           marginTop: moderateScale(16),
//           marginBottom: moderateScale(24),
//         }}>
//         <Text
//           style={{
//             textTransform: 'uppercase',
//             opacity: 0.7,
//             fontFamily: fontFamily.reguler,
//             fontSize: textScale(12),
//             color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
//           }}>
//           {strings.AVAILABLE_VOUCHERS}
//         </Text>
//       </View>
//     );
//   };

//   const _renderPromoCodes = ({item}) => {
//     return (
//       <OffersCard2
//         data={item}
//         // onPress={() =>
//         //   vendorInfo?.cabOrder
//         //     ? _verifyPromoCodeForCab(item)
//         //     : _verifyPromoCode(item)
//         // }
//       />
//     );
//   };
//   return (
//     <WrapperContainer
//       bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
//       statusBarColor={colors.white}>
//       <Header
//         rightViewStyle={{
//           backgroundColor: isDarkMode
//             ? MyDarkTheme.colors.lightDark
//             : colors.greyColor,
//           alignItems: 'center',
//           paddingVertical: moderateScaleVertical(8),
//           borderRadius: 14,
//           flex: 0.15,
//         }}
//         leftIcon={imagePath.close2}
//         centerTitle={strings.PAYMENT_OPTIONS}
//         // rightIcon={imagePath.cartShop}
//         headerStyle={{
//           backgroundColor: isDarkMode
//             ? MyDarkTheme.colors.background
//             : colors.white,
//           marginVertical: moderateScaleVertical(10),
//           rightViewStyle: {backgroundColor: colors.greyColor},
//         }}
//       />
//       <View style={styles.containerStyle}>
//         <View style={{marginHorizontal: moderateScale(18)}}>
//           <FlatList
//             data={paymentMethods}
//             renderItem={_renderItem}
//             ListHeaderComponent={_headerComponent}
//           />
//         </View>
//         {/* <View style={{marginTop: moderateScale(28)}}>
//           <FlatList
//             data={allAvailableCoupons}
//             ListHeaderComponent={_headerVouchers}
//             renderItem={_renderPromoCodes}
//             ItemSeparatorComponent={() => <View style={{height: 20}} />}
//           />
//         </View> */}
//       </View>
//     </WrapperContainer>
//   );
// };

// export default PaymentOptions;
