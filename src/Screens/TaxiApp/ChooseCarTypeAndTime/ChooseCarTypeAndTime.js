import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView, { Callout, PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import MapViewDirections from 'react-native-maps-directions';
import { useSelector } from 'react-redux';
import { loaderOne } from '../../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { showError, showSuccess } from '../../../utils/helperFunctions';
import SelectCarModalView from './SelectCarModalView';
import SelectPaymentModalView from './SelectPaymentModalView';
import SelectTimeModalView from './SelectTimeModalView';
import SelectVendorModalView from './SelectVendorModalView';
import stylesFun from './styles';
import * as RNLocalize from 'react-native-localize';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../../../styles/theme';
import strings from '../../../constants/lang';
import PaymentProcessingModal from '../../CourierService/PaymentProcessingModal';
import CustomAnimatedLoader from '../../../Components/CustomAnimatedLoader';
import { BlurView } from '@react-native-community/blur';
import { useFocusEffect } from '@react-navigation/native';
import { mapStyleGrey ,mapStyleDark} from '../../../utils/constants/MapStyle';
import {
  CardField, createToken, initStripe, useStripe,
  BillingDetails,
  Address,
  PaymentSheetError,
} from '@stripe/stripe-react-native';
import {defaultLoader} from '../../../Components/Loaders/AnimatedLoaderFiles';
import Loader from '../../../Components/Loader';
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const  ChooseCarTypeAndTime= ({ navigation, route }) =>{
  console.log("TaxiApp - ChooseCarTypeAndTime.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route?.params;

  const { appData, currencies, languages, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state?.auth?.userData);
  const [messageTxt, setMessage] = useState("")
  const [pickDropData, setPickDropData] = useState(null)

  
  const fontFamily = appStyle?.fontSizeData;
  const [refArr, setRefArr] = useState([]);
  const [state, setState] = useState({
    region: {
      latitude: paramData?.location[0]?.latitude
        ? Number(paramData?.location[0].latitude)
        : 24.453623899247518,
      longitude: paramData?.location[0]?.longitude
        ? Number(paramData?.location[0].longitude)
        : 54.377588682560805,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    coordinate: {
      latitude: paramData?.location[0]?.latitude
        ? Number(paramData?.location[0].latitude)
        : 24.453623899247518,
      longitude: paramData?.location[0]?.longitude
        ? Number(paramData?.location[0].longitude)
        : 54.377588682560805,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    isLoading: false,
    addressLabel: 'Glenpark',
    formattedAddress: '8502 Preston Rd. Inglewood, Maine 98380',
    availableVendors: paramData?.cabVendors,
    availableCarList: [],
    availAbleTimes: [
      {
        id: 1,
        label: 'in 20 min.',
      },
      {
        id: 2,
        label: 'in 50 min.',
      },
      {
        id: 3,
        label: 'in 80 min.',
      },
    ],
    selectedCarOption: null,
    selectedAvailableTimeOption: null,
    showVendorModal: false,
    showCarModal: true,
    showTimeModal: false,
    showPaymentModal: false,
    redirectFromNow: false,
    date: new Date(),

    slectedDate: paramData?.datetime?.slectedDate
      ? paramData?.datetime?.slectedDate
      : moment(date).format('YYYY-MM-DD'),
    selectedTime: paramData?.datetime?.selectedTime
      ? paramData?.datetime?.selectedTime
      : moment(date).format('LT'),

    isModalVisible: false,
    pickUpTimeType: paramData?.pickUpTimeType
      ? paramData?.pickUpTimeType
      : null,
    selectedDateAndTime: `${moment().format('YYYY-MM-DD')} ${moment().format(
      'H:MM',
    )}`,
    selectedVendorOption: paramData?.cabVendors[0]
      ? paramData?.cabVendors[0]
      : null,
    pageNo: 1,
    limit: 12,
    isLoadingB: false,
    totalDistance: 0,
    totalDuration: 0,
    updatedAmount: null,
    couponInfo: null,
    loyalityAmount: null,
    isTimerPickerModal: false,
    formatedTime: moment().format('hh:mm A'),
    isDatePickerModal: false,
    pickedUpTime: paramData?.datetime?.selectedTime
      ? paramData?.datetime?.selectedTime
      : moment().format('hh:mm A'),
    selectedDate: moment().format('YYY-MM-DD'),
    pickedUpDate: paramData?.datetime?.slectedDate
      ? paramData?.datetime?.slectedDate
      : moment().format('YYYY-MM-DD'),
    selectedPayment: { id: 1, title: 'Cash On Delivery', image: imagePath.cash },
    isWalletEnabled: false,
    delivery_tags_price: 0,
    delivery_cart_id: 0,

    default_Date: paramData?.datetime?.slectedDate
    ? paramData?.datetime?.slectedDate
    : moment().format('YYYY-MM-DD'),
    default_Time: paramData?.datetime?.selectedTime
    ? paramData?.datetime?.selectedTime
    : moment().format('hh:mm A'),
  });
  const {
    selectedPayment,
    couponInfo,
    updatedAmount,
    totalDistance,
    totalDuration,
    showVendorModal,
    selectedDateAndTime,
    pickUpTimeType,
    isModalVisible,
    isLoading,
    addressLabel,
    formattedAddress,
    region,
    coordinate,
    availableCarList,
    selectedCarOption,
    selectedAvailableTimeOption,
    showCarModal,
    showTimeModal,
    availAbleTimes,
    showPaymentModal,
    redirectFromNow,
    slectedDate,
    selectedTime,
    selectedVendorOption,
    date,
    availableVendors,
    pageNo,
    limit,
    isLoadingB,
    loyalityAmount,
    isTimerPickerModal,
    formatedTime,
    isDatePickerModal,
    pickedUpTime,
    selectedDate,
    pickedUpDate,
    isWalletEnabled,
    delivery_tags_price,
    delivery_cart_id,
    default_Date,
    default_Time
  } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const [focusType , setFocusType]= useState(null);
  const styles = stylesFun({ fontFamily, themeColors });
  const commonStyles = commonStylesFun({ fontFamily });
  const { profile } = appData;

  const walletAmount = useSelector(
    (state) => state?.product?.walletData?.wallet_amount,
  );

  const mapRef = useRef();

  const markerRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      if (paramData && paramData?.selectedMethod) {
        updateState({ selectedPayment: paramData?.selectedMethod });
      }
      // updateState({isLoadingB: true});
    }, [paramData]),
  );

  // useEffect(() => {
  //   if (
  //     appData &&
  //     appData?.profile &&
  //     appData?.profile?.preferences &&
  //     appData?.profile?.preferences?.stripe_publishable_key != '' &&
  //     appData?.profile?.preferences?.stripe_publishable_key != null
  //   ) {
  //     initStripe({
  //       publishableKey: appData?.profile?.preferences?.stripe_publishable_key,
  //       merchantIdentifier: 'merchant.identifier',
  //       urlScheme: 'stripe-example',
  //       setReturnUrlSchemeOnAndroid: true,
  //     });
  //   }
  // }, []);
  useEffect(() => {
    Geocoder.init(profile?.preferences?.map_key, { language: 'en' }); // set the language
  }, []);

  const _confirmAddress = (addressType) => { };
  const _onRegionChange = (region) => {
    updateState({ region: region });
    _getAddressBasedOnCoordinates(region);
    markerRef.current.showCallout();

    // animate(region);
  };

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  useEffect(() => {
    {
      !!selectedVendorOption && _getAllCarAndPrices();
    }
  }, [selectedVendorOption]);

  useEffect(() => {
    updateState({
      updatedAmount: paramData?.promocodeDetail?.couponInfo?.newAmount,
      couponInfo: paramData?.promocodeDetail?.couponInfo,
      delivery_tags_price: paramData?.promocodeDetail?.couponInfo?.newAmount,
    });
  }, [
    paramData?.promocodeDetail?.couponInfo,
    paramData?.promocodeDetail?.newAmount,
  ]);



  const _useWallet = (currentStatus, cartData) => {
    let data = {};
    data['cart_id'] = delivery_cart_id;
    data['type'] = currentStatus;
    console.log(data, "WALLET REQUEST");
    actions
      .useWalletForDelivery(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
      })
      .then((res) => {
        console.log(res, "WALLET RESPONSE");
        if (res && res?.data) {
          if (res.data.use_wallet === 1) {
            showSuccess(res?.message);
            updateState({ isWalletEnabled: true, delivery_tags_price: res.data.newAmount })
            setTimeout(() => {
              updateState({ isLoadingB: false });
            }, 500);
          } else {
            showSuccess(res?.message);
            updateState({isWalletEnabled: false, delivery_tags_price: res.data.newAmount });
            setTimeout(() => {
              updateState({ isLoadingB: false });
            }, 500);
          }
        } else {
          setTimeout(() => {
            updateState({ isLoadingB: false });
          }, 500);

        }
      })
      .catch(errorMethod);
  };
  // if(isLoadingB){
  //  return  (<View><Text>Loading</Text></View>)
  // }

  const toggleSwitch = () => {
    updateState({ isLoadingB: true })
    let currentStatus = isWalletEnabled
    _useWallet(!currentStatus)
  };

  //Get list of all orders api
  const _getAllCarAndPrices = () => {
  //   let staticLocationTesting = [
  //     {
  //         "latitude":24.454347904988595,
  //         "longitude":54.376989137381315
  //     },
  //     {
  //         "latitude":24.475205916972662,
  //         "longitude":54.3819703347981
  //     }
  // ];
    // console.log("locations1", paramData?.location)
    // console.log("static locations1", staticLocationTesting)
    
    updateState({ isLoading: true, showVendorModal: false, showCarModal: true , selectedCarOption:null});
    actions
      .getAllCarAndPrices(
        `/${selectedVendorOption?.id}?page=${pageNo}&limit=${limit}`,
        { locations: paramData?.location },
        // { locations: staticLocationTesting },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log("getAllCarAndPrices", res)


        updateState({
          loyalityAmount: res?.data?.loyalty_amount_saved
            ? Number(res?.data?.loyalty_amount_saved).toFixed(2)
            : 0,
          availableCarList:
            pageNo == 1
              ? res?.data?.products?.data
              : [...availableCarList, ...res?.data?.products?.data],
          // selectedCarOption: selectedCarOption
          //   ? selectedCarOption
          //   : res?.data?.products?.data[0],
          isLoadingB: false,
          isLoading: false,
          isRefreshing: false,
          delivery_tags_price: selectedCarOption
            ? selectedCarOption.tags_price
            : res?.data?.products?.data[0].tags_price,
        });
      })
      .catch(errorMethod);
  };

  //error handling of api
  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
  };

  const _getAddressBasedOnCoordinates = (region) => {
    Geocoder.from({
      latitude: region.latitude,
      longitude: region.longitude,
    })
      .then((json) => {
        // console.log(json, 'json');
        var addressComponent = json.results[0].formatted_address;
        updateState({
          formattedAddress: addressComponent,
        });
      })
      .catch((error) => console.log(error, 'errro geocode'));
  };

  // const _selectTime = () => {
  //   updateState({showTimeModal: false, showPaymentModal: true});
  // };


  //Modal to select time

  const _confirmAndPay = (pickDropData=null) => {
    // if (!!userData) {
    //   !!userData?.client_preference?.verify_email ||
    //     !!userData?.client_preference?.verify_phone
    //     ? !!userData?.verify_details?.is_email_verified &&
    //       !!userData?.verify_details?.is_phone_verified
    //       ?
    //       _getPaymentIntent()
    //       : moveToNewScreen(navigationStrings.VERIFY_ACCOUNT_SECOND, {
    //         formCart: true,
    //         data: data,
    //       })()
    //     : _getPaymentIntent()
    // } else {
    //   _getPaymentIntent()
    // }

    if(pickDropData!==null){
      let check1 = false;
      let check2 = false;
      
      if(pickDropData?.pickNo!==""){
        let phoneNumPickUp = res = (pickDropData?.pickNo.replace(/ /g, ''));
        console.log("item?.phonenumber", phoneNumPickUp)
        console.log("item?.phonenumber?.length", phoneNumPickUp?.length)
        if((phoneNumPickUp?.includes("+971", 0)&&phoneNumPickUp?.length===13)){
          check1=true;
        }
        else if ((phoneNumPickUp?.includes("01", 0)&&phoneNumPickUp?.length===10)
        || (phoneNumPickUp?.includes("02", 0)&&phoneNumPickUp?.length===10)
        || (phoneNumPickUp?.includes("03", 0)&&phoneNumPickUp?.length===10)
        || (phoneNumPickUp?.includes("04", 0)&&phoneNumPickUp?.length===10)
        || (phoneNumPickUp?.includes("05", 0)&&phoneNumPickUp?.length===10)
        || (phoneNumPickUp?.includes("06", 0)&&phoneNumPickUp?.length===10)
        || (phoneNumPickUp?.includes("07", 0)&&phoneNumPickUp?.length===10)
        || (phoneNumPickUp?.includes("08", 0)&&phoneNumPickUp?.length===10)
        || (phoneNumPickUp?.includes("09", 0)&&phoneNumPickUp?.length===10)){
          check1=true;
          phoneNumPickUp= "+971"+phoneNumPickUp?.substring(1, 10)
        }
      }
      if(pickDropData?.dropPhoneNumber!==""){
        let phoneNumDropOff = res = (pickDropData?.dropPhoneNumber.replace(/ /g, ''));
        console.log("item?.phonenumber", phoneNumDropOff)
        console.log("item?.phonenumber?.length", phoneNumDropOff?.length)
        if((phoneNumDropOff?.includes("+971", 0)&&phoneNumDropOff?.length===13)){
          check2=true;
        }
        else if ((phoneNumDropOff?.includes("01", 0)&&phoneNumDropOff?.length===10)
        || (phoneNumDropOff?.includes("02", 0)&&phoneNumDropOff?.length===10)
        || (phoneNumDropOff?.includes("03", 0)&&phoneNumDropOff?.length===10)
        || (phoneNumDropOff?.includes("04", 0)&&phoneNumDropOff?.length===10)
        || (phoneNumDropOff?.includes("05", 0)&&phoneNumDropOff?.length===10)
        || (phoneNumDropOff?.includes("06", 0)&&phoneNumDropOff?.length===10)
        || (phoneNumDropOff?.includes("07", 0)&&phoneNumDropOff?.length===10)
        || (phoneNumDropOff?.includes("08", 0)&&phoneNumDropOff?.length===10)
        || (phoneNumDropOff?.includes("09", 0)&&phoneNumDropOff?.length===10)){
          check2=true;
          phoneNumDropOff= "+971"+phoneNumDropOff?.substring(1, 10)
        }
      }
      
      if(pickDropData?.pickName==""){
        errorMethod({message:"Enter name for Pickup"})
        setFocusType("pickup")
      }

     
      else if(pickDropData?.pickNo==""){
        errorMethod({message:"Enter phone number for Pickup"})
        setFocusType("pickup")
      }
      else if (!check1){
        errorMethod({message:"Enter valid uae based phone number for Pickup"})
        setFocusType("pickup")
      }
   
      else if(pickDropData?.dropName==""&&!pickDropData?.samePickDrop){
        errorMethod({message:"Enter name for Dropoff"})
        setFocusType("dropoff")
      }
      else if(pickDropData?.dropPhoneNumber==""&&!pickDropData?.samePickDrop){
        errorMethod({message:"Enter phone number for Dropoff"})
        setFocusType("dropoff")
      }
      else if(!check2&&!pickDropData?.samePickDrop){
        errorMethod({message:"Enter valid phone number for Dropoff"})
        setFocusType("dropoff")
      }

      else if(pickDropData?.dropName==""&&pickDropData?.samePickDrop){
        errorMethod({message:"Enter name for Pickup"})
        setFocusType("pickup")
      }
      else if(pickDropData?.dropPhoneNumber==""&&pickDropData?.samePickDrop){
        errorMethod({message:"Enter phone number for Pickup"})
        setFocusType("pickup")
      }
      else if(!check2&&pickDropData?.samePickDrop){
        errorMethod({message:"Enter valid phone number for Pickup"})
        setFocusType("pickup")
      }
      else if(pickDropData?.paymentmethod==false){
        errorMethod({message:"Please select cash on delivery"})
        setFocusType("cod")
      }
      else{
        setFocusType(null)
        if (!!userData) {
          !!userData?.client_preference?.verify_email ||
          !!userData?.client_preference?.verify_phone
            ? !!userData?.verify_details?.is_email_verified &&
              !!userData?.verify_details?.is_phone_verified
              ? _finalPayment(pickDropData)
              : moveToNewScreen(navigationStrings.VERIFY_ACCOUNT_SECOND, {
                  formCart: true,
                })()
            : _finalPayment(pickDropData);
        } else {
          _finalPayment(pickDropData);
        }
      }
    }
    else{
      if (!!userData) {
        !!userData?.client_preference?.verify_email ||
        !!userData?.client_preference?.verify_phone
          ? !!userData?.verify_details?.is_email_verified &&
            !!userData?.verify_details?.is_phone_verified
            ? _finalPayment()
            : moveToNewScreen(navigationStrings.VERIFY_ACCOUNT_SECOND, {
                formCart: true,
              })()
          : _finalPayment();
      } else {
        _finalPayment();
      }
    }



  };

  const _getPaymentIntent = () => {
    updateState({isLoadingB: true});
    let reqData = {};
    reqData.cart_id = delivery_cart_id
    reqData.client_comment = messageTxt
    actions
      .createDeliveryCartStripeIntent(reqData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
      })
      .then((res) => {
        console.log('MYRESRES',res)
        if (res && res.data) {
          let pData = {}
          pData['task_type'] = pickUpTimeType ? pickUpTimeType : '';
          // data['schedule_time'] =
          //   pickUpTimeType == 'now' ? '' : `${slectedDate} ${selectedTime}`;
          pData['schedule_time'] = `${pickedUpDate} ${pickedUpTime}`

          pData['recipient_phone'] = '';
          pData['recipient_email'] = '';
          pData['task_description'] = '';
          // data['amount'] =
          //   couponInfo && updatedAmount
          //     ? updatedAmount
          //     : selectedCarOption?.tags_price;
          //data['amount'] = selectedCarOption?.tags_price;
          pData['amount'] = delivery_tags_price;
          pData['payment_option_id'] = selectedPayment ? selectedPayment?.id : 1;
          pData['vendor_id'] = selectedCarOption?.vendor_id;
          pData['product_id'] = selectedCarOption?.id;
          pData['currency_id'] = currencies?.primary_currency?.id;
          pData['tasks'] = paramData?.tasks;
          if (couponInfo) {
            pData['coupon_id'] = couponInfo?.id;
          } else {
            pData['coupon_id'] = null;
          }
          pData['order_time_zone'] = RNLocalize.getTimeZone();
          pData['use_wallet'] = isWalletEnabled;
          pData['cart_id']= delivery_cart_id
          pData['client_comment']= messageTxt
          _finalPayment(pData) //for now we are just using Cash on delivery so bypassing the payment screen 
          // moveToNewScreen(navigationStrings.PAYMENT_OPTIONS, {
          //   formCart: true,
          //   data: res.data,
          //   deliveryCartData: pData,
          // })()
        }
        else {
          updateState({isLoadingB: false});
          showError(res?.message || res?.error);
        }
      })
      .catch(errorMethod);
  }



  const _finalPayment = (pickDropData=null) => {
    updateState({isLoadingB: true});
    // let data =selectedCarOption
    let data ={}
    data['client_comment']=messageTxt;
    data['cart_id'] = delivery_cart_id
    if(pickDropData!==null){
      data['pickup_name']=pickDropData?.pickName;
      data['pickup_phone_number']=pickDropData?.pickNo;
      data['dropoff_name']=pickDropData?.dropName;
      data['dropoff_phone_number']=pickDropData?.dropPhoneNumber;
    }
    console.log(data,"_finalPayment");
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
        console.log("_finalPayment res", res);
        updateState({isLoadingB: false});
        if (res && res?.status == 200) {
          moveToNewScreen(navigationStrings.ORDERSUCESS, {
            // orderDetail: res.data,
          })();
      }})
      // errorMethod
      .catch(e=>{
        updateState({isLoadingB: false});
        console.log("_finalPayment error", e);
      });
  };



  const _selectTimeView = () => {
    return (
      <SelectTimeModalView
        date={date}
        onPressBack={() =>
          updateState({ showTimeModal: false, showCarModal: true })
        }
        _onDateChange={_onNewDateChange}
        availAbleTimes={availAbleTimes}
        selectedAvailableTimeOption={selectedAvailableTimeOption}
        selectAvailAbleTime={(i) =>
          updateState({ selectedAvailableTimeOption: i })
        }
        _selectTime={_selectTime}
        navigation={navigation}
        isTimerPickerModal={isTimerPickerModal}
        formatedTime={formatedTime}
        isDatePickerModal={isDatePickerModal}
        pickedUpTime={pickedUpTime}
        selectedDate={selectedDate}
        pickedUpDate={pickedUpDate}
        _pickerOpen={_pickerOpen}
        _pickerCancel={_pickerCancel}
        _onDayPress={_onDayPress}
        _modalOkPress={_modalOkPress}
        // date={formatedTime}
        scheduleDate={slectedDate}
        scheduleTime={selectedTime}
      />
    );
  };

  

  //Select Car vendor
  const _selectVendorModalView = () => {
    return (
      <SelectVendorModalView
        onPressAvailableVendor={(item) =>
          updateState({ selectedVendorOption: item })
        }
        selectedVendorOption={selectedVendorOption}
        _select={() => {
          selectedVendorOption
            ? _getAllCarAndPrices()
            : showError(strings.PLEASE_SELECT_OPTION);
        }}
        // isLoading={isLoading}
        availableVendors={availableVendors}
        navigation={navigation}
      />
    );
  };

  const onPressAvailableVendor = (item) => {
    updateState({
      isLoading: true,
      availableCarList: [],
      pageNo: 1,
      selectedVendorOption: item,
    });
  };

  const onPressPickUpNow = () => {
    console.log("selectedCarOption", selectedCarOption)
    let data = {};
    data['task_type'] = pickUpTimeType ? pickUpTimeType : '';
    // data['schedule_time'] =
    //   pickUpTimeType == 'now' ? '' : `${slectedDate} ${selectedTime}`;
    data['schedule_time'] = `${pickedUpDate} ${pickedUpTime}`

    data['recipient_phone'] = '';
    data['recipient_email'] = '';
    data['task_description'] = '';
    // data['amount'] =
    //   couponInfo && updatedAmount
    //     ? updatedAmount
    //     : selectedCarOption?.tags_price;
    //data['amount'] = selectedCarOption?.tags_price;
    data['amount'] = delivery_tags_price;
    data['payment_option_id'] = selectedPayment ? selectedPayment?.id : 1;
    data['vendor_id'] = selectedCarOption?.vendor_id;
    data['product_id'] = selectedCarOption?.id;
    data['currency_id'] = currencies?.primary_currency?.id;
    data['tasks'] = paramData?.tasks;
    data['is_same_emirate']=selectedCarOption?.is_sameEmirate==1?true:false;
    if (couponInfo) {
      data['coupon_id'] = couponInfo?.id;
    } else {
      data['coupon_id'] = null;
    }
    data['order_time_zone'] = RNLocalize.getTimeZone();
    data['use_wallet'] = isWalletEnabled;


    let deftime__ = default_Time.split(" ");
    deftime__= deftime__[0].split(":");
    let time__ = pickedUpTime.split(" ");
    time__= time__[0].split(":");

    if(pickedUpDate!==default_Date){
      data['task_type'] = 'schedule';
    }
    else if(parseInt(time__[0])!==parseInt(deftime__[0])){//hours are not matching 
      data['task_type'] = 'schedule';
    }
    else if((parseInt(time__[1]) - parseInt(deftime__[1]))>10||(parseInt(time__[1]) - parseInt(deftime__[1]))<-10){
      data['task_type'] = 'schedule';
    }
    else{
      data['task_type'] = 'now';
    }
    // console.log("onPressPickUpNow", data);

    // console.log("onPressPickUpNow", parseInt(time__[0]));
    // console.log("onPressPickUpNow", parseInt(deftime__[0]));
    // console.log("onPressPickUpNow", data['task_type'] );
    let verify=false;
    if (!!userData) {
      !!userData?.client_preference?.verify_email ||
      !!userData?.client_preference?.verify_phone
        ? !!userData?.verify_details?.is_email_verified &&
          !!userData?.verify_details?.is_phone_verified
          ? verify=true
          : moveToNewScreen(navigationStrings.VERIFY_ACCOUNT_SECOND, {
              formCart: true,
            })()
        : verify=true
    }
    console.log("createDeliveryCart",data)
    if(verify){

      actions
        .createDeliveryCart(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
        })
        .then((res) => {
          console.log("createDeliveryCart", res)
          if (res && res.data) {
            selectedCarOption
              ? updateState({
                // pickUpTimeType: 'now',
                delivery_cart_id: res.data.delivery_cart_id,
                showPaymentModal: true,
                redirectFromNow: true,
                showCarModal: false,
              })
              : showError(strings.PLEASE_SELECT_CAR);
          }
          else {
            showError(res?.message || res?.error);
          }
        })
        .catch(errorMethod);


    }





  }

  const _selectTime = () => {

    let data = {};
    data['task_type'] = pickUpTimeType ? pickUpTimeType : '';
    // data['schedule_time'] =
    //   pickUpTimeType == 'now' ? '' : `${slectedDate} ${selectedTime}`;
    data['schedule_time'] = `${pickedUpDate} ${pickedUpTime}`
    data['recipient_phone'] = '';
    data['recipient_email'] = '';
    data['task_description'] = '';
    // data['amount'] =
    //   couponInfo && updatedAmount
    //     ? updatedAmount
    //     : selectedCarOption?.tags_price;
    //data['amount'] = selectedCarOption?.tags_price;
    data['amount'] = delivery_tags_price;
    data['payment_option_id'] = selectedPayment ? selectedPayment?.id : 1;
    data['vendor_id'] = selectedCarOption?.vendor_id;
    data['product_id'] = selectedCarOption?.id;
    data['currency_id'] = currencies?.primary_currency?.id;
    data['tasks'] = paramData?.tasks;
    if (couponInfo) {
      data['coupon_id'] = couponInfo?.id;
    } else {
      data['coupon_id'] = null;
    }
    data['order_time_zone'] = RNLocalize.getTimeZone();
    data['use_wallet'] = isWalletEnabled;

    let deftime__ = default_Time.split(" ");
    deftime__= deftime__[0].split(":");
    
    let time__ = pickedUpTime.split(" ");
    time__= time__[0].split(":");

    if(pickedUpDate!==default_Date){
      data['task_type'] = 'schedule';
    }
    else if(parseInt(time__[0])!==parseInt(deftime__[0])){//hours are not matching 
      data['task_type'] = 'schedule';
    }
    else if((parseInt(time__[1]) - parseInt(deftime__[1]))>10||(parseInt(time__[1]) - parseInt(deftime__[1]))<-10){
      data['task_type'] = 'schedule';
    }
    else{
      data['task_type'] = 'now';
    }
    // console.log("onPressPickUpNow", parseInt(time__[0]));
    // console.log("onPressPickUpNow", parseInt(deftime__[0]));
    // console.log("onPressPickUpNow", data);
    actions
      .createDeliveryCart(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
      })
      .then((res) => {
        if (res && res.data) {
          updateState({ delivery_cart_id: res.data.delivery_cart_id, showTimeModal: false, showPaymentModal: true });
        }
        else {
          showError(res?.message || res?.error);
        }
      })
      .catch(errorMethod);
  }
  //Modal to select car
  const _selectCarModalView = () => {
    console.log("_selectCarModalView", selectedVendorOption )
    return (
      <SelectCarModalView
        onPressAvailableCar={(item) => updateState({ selectedCarOption: item, delivery_tags_price: item.tags_price, isWalletEnabled: false, couponInfo: null })}
        selectedCarOption={selectedCarOption}
        onPressPickUpNow={onPressPickUpNow}
        isLoading={isLoading}
        onPressPickUplater={() => {
          selectedCarOption
            ? updateState({
              // pickUpTimeType: 'schedule',
              showTimeModal: true,
              redirectFromNow: false,
              showCarModal: false,
            })
            : showError(strings.PLEASE_SELECT_CAR);
        }}
        availableCarList={availableCarList}
        onPressAvailableVendor={(item) => onPressAvailableVendor(item)}
        selectedVendorOption={selectedVendorOption}
        _select={() => {
          selectedVendorOption
            ? _getAllCarAndPrices()
            : showError(strings.PLEASE_SELECT_OPTION);
        }}
        availableVendors={availableVendors}
        navigation={navigation}

      />
    );
  };

  const _redirectToPayement = () => {
    moveToNewScreen(navigationStrings.PAYMENT_OPTIONS, {
      screenName: strings.PAYMENT,
    })();
  };

  const _selectPaymentView = () => {
    return (
      <SelectPaymentModalView
        _confirmAndPay={_confirmAndPay}
        slectedDate={pickedUpDate}
        isModalVisible={isModalVisible}
        selectedTime={pickedUpTime}
        navigation={navigation}
        date={date}
        onPressBack={() =>
          redirectFromNow
            ? updateState({ showCarModal: true, showPaymentModal: false })
            : updateState({ showTimeModal: true, showPaymentModal: false })
        }
        totalDistance={totalDistance}
        totalDuration={totalDuration}
        selectedCarOption={selectedCarOption} //item selected as car or small, medium, large
        delivery_tags_price={delivery_tags_price}//total price s
        navigation={navigation}
        couponInfo={couponInfo}
        updatedPrice={updatedAmount}
        loyalityAmount={loyalityAmount}
        removeCoupon={() => removeCoupon()}
        pickUpTimeType={pickUpTimeType}
        redirectToPayement={() => _redirectToPayement()}
        selectedPayment={selectedPayment}
        pickup_taxi={paramData?.pickup_taxi}
        isWalletEnabled={isWalletEnabled}
        isLoadingB={isLoadingB}
        toggleSwitch={toggleSwitch}
        delivery_cart_id={delivery_cart_id}
        onMessage={(data)=>setMessage(data)}
        message={messageTxt}
        locationDetail={paramData?.tasks}
        focusedContainer={focusType}
        errorMethod={errorMethod}
      />
    );
  };

  const removeCoupon = () => {
    let data = {}
    data.cart_id = delivery_cart_id;
    actions
      .removeDeliveryPromocode(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
      })
      .then((res) => {
        if (res && res?.data) {
          showSuccess(res?.message);
          updateState({ delivery_tags_price: res.data.newAmount, couponInfo: null })
          setTimeout(() => {
            updateState({ isLoadingB: false });
          }, 500);
        } else {
          showSuccess(res?.message);
        }

      })
      .catch(errorMethod);
  };

  function minutesToFormat(minutes){
    // const formatted = moment.utc(minutes*60*1000).format('HH:mm:ss');
    // console.log('foramtted',formatted)
    //num % 1;
    const formattedHours = Math.floor(minutes / 60);
    const formattedMinutes = parseInt(minutes % 60);
    let formatted;
    if(formattedHours<1)
       {
        formatted = `${formattedMinutes} mins` 
        return formatted
       }
    else
    {
      formatted = `${formattedHours}h : ${formattedMinutes}mins` 
      return formatted
     }
  }
  const _onDateChange = (date) => {
    // alert(213);

    let time = moment(date).format('HH:mm');
    let dateSelectd = moment(date).format('YYYY-MM-DD');


    updateState({
      selectedDateAndTime: `${dateSelectd} ${time}`,
      slectedDate: dateSelectd,
      selectedTime: moment(date).format('LT'),
      date: date,
      formatedTime: moment(value).format('LT'),
    });
  };

  const _updateState = () => {
    // navigationStrings.CABDRIVERLOCATIONANDDETAIL
    updateState({ isModalVisible: false });
    navigation.navigate(navigationStrings.CABDRIVERLOCATIONANDDETAIL, {});
  };

  const onMapPress = (e) => {
    if((showPaymentModal || showTimeModal))
        {  if(showPaymentModal) { updateState({ showCarModal: true, showPaymentModal: false })}
          else if(showTimeModal) updateState({ showCarModal: true, showTimeModal: false })}
    
    // updateState({
    //   locations: [...locations, e.nativeEvent.coordinate],
    // });
  };

  const _pickerOpen = (value) => {
    updateState({ [value]: true });
  };

  const _pickerCancel = (value) => {
    updateState({ [value]: false });
  };

  const _onDayPress = (value) => {
    updateState({ selectedDate: value.dateString });
  };

  const _modalOkPress = (value1, value2) => {
    updateState({
      [value1]: false,
      [value2]: value2 === 'pickedUpTime' ? formatedTime : selectedDate,
    });
  };

  const _onNewDateChange = (value) => {
    updateState({ formatedTime: moment(value).format('hh:mm A') });
  };

  // useEffect(() => {
  //   console.log('check state ref array >>>', refArr);
  //   refArr.forEach((element) => {
  //     element.current.showCallout();
  //   });
  // }, [refArr]);

  // const showRef = (_markerRef, index) => {
  //   if (_markerRef) {
  //     const temp = paramData?.tasks;
  //     let newObj = temp[index];
  //     newObj = {...newObj, markerRef: _markerRef};
  //     temp[index] = newObj;
  //     // state set
  //     setRefArr(temp);
  //   }
  // };

  return (
    <View style={styles.container}>

      <MapView
        ref={mapRef}
        // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={region}
        initialRegion={region}
        customMapStyle={(showPaymentModal || showTimeModal)  ? mapStyleDark : []}  
        tracksViewChanges={false}
        onPress={onMapPress}
       >

        {paramData?.tasks.map((coordinate, index) => {
          return (
            <View>
              <MapView.Marker
                ref={markerRef}
                zIndex={index}
                key={`coordinate_${index}`}
                image={imagePath.radioLocation}
                coordinate={{
                  latitude: Number(coordinate?.latitude),
                  longitude: Number(coordinate?.longitude),
                }}>
                <View
                  style={[
                    styles.plainView,
                    {
                      alignItems: 'center',
                      justifyContent: 'center',
                      //paddingRight: 10,
                    },
                  ]}>
                  <Text style={styles.pickupDropOff}>
                    {index === 0 ? 'Pickup' : 'Drop'}
                  </Text>
                </View>
              </MapView.Marker>
            </View>
          );
        })}

        <MapViewDirections
          origin={paramData?.location[0]}
          waypoints={
            paramData?.location.length > 2
              ? paramData?.location.slice(1, -1)
              : []
          }
          destination={paramData?.location[paramData?.location.length - 1]}
          apikey={profile?.preferences?.map_key}
          strokeWidth={3}
          strokeColor={themeColors.primary_color}
          optimizeWaypoints={true}
          onStart={(params) => {
          }}
          precision={'high'}
          timePrecision={'now'}
          mode={'DRIVING'}
          onReady={(result) => {
            console.log(result,'I AM RESULT FROM READY',result.duration.toFixed(2))
            let formattedValue =minutesToFormat(Number(result.duration.toFixed(2)));
            console.log(formattedValue,'THIS IS MY FINAL FORMATTED')

            updateState({
              totalDistance: result.distance.toFixed(2),
             totalDuration: formattedValue,
            });
            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: width / 20,
                bottom: height / 20,
                left: width / 20,
                top: height / 20,
              },
            });
          }}
          onError={(errorMessage) => {
          }}
        />
      </MapView>

      {/* Top View */}
      <View style={styles.topView}>
        <TouchableOpacity
          style={[
            styles.backButtonView,
            {
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : (showPaymentModal || showTimeModal) ?  colors.grayOpacity51   : colors.white,
            },
          ]}
          onPress={() =>
            // navigation.navigate(navigationStrings.PICKUPLOCATION)
            (showPaymentModal || showTimeModal) ? null :  navigation.goBack()
          }>
          <Image
            source={imagePath.backArrowCourier}
            style={{ tintColor: isDarkMode ? colors.white : colors.black }}
          />
        </TouchableOpacity>
      </View>

      {/* BottomView */}
      {!!showVendorModal && _selectVendorModalView()}
      {!!showCarModal && _selectCarModalView()}
      {!!showTimeModal && _selectTimeView()}
      {!!showPaymentModal && _selectPaymentView()} 

      <PaymentProcessingModal
        isModalVisible={isModalVisible}
        updateModalState={_updateState}
      />
      {/* <CustomAnimatedLoader
        source={defaultLoader}
        loaderTitle={""}
        containerColor={
          isDarkMode ? MyDarkTheme.colors.lightDark : colors.white
        }
        loadercolor={colors.focusBackGround}
        animationStyle={[
          {
            height: moderateScaleVertical(40),
            width: moderateScale(40),
            alignItems:"center",
            alignSelf:"center"
          },
        ]}
        visible={true}//isLoadingB
      /> */}
        <Loader isLoading={isLoadingB} withModal={false} />

    </View>
  );
}


export default ChooseCarTypeAndTime;