import { useFocusEffect } from '@react-navigation/native';
import { cloneDeep, debounce } from 'lodash';
import React, { createRef, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDarkMode } from 'react-native-dark-mode';
import FastImage from 'react-native-fast-image';
import * as RNLocalize from 'react-native-localize';
import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import CustomTopTabBar from '../../Components/CustomTopTabBar';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import NoDataFound from '../../Components/NoDataFound';
import OrderCardVendorComponent2 from '../../Components/OrderCardVendorComponent2';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { getImageUrl, showError } from '../../utils/helperFunctions';
import stylesFun from './styles';
import useInterval from '../../utils/useInterval';
import CheckBox from '@react-native-community/checkbox';
// import { CommonActions } from '@react-navigation/native';
// import {useNavigation} from '@react-navigation/native';
import { NavigationContainer, CommonActions, StackActions } from '@react-navigation/native'


export default function MyOrders({ navigation,route }) {
  console.log(route.params,'THISISMYPARAMSDATA')
  let paramsData = route?.params.data || null;
  console.log("MyOrders - MyOrders.js",paramsData,'DATA OK')
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const location = useSelector((state) => state?.home?.location);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appData, currencies, languages, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const businessType = appStyle?.homePageLayout;
  const [state, setState] = useState({
    tabBarData: [{ title: strings.ACTIVE_ORDERS, isActive: true },
    { title: strings.PAST_ORDERS, isActive: false },
      // {title: strings.SCHEDULED_ORDERS, isActive: false},
    ],
    // tabBarData: [
    //   businessType == 4
    //     ? { title: strings.ACTIVERIDES, isActive: true }
    //     : { title: strings.ACTIVE_ORDERS, isActive: true },
    //   businessType == 4
    //     ? { title: strings.PASTRIDES, isActive: false }
    //     : { title: strings.PAST_ORDERS, isActive: false },
    //   // {title: strings.SCHEDULED_ORDERS, isActive: false},
    // ],
    selectedTab: strings.ACTIVE_ORDERS,
    orders: [],
    activeOrders: [],
    pastOrders: [],
    scheduledOrders: [],
    pageActive: 1,
    pagePastOrder: 1,
    pageScheduleOrder: 1,
    limit: 10,
    isLoading: false,
    isRefreshing: false,
    tabType: 'active',
    isVisibleReturnOrderModal: false,
    selectedOrderForReturn: null,
    selectProductForRetrun: null,
    viewHeight: 0,
    reasons: [],
  });
  const {
    viewHeight,
    tabBarData,
    selectedTab,
    isLoading,
    activeOrders,
    pastOrders,
    scheduledOrders,
    pageActive,
    pagePastOrder,
    pageScheduleOrder,
    limit,
    isRefreshing,
    tabType,
    orders,
    isVisibleReturnOrderModal,
    selectedOrderForReturn,
    selectProductForRetrun,
    reasons,
  } = state;
  //Update state in screen
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const _scrollRef = createRef();
  //Reduc store data
  const userData = useSelector((state) => state.auth.userData);

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({ fontFamily });
  const styles = stylesFun({ fontFamily, themeColors });

  //Get list of all orders
  useEffect(() => {
    updateState({ isLoading: true });
    if (userData && userData?.auth_token) {
      _getListOfOrders();
    } else {
      updateState({
        isLoading: false,
      });
    }
  }, [selectedTab]);

  const isFocused = useIsFocused();


  // Comment based on tester ticket
  // useInterval(
  //   () => {
  //     if (!!userData?.auth_token) {
  //       _getListOfOrders();
  //     } else {
  //       showError(strings.UNAUTHORIZED_MESSAGE);
  //     }
  //   },
  //   isFocused ? 3000 : null,
  // );
  // Comment based on tester ticket
  // useEffect(() => {
  //   const focus = navigation.addListener('focus', () => {
  //     if (userData && userData?.auth_token) {
  //       _getListOfOrders();
  //     } else {
  //       updateState({
  //         isLoading: false,
  //       });
  //     }
  //   });
  //   const blur = navigation.addListener('blur', () => {
  //     updateState({ orders: [] });
  //   });
  //   return focus, blur;
  // }, []);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (userData && userData?.auth_token) {
  //       _getListOfOrders();
  //     } else {
  //       updateState({
  //         isLoading: false,
  //       });
  //     }
  //   }, [])
  // );

  //Get list of all orders api
  const _getListOfOrders = () => {
    actions
      .getOrderListing(
        `?limit=${limit}&page=${pageActive}&type=${tabType}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          timezone: RNLocalize.getTimeZone(),
          latitude: location?.latitude.toString() || '',
          longitude: location?.longitude.toString() || '',
        },
      )
      .then((res) => {
        console.log(JSON.stringify(res.data.data),"ORDERS");
        updateState({
          orders:
            pageActive == 1 ? res.data.data : [...orders, ...res.data.data],
          // activeOrders:
          //   pageActive == 1
          //     ? res.data.data
          //     : [...activeOrders, ...res.data.data],
          isLoading: false,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };

  //error handling of api
  const errorMethod = (error) => {
    console.log(error, 'error>error');
    updateState({
      isLoading: false,
      isLoadingB: false,
      isLoadingC: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
  };

  // changeTab function
  const changeTab = (tabData) => {
    console.log(tabData, 'Example');
    if (userData && userData?.auth_token && tabBarData.length) {
      let clonedArray = cloneDeep(tabBarData);

      updateState({
        tabBarData: clonedArray.map((item) => {
          if (item.title == tabData.title) {
            item.isActive = true;
            return item;
          } else {
            item.isActive = false;
            return item;
          }
        }),
        selectedTab: tabData.title,
        tabType:
          tabData.title == strings.ACTIVE_ORDERS
            ? staticStrings.ACTIVE
            : staticStrings.PAST,
        pageActive: 1,
        orders: selectedTab != tabData.title ? [] : orders,
      });
      _scrollRef.current.scrollToOffset({ animated: true, offset: 0 });
    } else {
      navigation.navigate(navigationStrings.LOGIN);
    }
  };

  const onPressViewEditAndReplace = (item) => {
    console.log(item,"i amcalled");
    // if (
    //   item?.dispatch_traking_url &&
    //   (item?.product_details[0]?.category_type ==
    //     staticStrings.PICKUPANDDELIEVRY ||
    //     item?.product_details[0]?.category_type ==
    //     staticStrings.ONDEMANDSERVICE)
    // ) {
    //   navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS, {
    //     orderId: item?.order_id,
    //     fromVendorApp: true,
    //     selectedVendor: { id: item?.vendor_id },
    //     orderDetail: item,
    //     showRating: item?.order_status?.current_status?.id != 6 ? false : true,
    //   });
    // } else {
    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      orderId: item?.order_id,
      fromVendorApp: true,
      orderStatus: item?.order_status,
      selectedVendor: { id: item?.vendor_id },
      showRating: item?.order_status?.current_status?.id != 6 ? false : true,
    });
   // }
    // (item?.dispatch_traking_url &&
    //   item?.product_details[0]?.category_type ==
    //     staticStrings.PICKUPANDDELIEVRY) ||
    // item?.product_details[0]?.category_type == staticStrings.ONDEMANDSERVICE
    //   ? navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS, {
    //       orderId: item?.order_id,
    //       fromVendorApp: true,
    //       selectedVendor: {id: item?.vendor_id},
    //       orderDetail: item,
    //       showRating:
    //         item?.order_status?.current_status?.id != 6 ? false : true,
    //     })
    //   : // navigation.navigate(navigationStrings.ACCOUNTS, {
    //   screen: navigationStrings.PICKUPORDERDETAIL,
    //   params: {
    //     orderId: item?.order_id,
    //     fromVendorApp: true,
    //     selectedVendor: {id: item?.vendor_id},
    //     orderDetail: item,
    //   },
    // })
    // if (selectedTab == strings.ACTIVE_ORDERS) {
    // navigation.navigate(navigationStrings.ORDER_DETAIL, {
    //   orderId: item?.order_id,
    //   fromVendorApp: true,
    //   orderStatus: item?.order_status,
    //   selectedVendor: {id: item?.vendor_id},
    //   showRating:
    //     item?.order_status?.current_status?.id != 6 ? false : true,
    // });

    // }
  };
  const rateYourOrder = () => {
    navigation.navigate(navigationStrings.RATEORDER);
  };

  const returnYourOrder = (item) => {
    updateState({ isLoading: true });
    actions
      .getReturnOrderDetailData(
        `?id=${item?.order_id}&vendor_id=${item?.vendor_id}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(JSON.stringify(res), 'RES ');
        // console.log(JSON.stringify('Return button click output'));
        //console.log(JSON.stringify(res?.data))
        // let newProductsData =res?.data && res?.data?.vendors && res?.data?.vendors[0]?.products &&
        // res?.data?.vendors[0]?.products.map((item)=> { item.checked = false; return item })
        // let newData = 
        //console.log(JSON.stringify(newData))
        updateState({
          isVisibleReturnOrderModal: true,
          selectedOrderForReturn: res?.data,
          selectProductForRetrun: null,
          isLoading: false,
        });
      })
      .catch(errorMethod);
  };

  const renderOrders = ({ item, index }) => {
    return (
      <OrderCardVendorComponent2
        data={item}
        selectedTab={selectedTab}
        onPress={() => onPressViewEditAndReplace(item)}
        onPressRateOrder={
          selectedTab == strings.PAST_ORDERS ? () => rateYourOrder() : null
        }
        navigation={navigation}
        onPressReturnOrder={
          selectedTab == strings.PAST_ORDERS
            ? () => returnYourOrder(item)
            : null
        }
        cardStyle={{ padding: 0 }}
        etaTime={!!item?.ETA ? item.ETA : null}
      />
      // <OrderCardComponent
      //   data={item}
      //   selectedTab={selectedTab}
      //   onPressRateOrder={
      //     selectedTab == strings.PAST_ORDERS ? () => rateYourOrder() : null
      //   }
      //   onPress={() => onPressViewEditAndReplace(item)}
      // />
    );
  };

  //Get list of all orders based on selected tab
  // useEffect(() => {
  //   if (userData && userData?.auth_token) {
  //     _getListOfOrders();
  //   } else {
  //     updateState({
  //       isLoading: false,
  //     });
  //   }
  // }, [pageActive, pagePastOrder, pageScheduleOrder, isRefreshing]);

    useEffect(() => {
    if (userData && userData?.auth_token) {
      _getListOfOrders();
    } else {
      updateState({
        isLoading: false,
      });
    }
  }, [isRefreshing]);

  //Refresh screen

  //Pull to refresh
  const handleRefresh = () => {

    if (userData && userData?.auth_token) {
      if (
        selectedTab == strings.ACTIVE_ORDERS ||
        selectedTab == strings.ACTIVERIDES
      ) {
        updateState({
          pageActive: 1,
          tabType: staticStrings.ACTIVE,
          isRefreshing: true,
        });
      }
      if (
        selectedTab == strings.PAST_ORDERS ||
        selectedTab == strings.PASTRIDES
      ) {
        updateState({
          pageActive: 1,
          tabType: staticStrings.PAST,
          isRefreshing: true,
        });
      }
      if (selectedTab == strings.SCHEDULED_ORDERS) {
        updateState({
          pageActive: 1,
          tabType: staticStrings.SCHEDULE,
          isRefreshing: true,
        });
      }
    }
  };

  //pagination of data
  const onEndReached = ({ distanceFromEnd }) => {
    if (
      selectedTab == strings.ACTIVE_ORDERS ||
      selectedTab == strings.ACTIVERIDES
    ) {
      updateState({ pageActive: pageActive + 1, tabType: staticStrings.ACTIVE });
    }
    if (
      selectedTab == strings.PAST_ORDERS ||
      selectedTab == strings.PASTRIDES
    ) {
      updateState({ pageActive: pagePastOrder + 1, tabType: staticStrings.PAST });
    }
    // if (selectedTab == strings.SCHEDULED_ORDERS) {
    //   updateState({
    //     pageActive: pageScheduleOrder + 1,
    //     tabType: staticStrings.SCHEDULE,
    //   });
    // }
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  //Give Rating

  const onClose = () => {
    updateState({ isVisibleReturnOrderModal: false });
  };

  const selectProduct = (item) => {
    if (selectProductForRetrun && selectProductForRetrun?.id == item?.id) {
      updateState({
        selectProductForRetrun: null,
      });
    } else {
      updateState({
        selectProductForRetrun: item,
      });
    }
  };

  const setItemReturned = (value, index, item) => {
    let newSelectedOrderForReturn = selectedOrderForReturn;
    //console.log( newSelectedOrderForReturn.vendors[0].products[index])
    newSelectedOrderForReturn.vendors[0].products[index].checked = value;
    updateState({ selectedOrderForReturn: newSelectedOrderForReturn })
    //console.log(item)
  }
  const returnOrder = () => {
    //console.log( selectedOrderForReturn.vendors[0].products);
    let selectedItemsIdArray = 
    selectedOrderForReturn.vendors[0].products.filter(item => item?.checked === true && item?.product_return === null ).map((item)=>item.id)
    //  updateState({ selectProductForRetrun : newselectProductForRetrun})
    //  console.log(isSingleItemSelected)
    console.log(selectedItemsIdArray);
    if (selectedItemsIdArray.length > 0) {
      let newselectProductForRetrun = selectedOrderForReturn.vendors[0].products
      updateState({ isVisibleReturnOrderModal: false, isLoading: true });
      let data = {};
      data.return_ids = selectedItemsIdArray;
      data.order_id = newselectProductForRetrun[0]?.order_id
      actions
        .getReturnProductrDetailData(
          //   `?return_ids=${newselectProductForRetrun[0]?.id}&order_id=${newselectProductForRetrun[0]?.order_id}`,
          data,
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          updateState({ isLoading: false });
          setTimeout(() => {
            navigation.navigate(navigationStrings.RETURNORDER, {
              selected_refund_amount:res?.data?.selected_refund_amount,
              selectProductForRetrun: newselectProductForRetrun,
              selectedOrderForReturn: res?.data?.order
                ? res?.data?.order
                : selectedOrderForReturn,
              reasons:
                res?.data?.reasons && res?.data?.reasons.length
                  ? res?.data?.reasons.map((item, index) => {
                    (item['value'] = item?.title),
                      (item['label'] = item?.title);
                    return item;
                  })
                  : [],
            });
          }, 500);
        })
        .catch(errorMethod);
    } else {
      showError(strings.PLEASE_SELECT_RETURN_ORDER);
    }
  };
