import { useFocusEffect } from '@react-navigation/native';
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
import appearance from './Apperance';
import { Switch } from 'react-native-paper';
import TransparentButtonWithTxtAndIcon from '../../Components/TransparentButtonWithTxtAndIcon';
let addressTypeArray = [strings.HOME, 'Work']
export default function Cart({ navigation, route }) {
  console.log("Cart - Cart3.js",route)
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
    isWalletEnabled
  } = state;
  const addressType = (type) => {
    switch (type) {
      case 1:
        return strings.HOME;
      case 2:
        return strings.WORK;
      default:
        return strings.HOME
    }
  }
  //Redux store data


  const userData = useSelector((state) => state?.auth?.userData);
  const { appData, allAddresss, themeColors, currencies, languages, appStyle } =
    useSelector((state) => state?.initBoot);
  const selectedLanguage = languages?.primary_language?.sort_code;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily, themeColors, isDarkMode, MyDarkTheme });

 console.log('THIS IS MY USERDATA',userData)
  const selectedAddressData = useSelector(
    (state) => state?.cart?.selectedAddress,
  );
  console.log('THIS IS MY selectedAddressData',selectedAddressData)
  // console.log(selectedAddressData,'selectedAddressData')
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
  const toggleSwitch = () => {
    console.log(isWalletEnabled, 'CURRENT');
    let currentStatus = isWalletEnabled
    _useWallet(!currentStatus, cartData)
  };
  // const onToggleSwitch = () => {
  //   let currentStatus = isSwitchOn
  //   console.log(currentStatus, 'THIS IS CURRENT');
  //   setIsSwitchOn(!isSwitchOn)
  //   console.log(isSwitchOn, 'THIS IS CURRENT');
  //   // _useWallet(currentStatus,cartData)
  // };
  // const onToggleSwitch = () =>{ updateState({isWallet: true})};
  // useFocusEffect  changed to useEffect
  // useEffect(() => {

  //   // if (paramsData && paramsData?.selectedMethod) {
  //   //   updateState({ selectedPayment: paramsData?.selectedMethod, isPaymentMethodSelected: 3 });
  //   // }
  //   // alert('run')
  //   // commented bc of two renders
  //   // if (!checkCartItem?.data?.item_count) {
  //   //   updateState({ isLoadingB: true });
  //   // }
  //   getCartDetail();
  //   getAllWishListData();
  //   // if (!!checkCartItem?.data) {
  //   //   getCartDetail();
  //   // } else {
  //   //   getAllWishListData();
  //   // }
  //   return () => {
  //     // alert('blur')
  //   };
  // }, [
  //   currencies,
  //   languages,
  //   route?.params?.promocodeDetail,
  //   allAddresss,
  //   selectedAddress,
  //   paramsData,
  //   isRefreshing,
  //   checkCartItem?.data?.item_count,
  // ]
  // );

  useEffect(() => {
    if (
      appData &&
      appData?.profile &&
      appData?.profile?.preferences &&
      appData?.profile?.preferences?.stripe_publishable_key != '' &&
      appData?.profile?.preferences?.stripe_publishable_key != null
    ) {
      initStripe({
        publishableKey: appData?.profile?.preferences?.stripe_publishable_key,
        merchantIdentifier: 'merchant.identifier',
        urlScheme: 'stripe-example',
        setReturnUrlSchemeOnAndroid: true,
      });
    }
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      console.log("I AM CALLEDnin side undefocuseffect");
      updateState({
        // isWalletEnabled: cartData?.use_wallet === 0 ? false : true,
        isPaymentMethodDisabled: false,
        showPlaceOrder: true,
        checked: '',
        isRefreshing: true,
      })
    }, [])
  )

  useEffect(() => {
    navigation?.addListener('focus', () => {
      getCartDetail();
      getAllWishListData();
    });
    return(()=>{

    })
  }, [
    currencies,
    languages,
    route?.params?.promocodeDetail,
    allAddresss,
    selectedAddress,
    paramsData,
    isRefreshing,
    checkCartItem?.data?.item_count,
  ]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (paramsData && paramsData?.selectedMethod) {
  //       updateState({ selectedPayment: paramsData?.selectedMethod,isPaymentMethodSelected : 3 });
  //     }
  //     // alert('run')
  //     if (!checkCartItem?.data?.item_count) {
  //       updateState({ isLoadingB: true });
  //     }
  //     getCartDetail();
  //     getAllWishListData();
  //     // if (!!checkCartItem?.data) {
  //     //   getCartDetail();
  //     // } else {
  //     //   getAllWishListData();
  //     // }
  //     return () => {
  //       // alert('blur')
  //     };
  //   }, [
  //     currencies,
  //     languages,
  //     route?.params?.promocodeDetail,
  //     allAddresss,
  //     selectedAddress,
  //     paramsData,
  //     isRefreshing,
  //     checkCartItem?.data?.item_count,
  //   ]),
  // );

  // useEffect(() => {
  //   if (paramsData && paramsData?.selectedMethod) {
  //     updateState({ selectedPayment: paramsData?.selectedMethod });
  //   }

  //   // alert('run')
  //   // updateState({ isLoadingB: true });
  //   if (!!cartItems) {
  //     getCartDetail();
  //     return
  //   }
  //   if (!!userData?.auth_token) {
  //     getAllWishListData();
  //     return
  //   }

  // }, [
  //   currencies,
  //   languages,
  //   route?.params?.promocodeDetail,
  //   allAddresss,
  //   selectedAddress,
  //   paramsData,
  //   isRefreshing,
  //   cartItems,
  // ])


  console.log(nearestSavedAddress, selectedAddress, 'MY ADDRESS DATA');
  // useEffect(() => {
  //   if (!!checkCartItem?.data) {
  //     //  console.log( checkforAddressUpdate());
  //     checkforAddressUpdate();
  //   }
  // }, [selectedAddress, allAddresss]);

  //check for addreess Update and change
  const checkforAddressUpdate = () => {
    if (allAddresss.length == 0) {
      updateState({ selectedAddress: null });
      actions.saveAddress(null);
    }
    if (!selectedAddress && allAddresss.length) {
      let find = allAddresss.find((x) => x.is_primary);

      if (find) {
        updateState({ selectedAddress: find });
        actions.saveAddress(find);
      } else {
        selectAddress(allAddresss[0]);
      }
    }
    if (selectedAddress && allAddresss.length) {
      let find = allAddresss.find(
        (x) =>
          x.id == selectedAddress.id &&
          x.is_primary == selectedAddress.is_primary,
      );
      if (find) {
        selectAddress(find);
      } else {
        selectAddress(allAddresss[0]);
        // updateState({selectedAddress: null});
        // actions.saveAddress(null);
      }
    }
  };

  //get All address
  const getAllAddress = () => {
    if (!!userData?.auth_token) {
      actions
        .getAddress(
          {},
          {
            code: appData?.profile?.code,
          },
        )
        .then((res) => {
          updateState({
            isLoadingB: false,
          });
          if (res.data) {
            actions.saveAllUserAddress(res.data);
          }
        })
        .catch(errorMethod);
    }
  };

  //get the entire cart detail
  const getCartDetail = () => {
    // alert("cart detail hit")
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
        actions.cartItemQty(res);
        // console.log('THIS IS MY CART DETAIL', JSON.stringify(res.data));
        // let checkDate = !!res?.data?.scheduled_date_time;
        // if (!!checkDate && res.data.schedule_type == 'schedule') {
        //   let formatDate = new Date(res?.data?.scheduled_date_time);
        //   updateState({
        //     localeSheduledOrderDate: timeInLocalLangauge(
        //       formatDate,
        //       selectedLanguage,
        //     ),
        //   });
        // } else {
        // updateState({
        //   scheduleType: 'now',
        //   localeSheduledOrderDate: null,
        // });
        // }
        //   updateState({
        // isRefreshing: false,
        // isLoadingB: false,
        //sheduledorderdate: res?.data?.scheduled_date_time,
        // scheduleType: res?.data?.schedule_type,
        // selectedTimeOption: { id: 1, title: strings.NOW, type: 'now' }
        // selectedTimeOption:
        //   res?.data?.schedule_type == 'now'
        //     ? { id: 1, title: strings.NOW, type: 'now' }
        //     : res?.data?.schedule_type == 'schedule'
        //       ? { id: 2, title: strings.SCHEDULE_ORDER, type: 'schedule' }
        //       : { id: 1, title: strings.NOW, type: 'now' },
        //  });
        if (res && res.data) {
           console.log('THIS IS MY CART DETAIL->waleed', res.data);
          //  console.log(res.data.address,'MY ADDRESS')
          // console.log(JSON.stringify(res.data));
          // if (res.data.vendor_details.vendor_tables) {
          //   res.data.vendor_details.vendor_tables.forEach(
          //     (item, indx) =>
          //     (tableData[indx] = {
          //       id: item.id,
          //       label: `${strings.CATEGORY}: ${item.category.title ? item.category.title : ''
          //         } | ${strings.TABLE}: ${item.table_number ? item.table_number : 0
          //         } | ${strings.SEAT_CAPACITY}: ${item.seating_number ? item.seating_number : 0
          //         }`,
          //       value: `${strings.CATEGORY}: ${item.category.title ? item.category.title : ''
          //         } | ${strings.TABLE}: ${item.table_number ? item.table_number : 0
          //         } | ${strings.SEAT_CAPACITY}: ${item.seating_number ? item.seating_number : 0
          //         }`,
          //       title: item.category.title,
          //       table_number: item.table_number,
          //       seating_number: item.seating_number,
          //       vendor_id: res.data.vendor_details.vendor_address.id,
          //     }),
          //     updateState({
          //       tableData: tableData,
          //     }),
          //   );
          // }
          updateState({
            cartItems: res.data.products,
            nearestSavedAddress: res.data.address,
         // selectedAddressData: res.data.address,
            cartData: res.data,
            isLoadingB: false,
            isRefreshing: false,
          });
          // actions.saveAddress(res.data.address);
          // if (!res.data.schedule_type) {
          //   //if schedule type is null then hit the api again with now option
          //   setDateAndTimeSchedule();
          // }
        } else {
          updateState({
            cartItems: [],
            cartData: {},
            nearestSavedAddress: '',
            isLoadingB: false,
            isRefreshing: false,
          });
        }
      })
      .catch(errorMethod);

    // getItem('selectedTable')
    //   .then((res) => {
    //     updateState({
    //       defaultSelectedTable: res,
    //     });
    //   })
    //   .catch((error) => {
    //     showError(error.message);
    //   });
  };

  // useEffect(() => {
  //   getAllWishListData()
  // }, [])

  //add /delete products from cart
  const addDeleteCartItems = (item, index, type) => {
    let quanitity = null;
    let itemToUpdate = cloneDeep(item);
    if (type == 1) {
      quanitity = Number(itemToUpdate.quantity) + 1;
    } else {
      quanitity = Number(itemToUpdate.quantity) - 1;
    }
    if (quanitity) {
      let data = {};
      data['cart_id'] = itemToUpdate?.cart_id;
      data['quantity'] = quanitity;
      data['cart_product_id'] = itemToUpdate?.id;
      data['type'] = dineInType;
      updateState({ btnLoader: true, btnLoadrId: item?.id });
      actions
        .increaseDecreaseItemQty(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          actions.cartItemQty(res);
          updateState({
            cartItems: res.data.products,
            cartData: res.data,
            btnLoader: false,
          });
        })
        .catch(errorMethod);
    } else {
      updateState({ btnLoader: true });
      //  removeItem('selectedTable');
      removeProductFromCart(itemToUpdate);
    }
  };

  //decrementing/removeing products from cart
  const removeProductFromCart = (item) => {
    let data = {};
    data['cart_id'] = item?.cart_id;
    data['cart_product_id'] = item?.id;
    data['type'] = dineInType;
    actions
      .removeProductFromCart(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty(res);
        updateState({
          cartItems: res.data.products,
          cartData: res.data,
          isLoadingB: false,
          btnLoader: false,
        });
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //Close modal for Clear cart
  const closeOptionModal = () => {
    updateState({ isModalVisibleForClearCart: false });
  };

  const bottomButtonClick = () => {
    updateState({ isLoadingB: true, isModalVisibleForClearCart: false });
    //removeItem('selectedTable');
    // setTimeout(() => {
    //   clearEntireCart();
    // }, 1000);
    clearEntireCart();
  };

  //Clear cart
  const clearEntireCart = () => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        actions.cartItemQty(res);
        updateState({
          cartItems: [],
          cartData: {},
          isLoadingB: false,
        });
        getAllWishListData();
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

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

  //Get list of all offers
  const _getAllOffers = (vendor, cartData) => {
    moveToNewScreen(navigationStrings.OFFERS, {
      vendor: vendor,
      cartId: cartData.id,
    })();
  };

  useEffect(() => {
    if (paramsData?.transactionId && !!checkCartItem?.data) {
      _directOrderPlace();
    }
  }, [paramsData?.transactionId]);

  //Verify your promo code
  const _removeCoupon = (item, cartData) => {
    updateState({ isLoadingB: true });
    let data = {};
    data['vendor_id'] = item?.vendor_id;
    data['cart_id'] = cartData?.id;
    data['coupon_id'] = item?.couponData?.coupon_id;

    actions
      .removePromoCode(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        if (res) {
          showSuccess(res?.message || res?.error);
          getCartDetail();
        } else {
          updateState({ isLoadingB: false });
        }
      })
      .catch(errorMethod);
  };

  const _useWallet = (currentStatus, cartData) => {
    updateState({ isLoadingB: true });
    let data = {};
    data['use_wallet'] = currentStatus;
    data['cart_id'] = cartData?.id;
    console.log(data);
    actions
      .useWallet(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        if (res) {
          if (res.active_wallet) {
            showSuccess(res?.message);
            updateState({ isWalletEnabled: !isWalletEnabled })
            getCartDetail();
          } else {
            showSuccess(res?.message);
            updateState({ isLoadingB: false });
          }
        } else {
          updateState({ isLoadingB: false });
        }
      })
      .catch(errorMethod);
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
        // if (businessType !== 'home_service' && res?.data?.vendors.length !== 1) {
        //   actions.cartItemQty({});
        //   updateState({           
        //     cartItems: [],
        //     cartData: {},
        //     isLoadingB: false,
        //     placeLoader: false,
        //   })
        // }
        // if (
        //   (res?.data?.payment_option_id === 6 &&
        //     !!(Number(cartData?.total_payable_amount) !== 0)) ||
        //   Number(selectedTipAmount) !== 0
        // ) {
        //   navigation.navigate(navigationStrings.PAYFAST, {
        //     selectedPayment: selectedPayment,
        //     total_payable_amount: (
        //       Number(cartData?.total_payable_amount) +
        //       (selectedTipAmount != null && selectedTipAmount != ''
        //         ? Number(selectedTipAmount)
        //         : 0)
        //     ).toFixed(2),

        //     payment_option_id: selectedPayment?.id,
        //     orderDetail: res.data,
        //   });
        // } else if (
        //   (res?.data?.payment_option_id === 7 &&
        //     !!(Number(cartData?.total_payable_amount) !== 0)) ||
        //   Number(selectedTipAmount) !== 0
        // ) {
        //   navigation.navigate(navigationStrings.MOBBEX, {
        //     selectedPayment: selectedPayment,
        //     total_payable_amount: (
        //       Number(cartData?.total_payable_amount) +
        //       (selectedTipAmount != null && selectedTipAmount != ''
        //         ? Number(selectedTipAmount)
        //         : 0)
        //     ).toFixed(2),

        //     payment_option_id: selectedPayment?.id,
        //     orderDetail: res.data,
        //   });
        // } else if (
        //   (res?.data?.payment_option_id === 8 &&
        //     !!(Number(cartData?.total_payable_amount) !== 0)) ||
        //   Number(selectedTipAmount) !== 0
        // ) {
        //   navigation.navigate(navigationStrings.YOCO, {
        //     selectedPayment: selectedPayment,
        //     total_payable_amount: (
        //       Number(cartData?.total_payable_amount) +
        //       (selectedTipAmount != null && selectedTipAmount != ''
        //         ? Number(selectedTipAmount)
        //         : 0)
        //     ).toFixed(2),

        //     payment_option_id: selectedPayment?.id,
        //     orderDetail: res.data,
        //   });
        // } else if (
        //   (res?.data?.payment_option_id === 9 &&
        //     !!(Number(cartData?.total_payable_amount) !== 0)) ||
        //   Number(selectedTipAmount) !== 0
        // ) {
        //   navigation.navigate(navigationStrings.PAYLINK, {
        //     selectedPayment: selectedPayment,
        //     total_payable_amount: (
        //       Number(cartData?.total_payable_amount) +
        //       (selectedTipAmount != null && selectedTipAmount != ''
        //         ? Number(selectedTipAmount)
        //         : 0)
        //     ).toFixed(2),
        //     payment_option_id: selectedPayment?.id,
        //     orderDetail: res.data,
        //   });
        // } else {
        // if (!!businessType && businessType == 'home_service' && res?.data?.vendors.length == 1) {
        //   // return;
        //   setTimeout(() => {
        //     _getOrderDetail(res.data.vendors[0])
        //   }, 1500);
        // } else {
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


        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const _getOrderDetail = ({ order_id, vendor_id }) => {
    // return;
    let data = {};
    data['order_id'] = order_id;
    data['vendor_id'] = vendor_id;
    // updateState({ isLoading: true });
    actions
      .getOrderDetail(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        timezone: RNLocalize.getTimeZone(),
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
        if (res?.data) {
          if (!!businessType && businessType == 'home_service' && res?.data?.vendors.length == 1 && res?.data?.vendors[0]?.dispatch_traking_url) {
            navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS, {
              orderId: order_id,
              fromVendorApp: true,
              selectedVendor: { id: vendor_id },
              orderDetail: res.data.vendors[0],
              showRating: res.data.vendors[0]?.order_status?.current_status?.id != 6 ? false : true,
            });
          } else {
            moveToNewScreen(navigationStrings.ORDERSUCESS, {
              orderDetail: res.data,
            })();
          }
        }
      })
      .catch(errorMethod);
  };

  // const setDateAndTimeSchedule = () => {
  //   if (!userData?.auth_token) {
  //     return;
  //   }
  //   let data = {};
  //   data['task_type'] = scheduleType;
  //   data['schedule_dt'] =
  //     scheduleType != 'now' && sheduledorderdate
  //       ? new Date(sheduledorderdate).toISOString()
  //       : null;

  //   actions
  //     .scheduledOrder(data, {
  //       code: appData?.profile?.code,
  //       currency: currencies?.primary_currency?.id,
  //       language: languages?.primary_language?.id,
  //       // systemuser: DeviceInfo.getUniqueId(),
  //     })
  //     .then((res) => {
  //       // getCartDetail();
  //       updateState({
  //         isLoadingB: false,
  //       });
  //     })
  //     .catch(errorMethod);
  // };

  const _finalPayment = () => {

    if (checked === 1) {
      updateState({ placeLoader: true });
      _directOrderPlace();
      return;
    }
    // if (selectedPayment?.id == 1 && selectedPayment?.off_site == 0) {
    //   updateState({ placeLoader: true });
    //   _directOrderPlace();
    //   return;
    // }
    //  else if (selectedPayment?.off_site == 1 && selectedPayment?.id === 3) {
    //   _webPayment();
    //   return;
    // } 
    // else if (
    //   selectedPayment?.off_site == 1 &&
    //   !!(
    //     selectedPayment?.id === 6 ||
    //     selectedPayment?.id === 7 ||
    //     selectedPayment?.id === 8 ||
    //     selectedPayment?.id === 9
    //   )
    // ) {
    //   updateState({ placeLoader: true });
    //   _directOrderPlace();
    //   return;
    // }

    _offineLinePayment();
  };

  // console.log("sheduledorderdate", sheduledorderdate)
  // console.log("sheduledorderdate", selectedTimeOption)
  //Clear cart
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
            _finalPayment();
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
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
    }
  };

  useEffect(() => {
    if (paramsData?.redirectFrom && !!checkCartItem?.data) {
      _directOrderPlace();
    }
  }, [paramsData?.redirectFrom]);

  const swipeRef = useRef(null);

  const openDeleteView = async (item) => {
    let itemToUpdate = cloneDeep(item);
    removeItem('selectedTable');
    removeProductFromCart(itemToUpdate);
    // updateState({ isLoadingB: true });
    // if (!!swipeRef && swipeRef?.current) {
    //     swipeRef?.current.openRight()
    // }
  };

  const swipeBtns = (progress, dragX) => {
    return (
      <Animated.View
        key={String(cartItems.length)}
        style={{
          ...styles.swipeView,
          backgroundColor: getColorCodeWithOpactiyNumber(
            themeColors.primary_color.substr(1),
            15,
          ),
          marginBottom: moderateScaleVertical(12),
        }}>
        {/* <TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={openDeleteView}>
          <Image source={imagePath.deleteRed} />
        </TouchableOpacity> */}
      </Animated.View>
    );
  };

  const _webPayment = () => {
    let selectedMethod = selectedPayment.title.toLowerCase();
    let returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/cart`;
    let cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/cart`;

    let queryData = `/${selectedMethod}?tip=${selectedTipAmount && selectedTipAmount != ''
      ? Number(selectedTipAmount)
      : 0
      }&amount=${(
        Number(cartData?.total_payable_amount) +
        (selectedTipAmount != null && selectedTipAmount != ''
          ? Number(selectedTipAmount)
          : 0)
      ).toFixed(2)}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&address_id=${selectedAddressData?.id
      }&payment_option_id=${selectedPayment?.id}&action=cart`;

    updateState({ placeLoader: true });
    actions
      .openPaymentWebUrl(
        queryData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {

        updateState({
          isLoadingB: false,
          isRefreshing: false,
          placeLoader: false,
        });
        if (res && res?.status == 'Success' && res?.data) {
          // updateState({allAvailAblePaymentMethods: res?.data});
          navigation.navigate(navigationStrings.WEBPAYMENTS, {
            paymentUrl: res?.data,
            paymentTitle: selectedPayment?.title,
            redirectFrom: 'cart',
            selectedAddressData: selectedAddressData,
            selectedPayment: selectedPayment,
          });
        }
      })
      .catch(errorMethod);
  };

  //Offline payments
  const _offineLinePayment = async () => {
    //  if (paramsData?.tokenInfo) {
    updateState({ placeLoader: true });
    let selectedMethod = selectedPayment.title.toLowerCase();
    updateState({ placeLoader: true });
    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?tip=${selectedTipAmount && selectedTipAmount != ''
          ? Number(selectedTipAmount)
          : 0
        }&amount=${cartData?.total_payable_amount}&auth_token=${userData?.auth_token
        }&address_id=${selectedAddressData?.id}&payment_option_id=${selectedPayment?.id
        }&action=cart&stripe_token=${paramsData?.tokenInfo}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({ isRefreshing: false });
        if (res && res?.status == 'Success' && res?.data) {
          // updateState({allAvailAblePaymentMethods: res?.data});
          actions.cartItemQty({});
          updateState({
            cartItems: [],
            cartData: {},
            isLoadingB: false,
            placeLoader: false,
          });
          moveToNewScreen(navigationStrings.ORDERSUCESS, {
            orderDetail: res.data,
          })();
          showSuccess(res?.message);
        } else {
          updateState({ isLoadingB: false, placeLoader: false });
        }
      })
      .catch(errorMethod);
    // } else {
    //   showError(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
    // }
  };

  // const clearSceduleDate = async () => {
  //   updateState({
  //     scheduleType: 'now',
  //     localeSheduledOrderDate: null,
  //     sheduledorderdate: null,
  //   });
  // };

  // useEffect(() => {
  //   if (
  //     scheduleType != null &&
  //     scheduleType == 'now' &&
  //     !!checkCartItem?.data
  //   ) {
  //     setDateAndTimeSchedule();
  //   }
  // }, [scheduleType]);

  // const _selectTime = (item) => {
  //   updateState({
  //     scheduleType: 'schedule',
  //     isVisibleTimeModal: true,
  //   });
  // };

  // const selectOrderDate = () => {
  //   onClose();
  //   updateState({
  //     scheduleType: 'schedule',
  //   });
  //   setDateAndTimeSchedule();
  // };

  function makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const deleteItem = async (i, index) => {
    updateState({ swipeKey: makeid(5) });
    openDeleteView(i);
    swipeRef.current.close();
    // return;

    // Animated.timing(height, {
    //   toValue: 0,
    //   duration: 350,
    //   useNativeDriver: false,
    // }).start(() => openDeleteView(i));
  };

  const getAllWishListData = () => {
    if (!!userData?.auth_token) {
      getAllWishlistItems();
      return;
    }
    updateState({ isRefreshing: false, wishlistArray: [] });
    return;
  };
  /*  GET ALL WISHLISTED ITEMS API FUNCTION  */
  const getAllWishlistItems = () => {
    // updateState({ isLoadingB: true });
    actions
      .getWishlistProducts(
        `?limit=${10}&page=${1}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({
          // isLoadingB: false,
          wishlistArray: res.data.data,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };

  const fetchPaymentSheetParams = async () => {
    let orderMetaData = {}
    orderMetaData.address_id = selectedAddressData?.id
    orderMetaData.payment_option_id = 4
    orderMetaData.type = dineInType || '';
    orderMetaData.tip = selectedTipAmount && selectedTipAmount != '' ? Number(selectedTipAmount) : 0
    const response = await actions
      .postStripeIntent(
        orderMetaData,
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
    const { paymentIntent, ephemeralKey, customer } = response
    // updateState({ clientSecret: paymentIntent })
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };


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
  };

  const openPaymentSheet = async (clientSecret) => {
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
      moveToNewScreen(navigationStrings.ORDERSUCESS, {
        // orderDetail: res.data,
      })();
      // showSuccess(res?.message);
      // Alert.alert('Success', 'The payment was confirmed successfully');
    } else if (error.code === PaymentSheetError.Failed) {
      updateState({ isPaymentMethodDisabled: false, showPlaceOrder: true, checked: '' })
      Alert.alert(
        `PaymentSheet present failed with error code: ${error.code}`,
        error.message
      );
    } else if (error.code === PaymentSheetError.Canceled) {
      updateState({ isPaymentMethodDisabled: false, showPlaceOrder: true, checked: '' })
      Alert.alert(
        `PaymentSheet present was canceled with code: ${error.code}`,
        error.message
      );
    }
    console.log('i am called 2');
    //updateState({ paymentSheetEnabled: false })
    updateState({ loading: false });
  };

  const initialisePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const address = {
      city: 'San Francisco',
      country: 'AT',
      line1: '510 Townsend St.',
      line2: '123 Street',
      postalCode: '94102',
      state: 'California',
    };
    const billingDetails = {
      name: 'Jane Doe',
      email: 'foo@bar.com',
      phone: '555-555-555',
      address: address,
    };
    // const appearance = {
    //   font: {
    //     scale: 1.1,
    //   //  family: Platform.OS === 'android' ? 'macondoregular' : 'Macondo-Regular', 
    //   },
    //   colors: {
    //     light: {
    //       primary: '#F8F8F2',
    //       background: '#FFFFFF',
    //       componentBackground: '#E6DB74',
    //       componentBorder: '#FD971F',
    //       componentDivider: '#FD971F',
    //       primaryText: '#F8F8F2',
    //       secondaryText: '#75715E',
    //       componentText: '#AE81FF',
    //       placeholderText: '#E69F66',
    //       icon: '#F92672',
    //       error: '#F92672',
    //     },
    //     dark: {
    //       primary: '#00ff0099',
    //       background: '#ff0000',
    //       componentBackground: '#ff0080',
    //       componentBorder: '#62ff08',
    //       componentDivider: '#d6de00',
    //       primaryText: '#5181fc',
    //       secondaryText: '#ff7b00',
    //       componentText: '#00ffff',
    //       placeholderText: '#00ffff',
    //       icon: '#f0f0f0',
    //       error: '#0f0f0f',
    //     },
    //   },
    //   shapes: {
    //     borderRadius: 10,
    //     borderWidth: 1,
    //     shadow: {
    //       opacity: 1,
    //       color: '#ffffff',
    //       offset: { x: -5, y: -5 },
    //       blurRadius: 1,
    //     },
    //   },
    //   primaryButton: {
    //     colors: {
    //       background: '#000000',
    //       text: '#ffffff',
    //       border: '#ff00ff',
    //     },
    //     shapes: {
    //       borderRadius: 10,
    //       borderWidth: 2,
    //       shadow: {
    //         opacity: 1,
    //         color: '#80ffffff',
    //         offset: { x: 5, y: 5 },
    //         blurRadius: 1,
    //       },
    //     },
    //   },
    // };
    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      customFlow: false,
      merchantDisplayName: 'Example Inc.',
      applePay: { merchantCountryCode: 'US' },
      style: 'automatic',
      googlePay: {
        merchantCountryCode: 'US',
        testEnv: true,
      },
      returnURL: 'stripe-example://stripe-redirect',
      defaultBillingDetails: billingDetails,
      allowsDelayedPaymentMethods: true,
      appearance
    });
    if (!error) {
      setPaymentSheetEnabled(true);
    } else if (error.code === PaymentSheetError.Failed) {
      Alert.alert(
        `PaymentSheet init failed with error code: ${error.code}`,
        error.message
      );
    } else if (error.code === PaymentSheetError.Canceled) {
      Alert.alert(
        `PaymentSheet init was canceled with code: ${error.code}`,
        error.message
      );
    }
  };
  const _renderItem = ({ item, index }) => {
    return (
      <View>
        {/* {index === 0 && (
          <View style={Platform.OS === 'ios' ? { zIndex: 5000 } : {}}>
            {dineInType === 'dine_in' &&
              userData?.auth_token &&
              !!cartData?.vendor_details?.vendor_tables && (
                <DropDownPicker
                  items={tableData}
                  onOpen={() => updateState({ isTableDropDown: true })}
                  onClose={() => updateState({ isTableDropDown: false })}
                  defaultValue={
                    deepLinkUrl
                      ? deepLinkUrl == 1
                        ? tableData[0]?.label
                        : tableData[1]?.label
                      : tableData[0]?.label || ''
                  }
                  containerStyle={styles.dropDownContainerStyle}
                  style={{
                    marginHorizontal: moderateScale(20),
                    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.greyColor1,
                  }}
                  labelStyle={
                    isDarkMode
                      ? { color: MyDarkTheme.colors.text }
                      : { color: colors.textGrey }
                  }
                  itemStyle={{
                    justifyContent: 'flex-start',
                    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                  }}
                  dropDownStyle={{
                    ...styles.dropDownStyle,
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.greyColor1,
                  }}
                  onChangeItem={(item) => _onTableSelection(item)}
                />
              )}
          </View>
        )} */}
        <View
          key={swipeKey}
          style={{
            ...styles.mainViewRednderItem,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          <View style={styles.vendorView}>
            <Text
              numberOfLines={1}
              style={{
                ...styles.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black
              }}>
              {item?.vendor?.name}
            </Text>
          </View>
          {/************ start  render cart items *************/}
          {item?.vendor_products.length
            ? item?.vendor_products.map((i, inx) => {
              return (
                <Swipeable
                  ref={swipeRef}
                  key={swipeKey}
                  renderRightActions={swipeBtns}
                  onSwipeableOpen={() => deleteItem(i, index)}
                  rightThreshold={width / 1.4}
                // overshootFriction={8}
                >
                  <Animated.View
                    style={{
                      backgroundColor: isDarkMode
                        ? MyDarkTheme.colors.lightDark
                        : colors.transactionHistoryBg,
                      marginBottom: moderateScaleVertical(12),
                      marginRight: moderateScale(8),
                      borderRadius: moderateScale(10),
                      transform: [],
                      minHeight: height * 0.125,
                    }}
                    key={inx}>
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

                          <View
                            pointerEvents={btnLoader ? 'none' : 'auto'}
                            style={{
                              flex: 0.3,
                              paddingRight: moderateScale(8),
                            }}>
                            <View style={styles.incDecBtnContainer}>
                              <TouchableOpacity
                                style={{ flex: 0.3, alignItems: 'center' }}
                                onPress={() => addDeleteCartItems(i, inx, 2)}>
                                <Text style={styles.cartItemValueBtn}>-</Text>
                              </TouchableOpacity>
                              <View style={{ flex: 0.4, alignItems: 'center' }}>
                                {btnLoadrId === i.id && btnLoader ? (
                                  <UIActivityIndicator
                                    size={moderateScale(18)}
                                    color={colors.white}
                                  />
                                ) : (
                                  <Text style={styles.cartItemValue}>
                                    {i?.quantity}
                                  </Text>
                                )}
                              </View>
                              <TouchableOpacity
                                style={{ flex: 0.3, alignItems: 'center' }}
                                onPress={() => addDeleteCartItems(i, inx, 1)}>
                                <Text style={styles.cartItemValueBtn}>+</Text>
                              </TouchableOpacity>
                            </View>
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
                        <TouchableOpacity
                          style={{
                            alignSelf: 'flex-end',
                            paddingRight: moderateScale(24),
                            paddingTop: moderateScaleVertical(10),
                          }}
                          onPress={() => openDeleteView(i)}>
                          <Image source={imagePath.deleteRed} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* <View style={styles.dashedLine} /> */}
                  </Animated.View>
                </Swipeable>
              );
            })
            : null}
          {/************ end render cart items *************/}
          {item?.isDeliverable ? null : (
            <View style={{ marginHorizontal: moderateScale(10) }}>
              <Text
                style={{
                  fontSize: moderateScale(12),
                  fontFamily: fontFamily.medium,
                  color: colors.redFireBrick,
                }}>
                {strings.ITEM_NOT_DELIVERABLE}
              </Text>
            </View>
          )}

          {/* offerview */}
          {/* <TouchableOpacity
            disabled={item?.couponData ? true : false}
            onPress={() => _getAllOffers(item.vendor, cartData)}
            style={styles.offersViewB}>
            {item?.couponData ? (
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View
                  style={{
                    flex: 0.7,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{ tintColor: themeColors.primary_color }}
                    source={imagePath.percent}
                  />
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.viewOffers,
                      { marginLeft: moderateScale(10) },
                    ]}>
                    {`${strings.CODE} ${item?.couponData?.name} ${strings.APPLYED}`}
                  </Text>
                </View>
                <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
              //    <Image source={imagePath.crossBlueB}  />
                  <Text
                    onPress={() => _removeCoupon(item, cartData)}
                    style={[
                      styles.removeCoupon,
                      { color: colors.cartItemPrice },
                    ]}>
                    {strings.REMOVE}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  style={{ tintColor: themeColors.primary_color }}
                  source={imagePath.percent}
                />
                <Text
                  style={[styles.viewOffers, { marginLeft: moderateScale(10) }]}>
                  {strings.APPLY_PROMO_CODE}
                </Text>
              </View>
            )}
          </TouchableOpacity> */}
          {/* { apply wallet} */}
          {/* <View style={styles.container}>
           <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                    },
                  ]
                  : styles.priceItemLabel
              }> {strings.DEDUCT_FROM_WALLET}</Text>
              <Switch value={isWalletEnabled} onChange={toggleSwitch} />
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
            {!!item?.discount_amount && (
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
            )}
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
            {!!item?.deliver_charge && (
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
            )}
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


            {!!appData?.profile?.preferences?.tip_before_order &&
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
              )}

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
      </View>
    );
  };

  const setModalVisible = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({
        updateData: data,
        isVisible: visible,
        type: type,
        selectedId: id,
      });
    } else {
      // showError(strings.UNAUTHORIZED_MESSAGE);
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
    }
  };
  const setModalVisibleForAddessModal = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({ isVisible: false });
      setTimeout(() => {
        updateState({
          updateData: data,
          isVisibleAddressModal: visible,
          type: type,
          selectedId: id,
        });
      }, 1000);
    } else {
      // showError(strings.UNAUTHORIZED_MESSAGE);
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
    }
  };

  const selectedTip = (tip, tipIndex) => {
    updateState({ selectedTipvalue: null, selectedTipAmount: null, isLoadingB: true });
    console.log(tip, tipIndex, 'from tip');
    let data = {}
    data.cart_id = cartData?.id;
    data.tip_amount = tip.value;
    data.tip_index = tipIndex
    actions
      .addTip(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        if (res) {
          showSuccess(res?.message);
          getCartDetail();
          updateState({ isLoadingB: false });
        } else {
          updateState({ isLoadingB: false });
        }
      })
      .catch(errorMethod);
    // if (selectedTipvalue == 'custom') {
    //   updateState({ selectedTipvalue: tip, selectedTipAmount: null });
    // } else {
    //   if (selectedTipvalue && selectedTipvalue?.value == tip?.value) {
    //     updateState({ selectedTipvalue: null, selectedTipAmount: null });
    //   } else {
    //     updateState({ selectedTipvalue: tip, selectedTipAmount: tip?.value });
    //   }
    // }
  };
  const selectedCustomTip = () => {
    if (selectedTipvalue == 'custom') {
      updateState({ selectedTipvalue: null, selectedTipAmount: null });
    } else { updateState({ selectedTipvalue: 'custom' }); }
  };
  const onSubmitEdit = () => {
    updateState({ isLoadingB: true });
    let data = {}
    data.cart_id = cartData?.id;
    data.tip_amount = selectedTipAmount;
    actions
      .addTip(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        if (res) {
          showSuccess(res?.message);
          getCartDetail();
          updateState({ isLoadingB: false, selectedTipvalue: null, selectedTipAmount: null });
        } else {
          updateState({ isLoadingB: false, selectedTipvalue: null, selectedTipAmount: null });
        }
      })
      .catch(errorMethod);
  }
  // const onPressPickUplater = () => {
  //   updateState({
  //     isVisibleTimeModal: true,
  //   });
  // };
  //Footer section in cart screen

  const getFooter = () => {
    return (
      <>
        {/* Add instruction */}
        {/* <TouchableOpacity
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={styles.addInstruction}>{strings.ADD_INSTRUCTIONS}</Text>
        </TouchableOpacity> */}
        <TextInput
          value={instruction}
          onChangeText={(instruction) => updateState({ instruction })}
          multiline={true}
          numberOfLines={4}
          style={{
            ...styles.instructionView,
            backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.greyNew,
          }}
          placeholderTextColor={
            isDarkMode ? colors.textGreyB : colors.textGreyB
          }
          // placeholder={strings.ANY_RESTAURANT_REQUESTS}
          placeholder={'Special Instruction'}
        />
        {/* <View style={{ height: moderateScaleVertical(20) }} /> */}


        {/* select payment method */}
        {/* {(Number(cartData?.total_payable_amount) +
          (selectedTipAmount != null && selectedTipAmount != ''
            ? Number(selectedTipAmount)
            : 0)
        ).toFixed(2) > 0 &&
          <View>
            <RadioButton.Item
              value={1}
              label={strings.CASH_ON_DELIVERY}
              status={checked === 1 ? 'checked' : 'unchecked'}
              onPress={() => {
                //  setChecked(1)
                updateState({ checked: 1 })
              }}
              disabled={isPaymentMethodDisabled}
            />
            <RadioButton.Item
              value={2}
              label={strings.PAY_BY_CARD}
              status={checked === 2 ? 'checked' : 'unchecked'}
              onPress={() => {
                // setChecked(2)
                updateState({ showPlaceOrder: false, isPaymentMethodDisabled: true, checked: 2 })
                initialisePaymentSheet()
              }}
              disabled={isPaymentMethodDisabled}
            />
          </View>} */}
        {/* <TouchableOpacity
          onPress={() =>
            !!userData?.auth_token
              ? moveToNewScreen(navigationStrings.ALL_PAYMENT_METHODS)()
              : navigation.navigate(navigationStrings.OUTER_SCREEN, {})
          }
          style={{
            ...styles.paymentMainView,
            borderColor: isPaymentMethodSelected === 2 ? 'red' : 'white',
            borderWidth: isPaymentMethodSelected === 2 ? 1 : 0
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={isDarkMode && { tintColor: MyDarkTheme.colors.text }}
              source={imagePath.paymentMethod}
            />
            <Text
              style={{
                ...styles.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                marginLeft: moderateScale(4),
              }}>
              {selectedPayment.title_lng
                ? selectedPayment.title_lng
                : selectedPayment.title
                  ? selectedPayment.title
                  : strings.SELECT_PAYMENT_METHOD}
            </Text>
          </View>
          <View>
            <Image
              source={imagePath.goRight}
              style={
                isDarkMode
                  ? {
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    tintColor: MyDarkTheme.colors.text,
                  }
                  : { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }
              }
            />
          </View>
        </TouchableOpacity> */}

        {/* {payment submit button} */}
        {/* {userData ? (
          <View
            style={{
              flexDirection: 'row',
              marginVertical: moderateScaleVertical(20),
              marginHorizontal: moderateScale(10),
            }}>
            {selectedTimeOptions.map((i, inx) => {
              return (
                <TouchableOpacity
                  onPress={() => _selectTime(i)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor:
                      selectedTimeOption && selectedTimeOption?.id == i.id
                        ? themeColors?.primary_color
                        : getColorCodeWithOpactiyNumber(
                          themeColors.primary_color.substr(1),
                          20,
                        ),
                    borderColor: themeColors.primary_color,
                    borderWidth:
                      selectedTimeOption && selectedTimeOption?.id == i.id
                        ? 1
                        : 0,
                    borderRadius: 10,
                    marginRight: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.medium,
                      color:
                        selectedTimeOption && selectedTimeOption?.id == i.id
                          ? colors.white
                          : themeColors.primary_color,
                    }}>
                    {i.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <View
              style={{
                justifyContent: 'center',
              }}>
              {selectedTimeOption?.type === 'now' ? null : (
                <Text
                  style={
                    isDarkMode
                      ? { color: MyDarkTheme.colors.text }
                      : { color: colors.black }
                  }>
                  {sheduledorderdate && scheduleType
                    ? `${moment(sheduledorderdate).format('DD MMM,YYYY HH:mm')}`
                    : null}
                </Text>
              )}
            </View>
          </View>
        ) : null} */}

        {/* {!!(
          userData?.auth_token &&
          !appData?.profile?.preferences?.off_scheduling_at_cart
        ) &&
          scheduleType == 'schedule' && (
            <TouchableOpacity
              style={{
                marginTop: moderateScale(16),
                marginLeft: moderateScale(16),
                alignSelf: 'flex-start',
              }}
              onPress={clearSceduleDate}>
              <Text
                style={{
                  fontFamily: fontFamily?.bold,
                  color: themeColors.primary_color,
                  textAlign: 'left',
                }}>
                {strings.CLEAR_SCHEDULE_DATE}
              </Text>
            </TouchableOpacity>
          )} */}

        {/* {!!cartData?.deliver_status && (nearestSavedAddress?.address || selectedAddress) && ( */}
          <View
            pointerEvents={placeLoader ? 'none' : 'auto'}
            style={styles.paymentView}>
            {/* {!!(
              userData?.auth_token &&
              !appData?.profile?.preferences?.off_scheduling_at_cart
            ) && (
                <ButtonComponent
                  onPress={_selectTime}
                  btnText={
                    localeSheduledOrderDate
                      ? localeSheduledOrderDate
                      : strings.SCHEDULE_ORDER
                  }
                  borderRadius={moderateScale(13)}
                  textStyle={{ color: themeColors.primary_color }}
                  containerStyle={{
                    ...styles.placeOrderButtonStyle,
                    backgroundColor: colors.transparent,
                    borderColor: themeColors.primary_color,
                    borderWidth: 0.8,
                  }}
                />
              )} */}

            <ButtonComponent
              onPress={() => {
  
                  console.log(userData?.auth_token,'THIS IS MY TOKEN')
                if (userData?.auth_token  && (nearestSavedAddress?.address || selectedAddress)) {

                  if(!!cartData?.deliver_status)
                       { 
                        if (userData) {
                          if (
                            !!userData?.verify_details?.is_email_verified &&
                            !!userData?.verify_details?.is_phone_verified
                          ) {
                
                            // updateState({ placeLoader: true });
                            // _directOrderPlace();
                            // return;
                            moveToNewScreen(navigationStrings.ALL_PAYMENT_METHODS, {
                                cart_id : cartData?.id,
                                specific_instructions : instruction,
                              // orderDetail: res.data,
                                 })();
                
                          } else {
                            moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {
                               orginScreenIndex : 1
                            })();
                          }
                        } 
                      }
                } else if(userData?.auth_token  && !(nearestSavedAddress?.address && selectedAddress)) {
                  // showError(strings.UNAUTHORIZED_MESSAGE);
                  //add adrees pop up
                  setModalVisibleForAddessModal(true, 'addAddress')
                  //moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
                } else{
                  moveToNewScreen(navigationStrings.OUTER_SCREEN, { orginScreenIndex : 1})();
                }
                //  placeOrder()
                // checked === 1 ? placeOrder() : openPaymentSheet()
                // isPaymentMethodSelected === 3 ? placeOrder() : updateState({ isPaymentMethodSelected: 2 });
              }}
              btnText={strings.MAKE_PAYMENT}
              borderRadius={moderateScale(13)}
              textStyle={{ color: colors.white }}
              containerStyle={(cartData?.deliver_status === 0)  ?  (userData?.auth_token ? ({ flex: 1,marginHorizontal: moderateScale(5)})  : 
              {backgroundColor: themeColors.primary_color,flex: 1,marginHorizontal: moderateScale(5)})  :   {backgroundColor: themeColors.primary_color,flex: 1,marginHorizontal: moderateScale(5)}}
              placeLoader={placeLoader}
              disabled={(cartData?.deliver_status === 0) ?  (userData?.auth_token ?  true : false)  : false }
            // disabled={!paymentSheetEnabled}
            />
          </View>
        {/* )} */}
        {!!cartData &&
          !!cartData?.upSell_products &&
          !!cartData?.upSell_products.length && (
            <View
              style={{
                ...styles.suggetionView,
              }}>
              <Text
                style={{
                  ...styles.priceItemLabel2,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {strings.FREQUENTLY_BOUGHT_TOGETHER}
              </Text>
              <View style={{ height: moderateScaleVertical(16) }} />
              <FlatList
                data={cartData?.upSell_products || []}
                renderItem={_renderUpSellProducts}
                showsHorizontalScrollIndicator={false}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      marginRight: moderateScale(16),
                    }}
                  />
                )}
                ListFooterComponent={() => (
                  <View style={{ marginRight: moderateScale(16) }} />
                )}
              />
            </View>
          )}
        {!!cartData &&
          !!cartData?.crossSell_products &&
          !!cartData?.crossSell_products.length && (
            <View style={{ ...styles.suggetionView }}>
              <Text
                style={{
                  ...styles.priceItemLabel2,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {strings.YOU_MIGHT_INTERESTED}
              </Text>
              <View style={{ height: moderateScaleVertical(16) }} />
              <FlatList
                data={cartData?.crossSell_products || []}
                renderItem={_renderCrossSellProducts}
                showsHorizontalScrollIndicator={false}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      marginRight: moderateScale(16),
                    }}
                  />
                )}
                ListFooterComponent={() => (
                  <View style={{ marginRight: moderateScale(16) }} />
                )}
              />
            </View>
          )}
        <View
          style={{
            height: moderateScaleVertical(65),
            backgroundColor: colors.transparent,
          }}></View>
      </>
    );
  };

  //Header section of cart screen
  const getHeader = () => {
    return (
      <View>
        <View
          style={{
            ...styles.topLable,
            marginVertical: moderateScale(7),
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', flex: 0.85 }}>
            <Image source={imagePath.icMap} />
            <View style={styles.addressView}>
              <Text
                style={{
                  ...styles.homeTxt,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {/* {strings.HOME} */}
                {nearestSavedAddress
                  ?  addressType(nearestSavedAddress.type)
                  : selectedAddressData
                    ? addressType(selectedAddressData.type)
                    : null}
                {/* {selectedAddressData && addressType(selectedAddressData.type)} */}
              </Text>
            { ( !(nearestSavedAddress?.address) &&
               !(selectedAddressData?.address) ) ?
              // <TouchableOpacity
              //   activeOpacity={0.7}
              //   onPress={() => {
              //     //  if(!(nearestSavedAddress?.address) && !(selectedAddressData?.address))
              //     setModalVisibleForAddessModal(true, 'addAddress')
              //     //  else { setModalVisible(true)} 
              //     //setModalVisible(true)
              //   }}>
              //   <Text
              //     numberOfLines={2}
              //     style={{
              //       ...styles.addAddressTxt,
              //       color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              //       marginTop: moderateScaleVertical(4)
              //     }}>
              //     {strings.ADD_ADDRESS}
              //   </Text>
              // </TouchableOpacity> :
              <TransparentButtonWithTxtAndIcon
              btnText={strings.ADD_NEW_ADDRESS}
              icon={imagePath.add}
              onPress={()=>    setModalVisibleForAddessModal(true, 'addAddress')}
              textStyle={
                isDarkMode
                  ? {marginLeft: 10, color: MyDarkTheme.colors.text}
                  : {marginLeft: 10}
              }
              borderRadius={moderateScale(10)}
              btnStyle={
                { height:'80%'}
              }
             // containerStyle={{marginHorizontal: 20, alignItems: 'flex-start'}}
              //marginBottom={moderateScaleVertical(20)}
            /> : 
              <Text
                numberOfLines={2}
                style={{
                  ...styles.addAddressTxt,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  marginTop: moderateScaleVertical(4)
                }}>
                {nearestSavedAddress
                  ? nearestSavedAddress.address
                  : selectedAddressData
                    ? selectedAddressData?.address
                    : null}
              </Text> }
            </View>
          </View>
          { ( !(nearestSavedAddress?.address) &&
               !(selectedAddressData?.address) ) ? null :
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              //  if(!(nearestSavedAddress?.address) && !(selectedAddressData?.address))
              //    setModalVisibleForAddessModal(true, 'addAddress')
              //  else { setModalVisible(true)} 
              setModalVisible(true)
            }}>
            <Image
              source={imagePath.icEdit1}
              style={styles.editIcon}
              resizeMode="contain"
            />
          </TouchableOpacity> }

          {/* {!nearestSavedAddress && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setModalVisible(true)}>
            <Image
              source={imagePath.icEdit1}
              style={styles.editIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )} */}
        </View>
        {!(nearestSavedAddress?.address) &&
          !(selectedAddressData?.address)
          && (
            <View style={{ marginHorizontal: moderateScale(10) }}>
              <Text
                style={{
                  fontSize: moderateScale(12),
                  fontFamily: fontFamily.medium,
                  color: colors.redFireBrick,
                }}>
                {strings.ADDRESS_NOT_ADDED}
              </Text>
            </View>
          )}
      </View>
    );
  };

  //Native modal for Modal
  const openClearCartModal = () => {
    Alert.alert('', strings.AREYOUSURE, [
      {
        text: strings.CANCEL,
        onPress: () => { },
        // style: 'destructive',
      },
      { text: strings.CONFIRM, onPress: () => bottomButtonClick() },
    ]);
  };
  //SelectAddress
  const selectAddress = (address) => {
    if (!!userData?.auth_token) {
      updateState({ isLoadingB: true });
      let data = {};
      let query = `/${address?.id}`;
      actions
        .setPrimaryAddress(query, data, {
          code: appData?.profile?.code,
        })
        .then((res) => {
          actions.saveAddress(address);
          updateState({
            isVisible: false,
            isLoadingB: false,
            selectedAddress: address,
          });
        })
        .catch((error) => {
          updateState({ isLoadingB: false });
          showError(error?.message || error?.error);
        });
    }
  };

  //Add and update the addreess
  const addUpdateLocation = (childData) => {
    // setModalVisible(false);
   updateState({ isLoading: true , isLoadingB: true});
    actions
      .addAddress(childData, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        updateState({
          isLoading: false,
        //  isLoadingB: false,
          isVisible: false,
          isVisibleAddressModal: false,
        });
        getAllAddress();
        setTimeout(() => {
          let address = res.data;
          address['is_primary'] = 1;

          updateState({
            selectedAddress: address,
          });
          actions.saveAddress(address);
        });

        showSuccess(res.message);
      })
      .catch((error) => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          isVisible: false,
          isVisibleAddressModal: false,
        });
        showError(error?.message || error?.error);
      });
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ pageNo: 1, isRefreshing: true });
  };

  const onClose = () => {
    updateState({
      isVisibleTimeModal: false,
    });
  };

  // const onDateChange = (value) => {
  //   updateState({
  //     sheduledorderdate: value,
  //     localeSheduledOrderDate: `${value.toLocaleDateString(selectedLanguage, {
  //       year: 'numeric',
  //       month: 'short',
  //       day: 'numeric',
  //     })}, ${value.toLocaleTimeString(selectedLanguage, {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     })}`,
  //   });
  // };

  // console.log(
  //   moment(selectOrderDate)
  //     .format('DD MMM, YYYY HH:mm')
  //     .toLocaleDateString('fr-FR'),
  //   'djkjfjdfkdkj',
  // );

  // useEffect(() => {
  //   if (!!checkCartItem?.data) {
  //     getItem('deepLinkUrl')
  //       .then((res) => {
  //         if (res) {
  //           let table_number = getParameterByName('table', res);
  //           updateState({ deepLinkUrl: table_number });
  //         }
  //       })
  //       .catch((error) => {
  //         showError(error.message);
  //       });
  //   }
  // }, [deepLinkUrl]);

  // const _onTableSelection = (item) => {
  //   const data = {
  //     vendor_id: item.vendor_id,
  //     table: item.table_number,
  //   };
  //   actions
  //     .vendorTableCart(data, {
  //       code: appData?.profile?.code,
  //     })
  //     .then((res) => {
  //       removeItem('deepLinkUrl');
  //       setItem('selectedTable', item?.label);
  //     })
  //     .catch((error) => {
  //       updateState({
  //         isLoading: false,
  //         isLoadingB: false,
  //       });
  //       showError(error?.message || error?.error);
  //     });
  // };

  const onPressRecommendedVendors = (item) => {
    if (!item.is_show_category || item.is_show_category) {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
          item,
          rootProducts: true,
          // categoryData: data,
        })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: item?.id,
          vendor: true,
          name: item?.name,
        })();

      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  const renderRecommendedVendors = ({ item }) => {
    return (
      <View
        style={{
          width: moderateScale(width / 2),
          marginLeft: moderateScale(5),
        }}>
        <MarketCard3
          data={item}
          extraStyles={{ marginTop: 0, marginVertical: moderateScaleVertical(2) }}
          fastImageStyle={{
            height: moderateScaleVertical(110),
          }}
          imageResizeMode="cover"
          onPress={() => onPressRecommendedVendors(item)}
        />
      </View>
    );
  };

  const ListEmptyComp = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
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
        </View>
        <HorizontalLine
          lineStyle={{
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode
              ? colors.whiteOpacity77
              : colors.greyA,
            marginVertical: moderateScaleVertical(16),
          }}
        />
        {wishlistArray.length > 0 && (
          <View>
            <Text
              style={{
                ...styles.commTextStyle,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.SHOP_FROM_WISHLIST}
            </Text>
            {wishlistArray.map((val, i) => {
              return (
                <View key={String(i)}>
                  <WishlistCard
                    data={val.product}
                    onPress={moveToNewScreen(
                      navigationStrings.PRODUCTDETAIL,
                      val.product,
                    )}
                  />
                </View>
              );
            })}
          </View>
        )}
        <View style={{ marginVertical: moderateScaleVertical(8) }} />

        {recommendedVendorsdata && recommendedVendorsdata.length > 0 && (
          <View>
            <Text
              style={{
                ...styles.commTextStyle,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.RECOMMENDED_VENDORS}
            </Text>
            <FlatList
              horizontal
              data={recommendedVendorsdata}
              renderItem={renderRecommendedVendors}
              keyExtractor={(item, index) => item?.id.toString()}
              keyboardShouldPersistTaps="always"
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            />
          </View>
        )}

        <View style={{ marginBottom: moderateScale(100) }} />
      </View>
    );
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

  const _renderUpSellProducts = ({ item }) => {
    return (
      <ProductsComp
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
      />
    );
  };

  const _renderCrossSellProducts = ({ item }) => {
    return (
      <ProductsComp
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
      />
    );
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
        centerTitle={strings.BASKET}
        leftIcon={imagePath.icBackb}
        isRightText={cartItems && cartItems?.length}
        onPressRightTxt={() => openClearCartModal()}
      />
      <View
        style={
          isDarkMode
            ? [
              styles.mainComponent,
              { backgroundColor: MyDarkTheme.colors.background },
            ]
            : styles.mainComponent
        }>
        {/* <SwipeListView
          disableRightSwipe
          data={cartItems}
          renderItem={_renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={width}
          // onSwipeValueChange={onSwipeValueChange}
          useNativeDriver={false}
        /> */}
        <FlatList
          key={swipeKey}
          data={cartItems}
          extraData={cartItems}
          ListHeaderComponent={cartItems?.length ? getHeader() : null}
          ListFooterComponent={cartItems?.length ? getFooter() : null}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: colors.backgroundGrey }}
          keyExtractor={(item, index) => String(index)}
          renderItem={_renderItem}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }
          contentContainerStyle={{
            flexGrow: 1,
          }}
          ListEmptyComponent={() => (!isLoadingB ? <ListEmptyComp /> : <></>)}
        />
      </View>
      {!!isModalVisibleForClearCart && (
        <ConfirmationModal
          closeModal={() => closeOptionModal()}
          ShowModal={isModalVisibleForClearCart}
          showBottomButton={true}
          mainText={strings.AREYOUSURE}
          bottomButtonClick={bottomButtonClick}
          updateStatus={(item) => updateStatus(item)}
        />
      )}
      <ChooseAddressModal
        isVisible={isVisible}
        onClose={() => setModalVisible(false)}
        openAddressModal={() =>
          setModalVisibleForAddessModal(true, 'addAddress')
        }
        selectAddress={(data) => selectAddress(data)}
        selectedAddress={selectedAddressData}
      />
      <AddressModal3
        isVisible={isVisibleAddressModal}
        onClose={() => setModalVisibleForAddessModal(false)}
        type={type}
        passLocation={(data) => addUpdateLocation(data)}
      />

      {/* Date time modal */}
      {/* <Modal
        transparent={true}
        isVisible={isVisibleTimeModal}
        animationType={'none'}
        style={styles.modalContainer}
        onLayout={(event) => {
          updateState({ viewHeight: event.nativeEvent.layout.height });
        }}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Image
            style={isDarkMode && { tintColor: MyDarkTheme.colors.white }}
            source={imagePath.crossB}
          />
        </TouchableOpacity>
        <View
          style={
            isDarkMode
              ? [
                styles.modalMainViewContainer,
                { backgroundColor: MyDarkTheme.colors.lightDark },
              ]
              : styles.modalMainViewContainer
          }>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={
              isDarkMode
                ? [
                  styles.modalMainViewContainer,
                  { backgroundColor: MyDarkTheme.colors.lightDark },
                ]
                : styles.modalMainViewContainer
            }>
            <View
              style={{
                // flex: 0.6,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <Text
                style={
                  isDarkMode
                    ? [styles.carType, { color: MyDarkTheme.colors.text }]
                    : styles.carType
                }>
                {strings.SELECTDATEANDTIME}
              </Text>
            </View>

            <View
              style={{
                alignItems: 'center',
                height: height / 3.5,
              }}>
              <DatePicker
                locale={selectedLanguage}
                date={
                  sheduledorderdate ? new Date(sheduledorderdate) : new Date()
                }
                textColor={isDarkMode ? colors.white : colors.blackB}
                mode="datetime"
                minimumDate={new Date()}
                maximumDate={undefined}
                style={styles.datetimePickerText}
                // onDateChange={setDate}
                onDateChange={(value) => onDateChange(value)}
              />
            </View>
          </ScrollView>
          <View
            style={[
              styles.bottomAddToCartView,
              { top: viewHeight - height / 6 },
            ]}>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              // textStyle={styles.textStyle}
              onPress={selectOrderDate}
              marginTop={moderateScaleVertical(10)}
              marginBottom={moderateScaleVertical(30)}
              btnText={strings.SELECT}
            />
          </View>
        </View>
      </Modal> */}
    </WrapperContainer>
  );
}
