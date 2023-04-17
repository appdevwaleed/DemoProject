import { useFocusEffect, StackActions } from '@react-navigation/native';
import { string } from 'is_js';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  I18nManager,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDarkMode } from 'react-native-dark-mode';
import DatePicker from 'react-native-date-picker';
import DeviceInfo from 'react-native-device-info';
import DropDownPicker from 'react-native-dropdown-picker';
import FastImage from 'react-native-fast-image';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { UIActivityIndicator } from 'react-native-indicators';
import * as RNLocalize from 'react-native-localize';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import AddressModal3 from '../../Components/AddressModal3';
import ButtonComponent from '../../Components/ButtonComponent';
import ChooseAddressModal from '../../Components/ChooseAddressModal';
import ConfirmationModal from '../../Components/ConfirmationModal';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import HorizontalLine from '../../Components/HorizontalLine';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import CircularProfileLoader from '../../Components/Loaders/CircularProfileLoader';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import ProductListLoader from '../../Components/Loaders/ProductListLoader';
import MarketCard3 from '../../Components/MarketCard3';
import ProductsComp from '../../Components/ProductsComp';
import WishlistCard from '../../Components/WishlistCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  getParameterByName,
  showError,
  showSuccess,
  timeInLocalLangauge,
} from '../../utils/helperFunctions';
import { getItem, removeItem, setItem } from '../../utils/utils';
import stylesFun from './styles';
import { RadioButton } from 'react-native-paper';
import {
  CardField, createToken, initStripe, useStripe,
  BillingDetails,
  Address,
  PaymentSheetError,
} from '@stripe/stripe-react-native';
// import appearance from './Apperance';
import { Switch } from 'react-native-paper';
let addressTypeArray = [strings.HOME, 'Work']
export default function AllPaymentMethods({ navigation, route }) {
  console.log("AllPaymentMethods - AllPaymentMethods.js",route.params)
  const specialInstructionData = route?.params;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const checkCartItem = useSelector((state) => state?.cart?.cartItemCount);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const location = useSelector((state) => state?.home?.location);
  //console.log(location,'My Location');
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  let paramsData = route?.params;
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const recommendedVendorsdata = appMainData?.vendors;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [state, setState] = useState({
    isVisibleTimeModal: false,
    isVisible: false,
    cartItems: [],
    cartData: {},
    isLoadingB: true,
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
  console.log(appData, 'THIS IS MY APP DATA');

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
  let max_cod_amount = appData?.profile?.preferences?.max_cod_amount || 0


  useFocusEffect(
    React.useCallback(() => {
      updateState({ isWalletEnabled: false, isPaymentMethodDisabled: false, showPlaceOrder: true, checked: '' })
    }, [])
  )
  useEffect(() => {
    initialisePaymentSheet();
  }, []);

  useEffect(() => {
    getCartDetail();
    return () => {
      // alert('blur')
    };
  }, []
  );

  const addSpecialInstructions = () => {
    console.log(specialInstructionData,'THIS THIS THIS')
    let data = {
      cart_id: specialInstructionData?.data?.cart_id,
      specific_instructions: specialInstructionData?.data?.specific_instructions,
    };
    actions
      .addSpecialInstructions(data, {
        code: appData.profile.code,
      })
      .then((res) => {
      })
      .catch((error) => {
      });
  };
  useEffect(() => {
    addSpecialInstructions();
  }, []
  );

  //get the entire cart detail
  const getCartDetail = () => {
    console.log("location", location);
    actions
      .getCartDetail(
        `/?type=${dineInType}${paramsData?.data?.queryURL ? `&${paramsData?.data?.queryURL}` : '' //for webPayment method- Mobbex,
        }&lat=${location?.latitude}&long=${location?.longitude}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
          timezone: RNLocalize.getTimeZone(),
          device_token: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log("res cartData", res)
        actions.cartItemQty(res);
        if (res && res.data) {
          console.log(JSON.stringify(res.data), 'CARD FULL DATA ALL PAYMENTS');
          console.log(JSON.stringify(res.data.address), 'CARD DETAILS DATA ALL PAYMENTS');
          console.log(JSON.stringify(res.data.products), 'CARD PRODUCTS DETAILS DATA ALL PAYMENTS')
          updateState({
            cartItems: res.data.products,
            nearestSavedAddress: res.data.address,
            cartData: res.data,
            isLoadingB: false,
            isRefreshing: false,
          });
        } else {
          updateState({
            cartItems: [],
            cartData: {},
            nearestSavedAddress: [],
            isLoadingB: false,
            isRefreshing: false,
          });
        }
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log("error", error)
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
      btnLoader: false,
      placeLoader: false,
    });
    showError(error?.message || error?.error);
  };

  const _directOrderPlace = () => {
    let data = {};
    data['address_id'] =
      paramsData?.selectedAddressData?.id || selectedAddressData?.id;
    data['payment_option_id'] = 1

    data['type'] = dineInType || '';

    if (paramsData?.transactionId) {
      data['transaction_id'] = paramsData?.transactionId;
    }
    actions
      .placeOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        latitude: location?.latitude.toString() || '',
        longitude: location?.longitude.toString() || '',
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty({});
        updateState({
          cartItems: [],
          cartData: {},
          isLoadingB: false,
          placeLoader: false,
        })
        moveToNewScreen(navigationStrings.ORDERSUCESS, {
          // orderDetail: res.data,
        })();
        // navigation.dispatch(
        //   StackActions.replace(navigationStrings.ORDERSUCESS, { }));


        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const placeOrder = () => {
    if (!!userData?.auth_token) {
      if (!selectedAddressData) {
        // showError(strings.PLEASE_SELECT_ADDRESS);
        setModalVisible(true);
      } else if (!selectedPayment) {
        showError(strings.PLEASE_SELECT_PAYMENT_METHOD);
      }
      else {
        if (!!userData) {
          if (
            !!userData?.verify_details?.is_email_verified &&
            !!userData?.verify_details?.is_phone_verified
          ) {

            updateState({ placeLoader: true });
            _directOrderPlace();
            return;

          } else {
            moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {
              formCart: true,
            })();
          }
        } else {
          showError(strings.UNAUTHORIZED_MESSAGE);
        }
      }
    } else {
      // showError(strings.UNAUTHORIZED_MESSAGE);
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
    }
  };

  const swipeRef = useRef(null);
  const fetchPaymentSheetParams = async () => {
    console.log('i am fetchPaymentSheetParams', selectedAddressData);
    let orderMetaData = {}
    orderMetaData.address_id = selectedAddressData?.id
    orderMetaData.payment_option_id = 4
    orderMetaData.type = dineInType || '';


   try{
    const response = await actions
    .postStripeIntent(
      orderMetaData,
      {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      },
    )
    console.log( 'I AM OUTPUT FETCHPARAM first')
    console.log(response, 'I AM OUTPUT FETCHPARAM first');
    const { paymentIntent, ephemeralKey, customer } = response
    // updateState({ clientSecret: paymentIntent })
    console.log(paymentIntent, ephemeralKey, customer, 'I AM OUTPUT FETCHPARAM');
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
   }  catch(e) {
    showError(e.message ||  'Something went wrong!');
   }
    }
    // const response = await fetch(`${API_URL}/payment-sheet`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    // const { paymentIntent, ephemeralKey, customer } = await response.json();
    // updateState({clientSecret : paymentIntent})
    // return {
    //   paymentIntent,
    //   ephemeralKey,
    //   customer,
    // };
  //};

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
      let data = { cart_id: cartData.id }
      actions
        .updateStripePaidStatus(
          data,
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => { })
        .catch((err) => { });
      actions.cartItemQty({});
      updateState({
        cartItems: [],
        cartData: {},
        isLoadingB: false,
        placeLoader: false,
        isPaymentMethodDisabled: false
      });
      console.log("I AM FROM SUCCESS");
      moveToNewScreen(navigationStrings.ORDERSUCESS, {
        // orderDetail: res.data,
      })();
      // showSuccess(res?.message);
      // Alert.alert('Success', 'The payment was confirmed successfully');
    } else if (error.code === PaymentSheetError.Failed) {
      updateState({ isPaymentMethodDisabled: false, showPlaceOrder: true, checked: '' })
      Alert.alert(
        `Something went wrong. Please try again later!!`
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
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();
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
      appearance:{
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
          dark: {
            primary: '#ffffff',
            background: '#ffffff',
            componentBackground: '#ffffff',
            componentBorder: '#62ff08',
            componentDivider: '#d6de00',
            primaryText: '#5181fc',
            secondaryText: '#ff7b00',
            componentText: '#00ffff',
            placeholderText: '#00ffff',
            icon: '#f0f0f0',
            error: '#0f0f0f',
          },
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
      updateState({ isStripeDataExists: true })
      //  openPaymentSheet(paymentIntent)
      //  updateState({ paymentSheetEnabled: true ,placeLoader: false})
    } else if (error.code === PaymentSheetError.Failed) {
      Alert.alert(
        `Something went wrong. Please try again later!!`
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
        <Header centerTitle={strings.BASKET} leftIcon={imagePath.icBackb} />
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

  const itemRender = cartItems[0]?.vendor_products.map((i, inx) => {
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
          {/* Showing Selected  Adrees */}
          <View>
            <Text style={
              isDarkMode
                ? [
                  styles.priceItemLabel,
                  {
                    color: MyDarkTheme.colors.text,
                  },
                ]
                : styles.priceItemLabel
            }>{strings.DELIVERED_TO}</Text>
            <Text style={
              isDarkMode
                ? [
                  styles.priceItemLabel,
                  {
                    color: MyDarkTheme.colors.text,
                  },
                ]
                : styles.priceItemLabel
            }>{nearestSavedAddress?.address}</Text>
            <Text style={
              isDarkMode
                ? [
                  styles.priceItemLabel,
                  {
                    color: MyDarkTheme.colors.text,
                  },
                ]
                : styles.priceItemLabel
            }>  {nearestSavedAddress?.city}</Text>
            <Text style={
              isDarkMode
                ? [
                  styles.priceItemLabel,
                  {
                    color: MyDarkTheme.colors.text,
                  },
                ]
                : styles.priceItemLabel
            }>   {nearestSavedAddress?.country}</Text>
          </View>

          {Number(cartData?.total_payable_amount).toFixed(2) > 0 && <View>
            {/* Cash payment */}
            {/* <RadioButton.Item
              value={1}
              label={strings.CASH_ON_DELIVERY}
              status={checked === 1 ? 'checked' : 'unchecked'}
              onPress={() => {
                //  setChecked(1)
                updateState({ checked: 1 })
              }}
              labelStyle={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                    },
                  ]
                  : styles.priceItemLabel
              }
              color={isDarkMode ? 'red': 'blue'}
              style={styles.paymentMethodBox }
              disabled={Boolean(max_cod_amount !== 0 && Number(cartData?.total_payable_amount).toFixed(2) > max_cod_amount)}
            />
            {Boolean(max_cod_amount !== 0 && Number(cartData?.total_payable_amount).toFixed(2) > max_cod_amount) ?
              <View style={{ marginHorizontal: moderateScale(10) }}>
                <Text
                  style={{
                    fontSize: moderateScale(12),
                    fontFamily: fontFamily.medium,
                    color: colors.redFireBrick,
                  }}>
                  {strings.COD_AMOUNT_EXCEED}
                </Text>
              </View> : null} */}
            {isStripeDataExists && <RadioButton.Item
              value={2}
              label={strings.PAY_BY_CARD}
              status={checked === 2 ? 'checked' : 'unchecked'}
              onPress={() => {
                // setChecked(2)
                updateState({ showPlaceOrder: false, isPaymentMethodDisabled: true, checked: 2 })
                openPaymentSheet()
              }}
              labelStyle={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                    },
                  ]
                  : styles.priceItemLabel
              }
              color={isDarkMode ? 'red': 'blue'}
              disabled={isPaymentMethodDisabled}
              style={styles.paymentMethodBox }
            />}
          </View>}
          {(checked === 1 || Number(cartData?.total_payable_amount).toFixed(2) <= 0) && <View
            pointerEvents={placeLoader ? 'none' : 'auto'}
            style={styles.paymentView}>
            <ButtonComponent
              onPress={() => {
                placeOrder()
              }}
              btnText={strings.PLACE_ORDER}
              borderRadius={moderateScale(13)}
              textStyle={{ color: colors.white }}
              containerStyle={styles.placeOrderButtonStyle}
              placeLoader={placeLoader}
            />
          </View>}
          {itemRender}
          {/* start amount view       */}
          {/* <View style={{ marginHorizontal: moderateScale(4), marginTop: moderateScaleVertical(8) }}>
            {cartItems && cartItems.length > 0 && (
              <View style={styles.itemPriceDiscountTaxView}>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                      : styles.priceItemLabel
                  }>
                  {strings.DISCOUNT}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                      : styles.priceItemLabel
                  }>{`- ${currencies?.primary_currency?.symbol}${Number(
                    cartItems[0]?.discount_amount ? cartItems[0]?.discount_amount : 0,
                  ).toFixed(2)}`}</Text>
              </View>)}
            {cartItems && cartItems.length > 0 && (
              <View style={styles.itemPriceDiscountTaxView}>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                      : styles.priceItemLabel
                  }>
                  {strings.DELIVERY_CHARGES}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                      : styles.priceItemLabel
                  }>{`${currencies?.primary_currency?.symbol}${Number(
                    cartItems[0]?.deliver_charge ? cartItems[0]?.deliver_charge : 0,
                  ).toFixed(2)}`}</Text>
              </View>
            )}
            <View style={styles.itemPriceDiscountTaxView}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                    : styles.priceItemLabel
                }>
                {strings.AMOUNT}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.priceItemLabel2,
                      {
                        color: MyDarkTheme.colors.text,
                      },
                    ]
                    : styles.priceItemLabel2
                }>{`${currencies?.primary_currency?.symbol}${Number(
                  cartItems[0]?.payable_amount ? cartItems[0]?.payable_amount : 0,
                ).toFixed(2)}`}</Text>
            </View>
            <View style={styles.bottomTabLableValue}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                    : styles.priceItemLabel
                }>
                {strings.SUBTOTAL}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                    : styles.priceItemLabel
                }>{`${currencies?.primary_currency?.symbol}${Number(
                  cartData?.gross_paybale_amount,
                ).toFixed(2)}`}</Text>
            </View>
            {!!cartData?.wallet_amount && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>
                  {strings.WALLET}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>{`${currencies?.primary_currency?.symbol}${Number(
                    cartData?.wallet_amount ? cartData?.wallet_amount : 0,
                  ).toFixed(2)}`}</Text>
              </View>
            )}
            {!!cartData?.loyalty_amount && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>
                  {strings.LOYALTY}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>{`-${currencies?.primary_currency?.symbol}${Number(
                    cartData?.loyalty_amount ? cartData?.loyalty_amount : 0,
                  ).toFixed(2)}`}</Text>
              </View>
            )}

            {!!cartData?.wallet_amount_used && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>
                  {strings.WALLET}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>{`-${currencies?.primary_currency?.symbol}${Number(
                    cartData?.wallet_amount_used ? cartData?.wallet_amount_used : 0,
                  ).toFixed(2)}`}</Text>
              </View>
            )}
            {!!cartData?.total_subscription_discount && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>
                  {strings.TOTALSUBSCRIPTION}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>{`-${currencies?.primary_currency?.symbol}${Number(
                    cartData?.total_subscription_discount,
                  ).toFixed(2)}`}</Text>
              </View>
            )} */}



            {/* {!!cartData?.total_discount_amount && (
            <View style={styles.bottomTabLableValue}>
              <Text style={styles.priceItemLabel}>
                {strings.TOTAL_DISCOUNT}
              </Text>
              <Text style={styles.priceItemLabel}>{`-${
                currencies?.primary_currency?.symbol
              }${Number(cartData?.total_discount_amount).toFixed(2)}`}</Text>
            </View>
          )} */}



            {/* {!!cartData?.total_tax && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>
                  {strings.TAX_AMOUNT}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>{`${currencies?.primary_currency?.symbol}${Number(
                    cartData?.total_tax ? cartData?.total_tax : 0,
                  ).toFixed(2)}`}</Text>
              </View>
            )}

            <View style={styles.amountPayable}>
              <Text
                style={{
                  ...styles.priceItemLabel2,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                }}>
                {strings.AMOUNT_PAYABLE}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel2, { color: MyDarkTheme.colors.text }]
                    : styles.priceItemLabel2
                }>{`${currencies?.primary_currency?.symbol}${Number(cartData?.total_payable_amount).toFixed(2)}`}</Text>
            </View>
          </View> */}
           {/* start amount view       */}
           <View style={styles.itemPriceDiscountTaxView}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }>
              {strings.PRODUCT_AMOUNT}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel2,
                    {
                      color: MyDarkTheme.colors.text,
                    },
                  ]
                  : styles.priceItemLabel2
              }>{`${currencies?.primary_currency?.symbol}${Number(
                cartData?.product_total ? cartData?.product_total : 0,
              ).toFixed(2)}`}</Text>
          </View>
          <View style={{ marginHorizontal: moderateScale(4), marginTop: moderateScaleVertical(8) }}>
            {/* {!!item?.discount_amount && (
              <View style={styles.itemPriceDiscountTaxView}>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                      : styles.priceItemLabel
                  }>
                  {strings.DISCOUNT}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                      : styles.priceItemLabel
                  }>{`- ${currencies?.primary_currency?.symbol}${Number(
                    item?.discount_amount ? item?.discount_amount : 0,
                  ).toFixed(2)}`}</Text>
              </View>
            )} */}
            <View style={styles.bottomTabLableValue}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                    : styles.priceItemLabel
                }>
                {strings.SUBTOTAL}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                    : styles.priceItemLabel
                }>{`${currencies?.primary_currency?.symbol}${Number(
                  cartData?.sub_total,
                ).toFixed(2)}`}</Text>
            </View>
            {/* {!!item?.deliver_charge && (
              <View style={styles.itemPriceDiscountTaxView}>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                      : styles.priceItemLabel
                  }>
                  {strings.DELIVERY_CHARGES}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                      : styles.priceItemLabel
                  }>{`${currencies?.primary_currency?.symbol}${Number(
                    item?.deliver_charge ? item?.deliver_charge : 0,
                  ).toFixed(2)}`}</Text>
              </View>
            )} */}
            {!!cartData?.wallet_amount && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>
                  {strings.WALLET}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>{`${currencies?.primary_currency?.symbol}${Number(
                    cartData?.wallet_amount ? cartData?.wallet_amount : 0,
                  ).toFixed(2)}`}</Text>
              </View>
            )}
            
            {!!cartData?.loyalty_amount && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>
                  {strings.LOYALTY}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>{`-${currencies?.primary_currency?.symbol}${Number(
                    cartData?.loyalty_amount ? cartData?.loyalty_amount : 0,
                  ).toFixed(2)}`}</Text>
              </View>
            )}

            {!!cartData?.wallet_amount_used && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>
                  {strings.WALLET}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>{`-${currencies?.primary_currency?.symbol}${Number(
                    cartData?.wallet_amount_used ? cartData?.wallet_amount_used : 0,
                  ).toFixed(2)}`}</Text>
              </View>
            )}
            {!!cartData?.total_subscription_discount && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>
                  {strings.TOTALSUBSCRIPTION}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>{`-${currencies?.primary_currency?.symbol}${Number(
                    cartData?.total_subscription_discount,
                  ).toFixed(2)}`}</Text>
              </View>
            )}

            {/* {!!cartData?.total_discount_amount && (
            <View style={styles.bottomTabLableValue}>
              <Text style={styles.priceItemLabel}>
                {strings.TOTAL_DISCOUNT}
              </Text>
              <Text style={styles.priceItemLabel}>{`-${
                currencies?.primary_currency?.symbol
              }${Number(cartData?.total_discount_amount).toFixed(2)}`}</Text>
            </View>
          )} */}


            {/* {!!appData?.profile?.preferences?.tip_before_order &&
              !!cartData?.tip &&
              cartData?.tip.length && (
                <View
                  style={[
                    styles.bottomTabLableValue,
                    { flexDirection: 'column', marginTop: moderateScaleVertical(8) },
                  ]}>
                  <Text
                    style={
                      isDarkMode
                        ? [styles.priceTipLabel, { color: MyDarkTheme.colors.text }]
                        : [styles.priceTipLabel]
                    }>
                    {strings.DOYOUWANTTOGIVEATIP}
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    {cartData?.total_payable_amount !== 0 &&
                      cartData?.tip.map((j, jnx) => {
                        return (
                          <TouchableOpacity
                            key={String(jnx)}
                            style={[
                              styles.tipArrayStyle,
                              {
                                backgroundColor:
                                  // selectedTipvalue?.value == j?.value
                                  cartData?.tip_index == jnx
                                    ? themeColors.primary_color
                                    : 'transparent',
                                flex: 0.18,
                              },
                            ]}
                            onPress={() => selectedTip(j, jnx)}>
                            <Text
                              style={
                                isDarkMode
                                  ? {
                                    color:
                                      // selectedTipvalue?.value == j?.value
                                      cartData?.tip_index == jnx
                                        ? colors.white
                                        : MyDarkTheme.colors.text,
                                  }
                                  : {
                                    color:
                                      //  selectedTipvalue?.value == j?.value
                                      cartData?.tip_index == jnx
                                        ? colors.white
                                        : colors.black,
                                  }
                              }>
                              {`${currencies?.primary_currency?.symbol} ${j.value}`}
                            </Text>
                            <Text
                              style={{
                                color:
                                  // selectedTipvalue?.value == j?.value
                                  cartData?.tip_index == jnx
                                    ? colors.white
                                    : colors.textGreyB,
                              }}>
                              {j.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}

                    <TouchableOpacity
                      style={[
                        styles.tipArrayStyle2,
                        {
                          backgroundColor:
                            // selectedTipvalue == 'custom'
                            cartData.tip_index === -1 && cartData.tip_amount > 0
                              ? themeColors.primary_color
                              : 'transparent',
                          flex: cartData?.total_payable_amount !== 0 ? 0.45 : 0.2,
                        },
                      ]}
                      onPress={() => selectedCustomTip('custom')}>
                      <Text
                        style={
                          isDarkMode
                            ? {
                              color:
                                // selectedTipvalue == 'custom'
                                cartData.tip_index === -1 && cartData.tip_amount > 0
                                  ? colors.white
                                  : MyDarkTheme.colors.text,
                            }
                            : {
                              color:
                                //  selectedTipvalue == 'custom'
                                cartData.tip_index === -1 && cartData.tip_amount > 0
                                  ? colors.white
                                  : colors.black,
                            }
                        }>
                        {strings.CUSTOM}
                        {(cartData.tip_index === -1 && cartData.tip_amount > 0) &&
                          cartData.tip_amount}
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>

                  {selectedTipvalue == 'custom' && (
                    <View
                      style={{
                        borderRadius: 5,
                        borderWidth: 0.5,
                        borderColor: colors.textGreyB,
                        height: 40,
                        marginTop: moderateScaleVertical(8)
                      }}>
                      <TextInput
                        value={selectedTipAmount}
                        onChangeText={(text) =>
                          updateState({ selectedTipAmount: text })
                        }
                        style={{
                          height: 40,
                          alignItems: 'center',
                          paddingHorizontal: 10,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.textGreyOpcaity7,
                        }}
                        maxLength={5}
                        returnKeyType={'done'}
                        keyboardType={'number-pad'}
                        placeholder={strings.ENTER_CUSTOM_AMOUNT}
                        placeholderTextColor={
                          isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.textGreyOpcaity7
                        }
                        onSubmitEditing={onSubmitEdit}
                      />
                    </View>
                  )}
                </View>
              )} */}

            {!!cartData?.total_tax && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>
                  {strings.TAX_AMOUNT}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>{`${currencies?.primary_currency?.symbol}${Number(
                    cartData?.total_tax ? cartData?.total_tax : 0,
                  ).toFixed(2)}`}</Text>
              </View>
            )}
{/* 
            {!!item?.deliver_charge && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>
                  {strings.DELIVERY_CHARGES}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                      : styles.priceItemLabel
                  }>{`${currencies?.primary_currency?.symbol}${Number(
                    item?.deliver_charge ? item?.deliver_charge : 0,
                  ).toFixed(2)}`}</Text>
              </View>
            )} */}

            <View style={styles.amountPayable}>
              <Text
                style={{
                  ...styles.priceItemLabel2,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                }}>
                {strings.AMOUNT_PAYABLE}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel2, { color: MyDarkTheme.colors.text }]
                    : styles.priceItemLabel2
                }>{`${currencies?.primary_currency?.symbol}${Number(cartData?.total_payable_amount).toFixed(2)}`}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
}
