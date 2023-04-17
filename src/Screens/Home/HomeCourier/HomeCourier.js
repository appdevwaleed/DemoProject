import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  Linking,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useSelector , useDispatch} from 'react-redux';
import WrapperContainer from '../../../Components/WrapperContainer';
import staticStrings from '../../../constants/staticStrings';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';

import { shortCodes } from '../../../utils/constants/DynamicAppKeys';
import {
  androidBackButtonHandler,
  getCurrentLocation,
  showError,
} from '../../../utils/helperFunctions';
import { chekLocationPermission } from '../../../utils/permissions';
import {
  MainCategories,
  HomeHead
} from './../DashboardViews/Index';

import { useDarkMode } from 'react-native-dark-mode';
import Geocoder from 'react-native-geocoding';
import strings from '../../../constants/lang';
navigator.geolocation = require('react-native-geolocation-service');
import stylesFunc from '../styles';
import AppLink from 'react-native-app-link';
import type_codes from '../../../redux/types';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../../../styles/colors';
import { MyDarkTheme } from '../../../styles/theme';

export default function HomeCourier({ route, navigation }) {

  console.log("Home - HomeCourier.js")
  const paramData = route?.params;
  const dispatcher = useDispatch();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const pendingNotifications = useSelector(
    (state) => state?.pendingNotifications?.pendingNotifications,
  );

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const location = useSelector((state) => state?.home?.location);
  const [state, setState] = useState({
    isLoading: true,
    latitude: location?.latitude,
    longitude: location?.longitude,
    slider1ActiveSlide: 0,
    // location: [],
    isRefreshing: false,
    updatedData: [],
    selectedTabType: '',
    updateTime: 0,
    isDineInSelected: false,
    pageActive: 1,
    acceptLoader: false,
    rejectLoader: false,
    selectedOrder: null,
  });
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const cartItemCount = useSelector((state) => state?.cart?.cartItemCount);
  const {
    appData,
    themeColors,
    themeLayouts,
    currencies,
    languages,
    internetConnection,
    appStyle,
    isDineInSelected,
  } = useSelector((state) => state?.initBoot);

  const initData = useSelector((state) => state?.initBoot);
 // console.log(JSON.stringify(appData),"THIS IS MY INIT DATA ");
  const userData = useSelector((state) => state?.auth?.userData);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);

  const profileInfo = appData?.profile;
  const { profile } = appData;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });

  const {
    updateTime,
    isLoading,
    longitude,
    latitude,
    slider1ActiveSlide,
    isRefreshing,
    themeLayout,
    updatedData,
    selectedTabType,
    pageActive,
    acceptLoader,
    rejectLoader,
    selectedOrder,
  } = state;
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        androidBackButtonHandler,
      );
      return () => backHandler.remove();
    }, []),
  );

  useEffect(() => {
    updateState({ updatedData: appMainData?.categories });
  }, [appMainData]);
  
  useEffect(() => {
    if (
      paramData?.details &&
      paramData?.details?.formatted_address != location?.address
    ) {
      const address = paramData?.details?.formatted_address;
      const res = {
        address: address,
        latitude: paramData?.details?.geometry?.location.lat,
        longitude: paramData?.details?.geometry?.location.lng,
      };
      if (
        res?.latitude != location?.latitude &&
        res?.longitude != location?.longitude
      ) {
        if (cartItemCount?.data?.item_count) {
          checkCartWithLatLang(res);
        } else {
          updateLatLang(res);
        }
      } else {
        updateLatLang(res);
      }
    }
  }, [paramData?.details]);

  const checkCartWithLatLang = (res) => {
    Alert.alert('', strings.THIS_WILL_REMOVE_CART, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        // style: 'destructive',
      },
      { text: strings.CLEAR_CART2, onPress: () => clearCart(res) },
    ]);
  };

  const clearCart = (location) => {
    updateLatLang(location);
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
        homeData(location);
      })
      .catch(errorMethod);
  };

  const updateLatLang = (res) => {
    updateState({ updateTime: Math.random() });
    actions.locationData(res);
  };

  
  useEffect(() => {
    if (updateTime) {
      homeData();
    }
  }, [updateTime]);
  

  useEffect(() => {
    Geocoder.init(profile?.preferences?.map_key, { language: 'en' }); // set the language
    checkLogin();
  }, []);


  useEffect(() => {
    chekLocationPermission()
      .then((result) => {
       // console.log(result,'THIS IS LOCATION RESULT')
//        if (result !== 'goback') {
       if (result === 'granted') {
          getCurrentLocation('home')
            .then((res) => {
             // console.log(appMainData?.reqData,"appMainData FROM PERMISION PAGE")
           //   console.log(location,"location FROM PERMISION PAGE");
           //   console.log(res," FROM PERMISION PAGE");
              actions.locationData(res);
              homeData(res)
            })
            .catch((err) => {
               actions.locationData(appData?.profile?.default_address);
               homeData()
               });
        }
        else {
         // console.log(location,"Default");
          actions.locationData(appData?.profile?.default_address);
          homeData()
        }
      })
      .catch((error) =>{ 
      //  console.log('error while accessing location', error);
        actions.locationData(appData?.default_address);
        homeData()
      });
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      // homeData();
      if (!!userData?.auth_token) {
        getAllAddress();
      }
    }, []),
  );


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

  //Home data
  const homeData = (slectedLocatonFromPreviousScreen) => {
    let latlongObj = {};

      latlongObj = {
        address: slectedLocatonFromPreviousScreen
          ? slectedLocatonFromPreviousScreen?.address
          : location?.address,
        latitude: slectedLocatonFromPreviousScreen
          ? slectedLocatonFromPreviousScreen?.latitude
          : location?.latitude,
        longitude: slectedLocatonFromPreviousScreen
          ? slectedLocatonFromPreviousScreen?.longitude
          : location?.longitude,
      };
    

    // console.log(
    //   {
    //     type: dine_In_Type ? dine_In_Type : dine_In_Type,
    //     ...latlongObj,
    //   },
    //   'latlongObj>>Data',
    // );

    actions
          .homeData(
            {
              type: dine_In_Type ? dine_In_Type : dine_In_Type,
              ...latlongObj,
            },
            {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
              // ...latlongObj,
            },
          )
          .then((res) => {
            console.log(res,"THIS IS RESPONSE")
           // console.log(JSON.stringify(res),"THIS IS RESPONSE")
            // if (
            //   appData?.profile?.preferences?.is_hyperlocal &&
            //   location?.latitude == '' &&
            //   location?.longitude == ''
            // ) {
            //   if (
            //     typeof res?.data?.reqData == 'object' &&
            //     res?.data?.reqData?.latitude &&
            //     res?.data?.reqData?.longitude
            //   ) {
            //     const data = {
            //       address: res?.data?.reqData?.address,
            //       latitude: res?.data?.reqData?.latitude,
            //       longitude: res?.data?.reqData?.longitude,
            //     };
            //     actions.locationData(data);
            //   }
            // } else {
            //   if (
            //     appData?.profile?.preferences?.is_hyperlocal &&
            //     location?.latitude != '' &&
            //     location?.longitude != ''
            //   ) {
            //   } else {
            //     const data = {
            //       address: '',
            //       latitude: '',
            //       longitude: '',
            //     };
            //     actions.locationData(data);
            //   }
            // }
            setTimeout(() => {
              updateState({ isLoading: false });
            }, 1000);
          })
          .catch(errorMethod)
    
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
      acceptLoader: false,
      rejectLoader: false,
      selectedOrder: null,
    });
    showError(error?.message || error?.error);
  };

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  const { viewRef2, viewRef3, bannerRef } = useRef();


  const onPressCategory = (item) => {

    // if (item.redirect_to == staticStrings.VENDOR) {
    //   moveToNewScreen(navigationStrings.VENDOR, item)();
    // } 

    if (item.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        // if (shortCodes.arenagrub == appData?.profile?.code) {
        //   openUber();
        // } else {
          // if (item?.warning_page_id) {
          //   if (item?.warning_page_id == 2) {
          //     moveToNewScreen(navigationStrings.DELIVERY, item)();
          //   } else {
          //     moveToNewScreen(navigationStrings.HOMESCREENCOURIER, item)();
          //   }
          // } else {
          //   if (item?.template_type_id == 1) {
          //     moveToNewScreen(navigationStrings.SEND_PRODUCT, item)();
          //   } else {
          //     item['pickup_taxi'] = true;

          //     // moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, item)();
          //     moveToNewScreen(navigationStrings.HOMESCREENTAXI, item)();
          //   }
          // }
          item['pickup_taxi'] = true;

          // moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, item)();
          moveToNewScreen(navigationStrings.HOMESCREENTAXI, item)();
        } 
        else {
        // showError(strings.UNAUTHORIZED_MESSAGE);
        moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
      }

    } 
    // else if (item.redirect_to == staticStrings.DISPATCHER) {
    //   // moveToNewScreen(navigationStrings.DELIVERY, item)();
    // } 
    // else if (item.redirect_to == staticStrings.CELEBRITY) {
    //   moveToNewScreen(navigationStrings.CELEBRITY)();
    // } else if (item.redirect_to == staticStrings.BRAND) {
    //   moveToNewScreen(navigationStrings.BRANDS)();
    // } else if (item.redirect_to == staticStrings.SUBCATEGORY) {
    //   // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
    //   moveToNewScreen(navigationStrings.VENDOR_DETAIL, { item })();
    // } 
    // else if (!item.is_show_category || item.is_show_category) {
    //   item?.is_show_category
    //     ? 
    //     moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
    //       item,
    //       rootProducts: true,
    //       // categoryData: data,
    //     })()
    //     : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
    //       id: item?.id,
    //       vendor: true,
    //       name: item?.name,
    //       isVendorList: true,
    //     })();

    //   // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    // }
  };

  //On Press banner
  const bannerPress = (data) => {
    // return;
    let item = {};
    if (data?.redirect_id) {
      if (data?.redirect_to == staticStrings.VENDOR && data?.is_show_category) {
        moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: data.redirect_id,
          vendor: true,
          name: data.redirect_name,
        })();
        return;
      }
      if (data?.redirect_to == staticStrings.VENDOR) {
        item = {
          ...data?.vendor,
          redirect_to: data.redirect_to,
        };
      } else {
        item = {
          id: data.redirect_id,
          redirect_to: data.redirect_to,
          name: data.redirect_name,
        };
      }

      if (data.redirect_to == staticStrings.VENDOR) {
        data?.is_show_category
          ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            // categoryData: data,
          })()
          : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: data.redirect_id,
            vendor: true,
            name: data.redirect_name,
          })();
      } else if (data.redirect_to == staticStrings.CATEGORY) {
        if (data?.category?.type?.title == staticStrings.VENDOR) {
          let dat2 = data;
          dat2['id'] = data?.redirect_id;
          moveToNewScreen(navigationStrings.VENDOR, dat2)();
        } else {
          moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: data.redirect_id,
            // vendor: true,
            name: data.redirect_name,
          })();
        }
      }
    }
  };

  //Reloads the screen
  const initApiHit = () => {
    let header = {};
    // console.log(languages?.primary_language?.id, 'languageID');
    header = {
      code: appData?.profile?.code,
      language: languages?.primary_language?.id,
    };

    actions
      .initApp(
        {},
        header,
        true,
        currencies?.primary_currency,
        languages?.primary_language,
      )
      .then((res) => {
        updateState({ isRefreshing: false });
      })
      .catch((error) => {
        updateState({ isRefreshing: false });
      });
  };

  //Pull to refresh
  const handleRefresh = () => {
   // console.log("i am called from handleRefresh" )
    updateState({ isRefreshing: true });
    initApiHit();
    // homeData();
  };
  const updateCircleData = (data) => {
    updateState({ updatedData: data });
  };

  useEffect(() => {
    if (!!userData?.auth_token) {
      (async () => {
        try {
          const res = await actions.allPendingOrders(
            `?limit=${10}&page=${pageActive}`,
            {},
            {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
              // systemuser: DeviceInfo.getUniqueId(),
            },
          );
          let orders =
            pageActive == 1
              ? res.data.order_list.data
              : [...pendingNotifications, ...res.data.order_list.data];
          actions.pendingNotifications(orders);
        } catch (error) {
          console.log('erro rirased', error);
        }
      })();
    }
  }, []);

  const checkLogin=async()=>{
    console.log("checkLogin");
    let login = await AsyncStorage.getItem('isLoggedInDevice');
    login= JSON.parse(login)
    console.log("checkLogin", login);
    if(login!==null&&login!==undefined&&login.toString()=="true"){
      getCartDetail();
    }
    else{
      dispatcher({type:type_codes.CART_ITEM_COUNT, payload:{}});
      dispatcher({type:type_codes.SELECTED_ADDRESS, payload:null});
      dispatcher({type:type_codes.STORE_SELECTED_VENDOR, payload:{}});
      dispatcher({type:type_codes.PRODUCT_LIST_DATA, payload:[]});
      dispatcher({type:type_codes.WALLET_DATA, payload:null});
      dispatcher({type:type_codes.PRODUCT_DETAIL, payload:{}});
    }
  }

  const getCartDetail = () => {
    console.log("checkLogin 1");
    actions
      .getCartDetail(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log("cartItemQty", res);
        actions.cartItemQty(res);
      })
      .catch((error) => { });
  };

  // console.log(appMainData, 'appMainData');

  const renderHomeScreen = () => {

    return (
      <>
        <HomeHead
          location={location}
          isLoading={isLoading} 
        />

        <MainCategories
          handleRefresh={() => handleRefresh()}
          bannerPress={(item) => bannerPress(item)}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onPressCategory={(item) => {
            onPressCategory(item);
          }}
          navigation={navigation}
        /> 
      </>
    );
  };

  const { blurRef } = useRef();
  return (
    <WrapperContainer
      statusBarColor={colors.backgroundGrey}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }>
      {/* <View style={{flex: 1}}>{}</View> */}
      <>
        {renderHomeScreen()}
      </>
    </WrapperContainer>
  );
}