const navigateToHome = ()=>{
  // console.log(navigation)
 // navigation.popToTop();
  // navigation.pop()
  // navigation.goBack();
//   const routes = navigation.getState()?.routes;
//           const prevRoute1 = routes[routes.length - 2]; 
//           const prevRoute2 = routes[routes.length - 3]; 
//           const prevRoute3 = routes[routes.length - 4]; 
//           const prevRoute4 = routes[routes.length - 5]; 
//           console.log(prevRoute1)
//           console.log(routes)
//           console.log(prevRoute2)
//           console.log(prevRoute3)
//           console.log(prevRoute4)
//           console.log(navigationStrings.MY_ORDERS)
//         //   navigation.navigate(navigationStrings.MY_ORDERS,{})
//  console.log(JSON.stringify(navigation))
//navigation.popToTop() 
//navigation.dispatch(StackActions.popToTop())
navigation.reset({
  index: 0,
  routes: [{ name: navigationStrings.ACCOUNTS }]
})
navigation.navigate(navigationStrings.HOMESTACK,
{
    screen: navigationStrings.HOME,
    params :{}});
 }


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setState({
        tabBarData: [{ title: strings.ACTIVE_ORDERS, isActive: true },
        { title: strings.PAST_ORDERS, isActive: false },
        ],
        selectedTab: strings.ACTIVE_ORDERS,
        orders: [],
        activeOrders: [],
        pastOrders: [],
        scheduledOrders: [],
        pageActive: 1,
        pagePastOrder: 1,
        pageScheduleOrder: 1,
        limit: 10,
        isLoading: true,
        isRefreshing: false,
        tabType: 'active',
        isVisibleReturnOrderModal: false,
        selectedOrderForReturn: null,
        selectProductForRetrun: null,
        viewHeight: 0,
        reasons: [],
      })
      setTimeout(() => {
        if (userData && userData?.auth_token) {
          _getListOfOrders();
        } else {
          updateState({
            isLoading: false,
          });
        }
      }, 2000);
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);


  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
       <Header
          leftIcon={
            imagePath.icBackb
          }
          onPressLeft ={
            ()=> {
              paramsData?.fromCart ? 
              navigateToHome()
               : navigation.goBack()
            }
          }
          centerTitle={businessType === 4 ? strings.MYRIDES : strings.MY_ORDERS}
          headerStyle={
            isDarkMode
              ? { backgroundColor: MyDarkTheme.colors.background }
              : { backgroundColor: colors.white }
          }
        />

      <View style={{ ...commonStyles.headerTopLine }} />

      <CustomTopTabBar
        scrollEnabled={true}
        tabBarItems={tabBarData}
        customContainerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: colors.white }
        }
        onPress={(tabData) => changeTab(tabData)}
        customTextContainerStyle={{ width: width / 2 }}
      />

      <FlatList
        ref={_scrollRef}
        data={orders}
        extraData={orders}
        // data={activeOrders || pastOrders || scheduledOrders}
        // data={[1, 2, 3, 4]}
        renderItem={renderOrders}
        keyExtractor={(item, index) => String(index)}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          marginVertical: moderateScaleVertical(20),
        }}
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        onEndReached={onEndReachedDelayed}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        ListFooterComponent={() => <View style={{ height: 90 }} />}
        ListEmptyComponent={
          !isLoading && (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <NoDataFound isLoading={state.isLoading} />
            </View>
          )
        }
      />

      <Modal
        transparent={true}
        isVisible={isVisibleReturnOrderModal}
        animationIn={'pulse'}
        animationOut={'pulse'}
        style={[styles.modalContainer]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Image  style={isDarkMode && {tintColor: colors.white}}
       source={imagePath.crossB} />
        </TouchableOpacity>
        <View
          style={
            isDarkMode
              ? [
                styles.modalMainViewContainer,
                { backgroundColor: MyDarkTheme.colors.lightDark },
              ]
              : styles.modalMainViewContainer
          }
          onLayout={(event) => {
            updateState({ viewHeight: event.nativeEvent.layout.height });
          }}>
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
                // alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <Text
                style={
                  isDarkMode
                    ? [styles.carType, { color: MyDarkTheme.colors.text }]
                    : styles.carType
                }>
                {strings.DOYOUWANTTORETURNYOURORDER}
              </Text>
            </View>
            <View
              style={{
                marginVertical: moderateScaleVertical(10),
                marginBottom: moderateScale(20),
              }}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.selectItemToReturn,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.selectItemToReturn
                }>
                {strings.SELECTITEMSFORRETURN}
              </Text>
            </View>

            {selectedOrderForReturn &&
              selectedOrderForReturn?.vendors &&
              selectedOrderForReturn?.vendors[0]?.products
              ? selectedOrderForReturn?.vendors[0]?.products.map(
                (item, index) => {
                  return (
                    <ScrollView
                      contentContainerStyle={{
                        flex: 1,  //To take full screen height
                      }}
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: moderateScaleVertical(20),
                        }}>
                        {item?.product_return ? (
                          <View style={{
                            flex: 0.25,
                          }}>
                            <Text
                              style={{
                                fontFamily: fontFamily.medium,
                                fontSize: moderateScale(14),
                                color: isDarkMode
                                  ? MyDarkTheme.colors.text
                                  : colors.textGreyJ,
                              }}>
                              {item?.product_return?.status}
                            </Text>
                          </View>
                        ) : (item?.isReturnable === 1 ? (
                          <View
                            style={{
                              flex: 0.25,
                            }}
                          >
                            <CheckBox
                              disabled={false}
                              value={item?.checked}
                              onValueChange={(value) => setItemReturned(value, index, item)}
                            />
                          </View>
                        ) : (
                          <View style={{
                            flex: 0.25,
                          }}>
                            <Text
                              style={{
                                fontFamily: fontFamily.medium,
                                fontSize: moderateScale(14),
                                color: isDarkMode
                                  ? MyDarkTheme.colors.text
                                  : colors.textGreyJ,
                              }}>
                              {strings.NON_RETURNABLE}
                            </Text>
                          </View>))}
                        <View style={{
                          flex: 0.75,
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}>
                          <View style={styles.cartItemImage}>
                            <FastImage
                              source={
                                item?.image != '' && item?.image != null
                                  ? {
                                    uri: getImageUrl(
                                      item?.image?.proxy_url,
                                      item?.image?.image_path,
                                      '300/300',
                                    ),
                                    priority: FastImage.priority.high,
                                  }
                                  : imagePath.patternOne
                              }
                              style={styles.imageStyle}
                            />
                          </View>
                          <View style={{ marginLeft: 10 }}>
                            <View style={{ overflow: 'hidden' }}>
                              <Text
                                numberOfLines={2}
                                style={
                                  isDarkMode
                                    ? [
                                      styles.priceItemLabel2,
                                      {
                                        opacity: 0.8,
                                        color: MyDarkTheme.colors.text,
                                      },
                                    ]
                                    : [styles.priceItemLabel2, { opacity: 0.8 }]
                                }>
                                {item?.translation?.title}
                              </Text>
                            </View>

                            {item?.quantity && (
                              <View style={{ flexDirection: 'row' }}>
                                <Text
                                  style={
                                    isDarkMode
                                      ? { color: MyDarkTheme.colors.text }
                                      : { color: colors.textGrey }
                                  }>
                                  {strings.QTY}
                                </Text>
                                <Text style={styles.cartItemWeight}>
                                  {item?.quantity}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </ScrollView>
                  );
                },
              )
              : null}
            <View style={{ height: 50 }} />
          </ScrollView>
          <View>
          </View>
          <View
            style={[
              styles.bottomAddToCartView,
              { top: viewHeight - height / 12 },
            ]}>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              // textStyle={styles.textStyle}
              onPress={returnOrder}
              marginTop={moderateScaleVertical(10)}
              marginBottom={moderateScaleVertical(10)}
              btnText={strings.SELECT}
            />
          </View>
        </View>
      </Modal>
    </WrapperContainer>
  );
}
