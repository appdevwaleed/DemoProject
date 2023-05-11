import { useFocusEffect } from '@react-navigation/native';
import { cloneDeep } from 'lodash';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableHighlight,
  PermissionsAndroid,
  Linking
} from 'react-native';
import { useDarkMode } from 'react-native-dark-mode';
import FastImage from 'react-native-fast-image';
//import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import HeaderWithFilters from '../../Components/HeaderWithFilters';
import LeftRightText from '../../Components/LeftRightText';
import {
  loaderFive,
  loaderOne,
} from '../../Components/Loaders/AnimatedLoaderFiles';
import StepIndicators from '../../Components/StepIndicator';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { getImageUrl, showError } from '../../utils/helperFunctions';
import useInterval from '../../utils/useInterval';
import ListEmptyCart from './ListEmptyCart';
import stylesFunc from './styles';
import { useIsFocused } from '@react-navigation/native';
import * as RNLocalize from 'react-native-localize';
import { AirbnbRating } from 'react-native-ratings';
const { height, width } = Dimensions.get('window');
import {searchingLoader} from '../../Components/Loaders/AnimatedLoaderFiles';
//import RNFetchBlob from "rn-fetch-blob";
import ReactNativeBlobUtil from 'react-native-blob-util'
import Pdf from 'react-native-pdf';
import Communications from 'react-native-communications';
import {dummyUser} from '../../constants/constants';
import GradientButton from '../../Components/GradientButton';
import TransparentButtonWithTxtAndIcon from '../../Components/TransparentButtonWithTxtAndIcon';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  
} from 'react-native-popup-menu';

var base64Source;

export default function OrderDetail({ navigation, route }) {
  console.log("OrderDetail - OrderDetail.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route?.params;
  console.log(paramData,'MY PARAM DATA');
  const dineInType = useSelector((state) => state?.home?.dineInType);

  const [state, setState] = useState({
    isLoading: true,
    cartItems: [],
    cartData: {},
    selectedPayment: null,
    labels: [
      strings.ACCEPTED,
      strings.PROCESSING,
      strings.OUT_FOR_DELIVERY,
      strings.DELIVERED,
    ],
    deliveryLabels: [
      'PICKUP STARTED',
      'PICKUP COMPLETED',
      'DELIVERY STARTED',
      'DELIVERY COMPLETED',
    ],
    // labels: [
    //   {lable: 'Accepted', orderDate: '12/12/1233'},
    //   {lable: 'Processing', orderDate: ''},
    //   {lable: 'Out For Delivery', orderDate: ''},
    //   {lable: 'Delivered', orderDate: ''},
    // ],
    currentPosition: null,
    orderStatus: null,
    selectedTipvalue: null,
    selectedTipAmount: null,
    delivery_agent: null,
    orderType: null,
    deliveryCurrentPosition: null,
  });
  const {
    isLoading,
    cartItems,
    cartData,
    labels,
    currentPosition,
    orderStatus,
    selectedTipvalue,
    selectedTipAmount,
    delivery_agent,
    orderType,
    deliveryLabels,
    deliveryCurrentPosition,
  } = state;
  const userData = useSelector((state) => state?.auth?.userData);

  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { appData, themeColors, currencies, languages, appStyle } = useSelector(
    (state) => state.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily });

  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  const isFocused = useIsFocused();
  const openWhatsApp = (mobile) => {
    let msg = " Hi "+delivery_agent?.name+", i am enquiring about the delivery with order no "+cartData?.order_number;
    // mobile="+971569951550"
    mobile = mobile.replace(/ /g, '')
    console.log("msg", msg);
    console.log("mobile", mobile);

    if (mobile) {
      if (msg) {
        let url =
          "whatsapp://send?text=" +
          msg +
          "&phone=" +
          mobile;
        console.log("url", url);
        Linking.openURL(url)
          .then(data => {
            console.log("WhatsApp Opened successfully " + data);
          })
          .catch(() => {
            alert("Make sure WhatsApp installed on your device");
          });
      } else {
        alert("Please enter message to send");
      }
    } else {
      alert("Please enter mobile no");
    }
  };
  // useFocusEffect(
  //   React.useCallback(() => {
  //     updateState({ isLoading: true });
  //     if (!!userData?.auth_token) {
  //       // _getOrderDetailScreen();
  //     } else {
  //       showError(strings.UNAUTHORIZED_MESSAGE);
  //     }
  //   }, [currencies, languages, paramData]),
  // );

  //Commented bc of discussion
  // useInterval(
  //   () => {
  //     if (!!userData?.auth_token) {
  //       _getOrderDetailScreen();
  //     } else {
  //       showError(strings.UNAUTHORIZED_MESSAGE);
  //     }
  //   },
  //   isFocused ? 3000 : null,
  // );
  useEffect(() => {
    if (!!userData?.auth_token) {
      _getOrderDetailScreen();
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  }, [])

  /*********Get order detail screen********* */
  const _getOrderDetailScreen = () => {
    console.log("_getOrderDetailScreen123")
    let data = {};
    data['order_id'] = paramData?.orderId;
    if (paramData?.selectedVendor) {
      data['vendor_id'] = paramData?.selectedVendor.id;
    }
    // updateState({ isLoading: true });
    actions
      .getOrderDetail(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // timezone: RNLocalize.getTimeZone(),
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log("_getOrderDetailScreen123", res)
        updateState({ isLoading: false });
        if (res?.data) {
          // if (res?.data?.luxury_option_name !== strings.DELIVERY) {
          //   updateState({
          //     labels: [
          //       strings.ACCEPTED,
          //       strings.PROCESSING,
          //       strings.ORDER_PREPARED,
          //       strings.DELIVERED,
          //     ],
          //   });
          // }
          if (res?.data?.type !== 'delivery') {
            updateState({
              orderType : res?.data?.type,
              labels: [
                strings.ACCEPTED,
                strings.PROCESSING,
                strings.ORDER_PREPARED,
                strings.DELIVERED,
              ],
            });
          }

          if (res?.data?.type === 'delivery') {
           
            updateState({
              orderType : res?.data?.type,
              deliveryLabels: [
                'PICKUP STARTED',
                'PICKUP COMPLETED',
                'DELIVERY STARTED',
                'DELIVERY COMPLETED',
              ],
              deliveryCurrentPosition: res?.data?.delivery_status
            });

          }

          

          console.log("THIS IS MY DATA STATUS",res?.data?.delivery_status,deliveryCurrentPosition,orderType);
          console.log("THIS IS MY RESPONSE DATA STATUS",JSON.stringify(res?.data));



          updateState({
            delivery_agent: res.data.delivery_agent,
            cartItems: res.data.vendors,
            cartData: res.data,
            isLoading: false,
            agent_location: res?.data?.agent_location,
            currentPosition: res.data.vendors[0].order_status
              ? res?.data?.luxury_option_name !== strings.DELIVERY
                ? res.data.vendors[0].order_status?.current_status?.title ==
                  strings.OUT_FOR_DELIVERY
                  ? 2
                  : labels.indexOf(
                    res.data.vendors[0].order_status?.current_status?.title
                      .charAt(0)
                      .toUpperCase() +
                    res.data.vendors[0].order_status?.current_status?.title.slice(
                      1,
                    ),
                  )
                : labels.indexOf(
                  res.data.vendors[0].order_status?.current_status?.title
                    .charAt(0)
                    .toUpperCase() +
                  res.data.vendors[0].order_status?.current_status?.title.slice(
                    1,
                  ),
                )
              : null,

            // ? dineInType==="Delivery"? labels.indexOf(
            //       res.data.vendors[0].order_status?.current_status?.title
            //         .charAt(0)
            //         .toUpperCase() +
            //         res.data.vendors[0].order_status?.current_status?.title.slice(
            //           1,
            //         ),
            //     ) :  res.data.vendors[0].order_status?.current_status?.title==="Order Predpared"? 3,

            orderStatus: res?.data?.vendors[0]?.order_status,
          });
        }
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log("error", error);
    updateState({ isLoading: false, isLoading: false, isLoadingC: false });
    showError(error?.message || error?.error);
  };
  useEffect(() => {
    let query = `/${paramData?.orderId}/${paramData?.selectedVendor.id}`;
    actions
      .getOrderReceipt(query, {}, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        base64Source = res.invoice_pdf;
      })
      .catch((error) => {
        showError(error?.message || error?.error);
      });
  }, [])
  const createPDF = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Cool Download Receipt Permission",
          message:
            "Cool Download Receipt Permission " +
            "so you can use it offline.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let filePath = ReactNativeBlobUtil.fs.dirs.DownloadDir + `/${paramData?.orderId}${paramData?.selectedVendor.id}.pdf`;
        console.log(filePath);
        ReactNativeBlobUtil.fs.writeFile(filePath, base64Source, 'base64')
          .then(response => {
            console.log('Success Log: ', response);
          })
          .catch(errors => {
            console.log(" Error Log: ", errors);
          })
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const onStarRatingPress = (i, rating) => {
    // updateState({isLoading: true});
    _giveRatingToProduct(i, rating);
  };
  const ratingCompleted = (i, rating) => {
    //  console.log("ratingCompleted Rating is: " + rating)
    _giveRatingToProduct(i, rating);
  }
  const onStartRating = (rating) => {
    // console.log("onStartRating Rating is: " + rating)
  }
  const _giveRatingToProduct = (productDetail, rating) => {
    let data = {};
    data['order_vendor_product_id'] = productDetail?.id;
    data['order_id'] = productDetail?.order_id;
    data['product_id'] = productDetail?.product_id;
    data['rating'] = rating;
    data['review'] = productDetail?.product_rating?.review
      ? productDetail?.product_rating?.review
      : '';
    // data['vendor_id'] = productDetail.vendor_id;

    actions
      .giveRating(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        let cloned_cartItems = cloneDeep(cartItems);
        updateState({
          isLoading: false,
          cartItems: (cloned_cartItems = cloned_cartItems.map((itm, inx) => {
            itm.products.map((j, jnx) => {
              if (j?.product_id == productDetail?.product_id) {
                j.product_rating = res.data;
                return j;
              } else {
                return j;
              }
            });
            return itm;
          })),
        });
      })
      .catch(errorMethod);
  };

  //give review and update the rate
  const rateYourOrder = (item) => {
    navigation.navigate(navigationStrings.RATEORDER, { item });
  };

  const _renderSelectedItem= (item={})=>{

    // console.log(JSON.stringify(item),'MY ITEMS')

    // console.log("getDeliveryHeader", cartItems);
    // console.log("cartData", cartData);
    // console.log("getDeliveryHeader", cartItems[0]?.order_status?.current_status?.title);
    return (
      <TouchableOpacity   onPress={() =>{}} style={[
        {
            borderRadius:15,
            marginTop:15,
            borderRadius:15,
            backgroundColor:"#E7F2F9",
          }, 
        ]}>
            <View
              style={{
                opacity: 1,
                padding:10,
                alignContent:"space-between",
                
              }}>
                   <View style={{flexDirection:"row",  alignItems:"center"}}>
                    <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center", marginRight:15, marginLeft:10}}>
                      {item?.products?.map((i) => {
                        return (
                          <Image
                            resizeMode={'contain'}
                            style={[{height: 130, width: 120, borderRadius:15, marginTop:-5}, 
                              
                            ]}
                            source={{
                              uri: getImageUrl(
                                i?.image_path?.image_fit,
                                i?.image_path?.image_path,
                                '150/150',
                              ),
                            }}
                          />
                        );
                    })}
                    </View>
                <View style={{flex:1,  marginRight:5,}}>
                <Text
                          numberOfLines={1}
                          style={[
                                  styles.carType,
                                  {
                                    color: colors.blackC,
                                    fontFamily: fontFamily.bold,
                                    fontSize: textScale(14),
                                    marginBottom:15
                                  },
                                ]
                          }>
                          {item?.vendor?.name}
                    </Text>
                  <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginTop:-11}}>

                    <Text
                          numberOfLines={1}
                          style={[
                                  styles.carType,
                                  {
                                    color: colors.blackC,
                                    fontFamily: fontFamily.bold,
                                    fontSize: textScale(18),
                                  },
                                ]
                          }>
                          {item?.products[0]?.product_name}
                    </Text>
                    <Text
                          numberOfLines={1}
                          style={[
                                  styles.carType,
                                  {
                                    color: colors.blackC,
                                    fontFamily: fontFamily.bold,
                                    fontSize: textScale(14),  
                                  },
                                ]}>
                          {`${currencies?.primary_currency?.symbol} ${Number(
                            item?.products[0]?.price,
                          ).toFixed(2)}`}
                    </Text>

                  </View>
                  <View style={{justifyContent:"flex-end", marginTop:4}}>
                  <View style={{ flexDirection:"row", alignItems:"center",  marginRight:10}}>
                      <View style={{ width:23, height:23, borderRadius:8, justifyContent:"center", alignItems:"center", backgroundColor:colors.white, alignSelf:"center"}}>
                        <Image
                          resizeMode={'contain'}
                          style={{height: 13, width: 13}}
                          source={imagePath.cubeBlueIcon}
                          />
                      </View>
                      <Text
                          numberOfLines={2}
                          style={[
                                  styles.carType,
                                  {
                                    color: colors.blackC,
                                    fontFamily: fontFamily.bold,
                                    fontSize: textScale(8),  
                                    marginLeft:5
                                  },
                                ]}>
                          {item?.products[0]?.dimensions}
                      </Text> 
                  </View>
                  <View style={{ flexDirection:"row", marginTop:5, marginRight:10,alignItems:"center",}}>
                      <View style={{ width:23, height:23, borderRadius:8, justifyContent:"center", alignItems:"center", backgroundColor:colors.white, alignSelf:"center"}}>
                        <Image
                          resizeMode={'contain'}
                          style={{height: 11, width: 11, }}
                          source={imagePath.bucketBlueIcon}
                          />
                      </View>
                      <Text
                          numberOfLines={1}
                          style={[
                                  styles.carType,
                                  {
                                    color: colors.blackC,
                                    fontFamily: fontFamily.bold,
                                    fontSize: textScale(8),  
                                    marginLeft:5
                                  },
                                ]}>
                          {item?.products[0]?.weight}
                      </Text>
                      {/* 1 - 5 kgs */}
                  </View>
                  <View style={{ flexDirection:"row", marginTop:5, marginRight:10,alignItems:"center",}}>
                      <View style={{ width:23, height:23, borderRadius:8, justifyContent:"center", alignItems:"center", backgroundColor:colors.white, alignSelf:"center"}}>
                        <Image
                          resizeMode={'contain'}
                          style={{height: 13, width: 13, }}
                          source={imagePath.clockBlueIcon}
                          />
                      </View>
                      <Text
                          numberOfLines={1}
                          style={[
                                  styles.carType,
                                  {
                                    color: colors.blackC,
                                    fontFamily: fontFamily.bold,
                                    fontSize: textScale(8),  
                                    marginLeft:5
                                  },
                                ]}>
                          {item?.products[0]?.sla}
                      </Text>
                      {/* 24 - 48 hrs */}
                  </View>
                </View>
                </View>
                
              </View> 
            </View>


        {/* </AnimatedListItem> */}
      </TouchableOpacity>
    );
  }

  const _renderItem = ({ item, index }) => {
    console.log(JSON.stringify(item),'MY ITEMS')

    console.log("getDeliveryHeader", cartItems);
    console.log("cartData", cartData);
    console.log("getDeliveryHeader", cartItems[0]?.order_status?.current_status?.title);

    // return <OffersCard />;
    let { itemCount } = state;
    return (
      <View
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          // marginVertical: moderateScale(10),
        }}>
        {/* show ETA Time */}

        {/* {cartData?.vendors[0]?.order_status?.current_status?.title !== strings.DELIVERED &&
          cartData?.vendors[0]?.order_status?.current_status?.title !== strings.REJECTED &&
          (!!cartData?.scheduled_date_time || !!cartData?.ETA) && (
            <View
              style={{
                ...styles.ariveView,
                backgroundColor: themeColors.primary_color,
              }}>
              <Text
                style={{
                  ...styles.ariveTextStyle,
                  color: colors.white,
                }}>
                {strings.YOUR_ORDER_WILL_ARRIVE_BY}{' '}
                {cartData?.scheduled_date_time
                  ? cartData?.scheduled_date_time
                  : cartData?.ETA}
              </Text>
            </View>
          )} */}
          <View style={{
              marginVertical:30,
              paddingHorizontal:20
          }}>
            <View style={{flexDirection:"row",  alignItems:"center", marginTop:0}}>
              <View style={{width:25, height:25, borderRadius:8, backgroundColor:colors.lightBluebackground, justifyContent:"center", alignItems:"center"}}>
                <Image source={imagePath.summeryIcon} style={{width:12, height:12}}/>
              </View>
              <Text
                numberOfLines={1}
                style={[
                        styles.carType,
                        {
                          color: colors.greyText,
                          fontFamily: fontFamily.medium,
                          fontSize: textScale(13),
                          marginLeft:10
                        },
                      ]
                }>
                {strings?.SHIPMENT_DETAILS}
              </Text>
            </View>
             {_renderSelectedItem(item)}
             <View style={{flexDirection:"row", marginTop:10, alignItems:"center"}}>
              <View style={{width:25, height:25, borderRadius:8, backgroundColor:colors.lightBluebackground, justifyContent:"center", alignItems:"center"}}>
                <Image source={imagePath.locationIconBlue} style={{width:15, height:15, }}/>
              </View>
              <Text
                numberOfLines={1}
                style={[
                        styles.carType,
                        {
                          color: colors.greyText,
                          fontFamily: fontFamily.bold,
                          fontSize: textScale(13),
                          marginLeft:10
                        },
                      ]
                }>
                {strings?.LOCATION}
              </Text>
            </View>
            <View  
              style={{
                marginTop:10,
                padding: moderateScale(16),
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.background
                  : colors.lightBluebackground,
                borderRadius: moderateScale(10),
                marginBottom: moderateScaleVertical(12),
                // borderColor:colors.redB,
                // borderWidth:(focusedContainer!==null&&focusedContainer=="pickup")?1:0
              }}>
                <View style={{ flexDirection: 'row' ,alignItems: 'center', justifyContent: 'flex-start', marginBottom:  moderateScale(5)}}>
                  <View style={{width:25, height:25, borderRadius:10, backgroundColor:colors.white, justifyContent:"center", alignItems:"center"}}>
                    <Image source={imagePath.arrowUpBlueBack} style={{width:18, height:18}} resizeMode={"cover"}/>
                  </View>
                  <Text style={{ color: colors.blackC, marginLeft:10, fontFamily: fontFamily.bold, fontSize:14}} >{strings.PICKUP}</Text>
                </View>
                  <View>
                    <Text numberOfLines={2} style={{ color: colors.blackC,  fontFamily: fontFamily.medium, fontSize:14, opacity:0.7}}>
                      {cartData?.delivery_pickup_address}
                    </Text>
                  </View>
                  
                </View>
                <View  
                  style={{
                    marginTop:10,
                    padding: moderateScale(16),
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.background
                      : colors.lightBluebackground,
                    borderRadius: moderateScale(10),
                    marginBottom: moderateScaleVertical(12),
                    // borderColor:colors.redB,
                    // borderWidth:(focusedContainer!==null&&focusedContainer=="pickup")?1:0
                  }}>
                <View style={{ flexDirection: 'row' ,alignItems: 'center', justifyContent: 'flex-start', marginBottom:  moderateScale(5)}}>
                  <View style={{width:25, height:25, borderRadius:10, backgroundColor:colors.white, justifyContent:"center", alignItems:"center"}}>
                    <Image source={imagePath.arrowUpBlueBack} style={{width:18, height:18}} resizeMode={"cover"}/>
                  </View>
                  <Text style={{ color: colors.blackC, marginLeft:10, fontFamily: fontFamily.bold, fontSize:14}} >{strings.DROPOFF}</Text>
                </View>
                  <View>
                    <Text numberOfLines={2} style={{ color: colors.blackC,  fontFamily: fontFamily.medium, fontSize:14, opacity:0.7}}>
                      {cartData?.delivery_drop_address}
                    </Text>
                  </View>
                </View>

              <View style={{flexDirection:"row", marginTop:10, alignItems:"center"}}>
                <View style={{width:25, height:25, borderRadius:8, backgroundColor:colors.lightBluebackground, justifyContent:"center", alignItems:"center"}}>
                  <Image source={imagePath.personContact} style={{width:15, height:15, }}/>
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                          styles.carType,
                          {
                            color: colors.greyText,
                            fontFamily: fontFamily.bold,
                            fontSize: textScale(13),
                            marginLeft:10
                          },
                        ]
                  }>
                  {strings?.CONTACTS}
                </Text>
              </View> 


              { orderType !== 'product' &&
                <View  
                  style={{
                    marginTop:10,
                    padding: moderateScale(16),
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.background
                      : colors.lightBluebackground,
                    borderRadius: moderateScale(10),
                    marginBottom: moderateScaleVertical(12),
                    // borderColor:colors.redB,
                    // borderWidth:(focusedContainer!==null&&focusedContainer=="pickup")?1:0
                  }}>
                  <View style={{flexDirection:"row",  marginBottom:  moderateScale(5)}}>

                      <Text style={{ color: colors.black, fontFamily: fontFamily.bold, fontSize:14}} >{strings.PICKUP} : </Text>
                      <View style={{marginTop:0}}>
                        <Text numberOfLines={2} style={{ color: colors.greyText,  fontFamily: fontFamily.medium, fontSize:14}}>
                          {cartData?.delivery_pickup_name}
                        </Text>
                        <View style={{flexDirection:"row", justifyContent:"center", marginTop:5}}>
                          <TouchableOpacity onPress={()=>{
                            Communications.phonecall(cartData?.delivery_pickup_phone_number, true)
                            }}style={{width:15, height:15,  justifyContent:"center", alignItems:"center", marginTop:3}}>
                              <Image source={imagePath.callIconBlue} style={{width:15, height:15}} resizeMode={"cover"}/>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>{
                            Communications.phonecall(cartData?.delivery_pickup_phone_number, true)
                            }}>
                            <Text style={{ color: colors.greyText, fontFamily: fontFamily.medium, fontSize:14, marginLeft:10, textDecorationLine:"underline"}} >{cartData?.delivery_pickup_phone_number}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      
                      
                    
                  </View>
                  <View style={{flexDirection:"row",  marginBottom:  moderateScale(5)}}>

                      <Text style={{ color: colors.black, fontFamily: fontFamily.bold, fontSize:14}} >{strings.PICKUP} : </Text>
                      <View style={{marginTop:0}}>
                        <Text numberOfLines={2} style={{ color: colors.greyText,  fontFamily: fontFamily.medium, fontSize:14}}>
                          {cartData?.delivery_drop_name}
                        </Text>
                        <View style={{flexDirection:"row", justifyContent:"center", marginTop:5}}>
                          <TouchableOpacity onPress={()=>{
                            Communications.phonecall(cartData?.delivery_drop_phone_number, true)
                            }}style={{width:15, height:15,  justifyContent:"center", alignItems:"center", marginTop:3}}>
                              <Image source={imagePath.callIconBlue} style={{width:15, height:15}} resizeMode={"cover"}/>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>{
                            Communications.phonecall(cartData?.delivery_drop_phone_number, true)
                            }}
                            >
                            <Text style={{ color: colors.greyText, fontFamily: fontFamily.medium, fontSize:14, marginLeft:10, textDecorationLine:"underline"}} >{cartData?.delivery_drop_phone_number}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                  </View>
                  {/* <View style={{ flexDirection: 'row' ,alignItems: 'center', justifyContent: 'space-between', marginBottom:  moderateScale(5)}}>
                      <Text style={{ color: colors.blackC, fontFamily: fontFamily.bold, fontSize:14}} >{strings.DROPOFF} : <Text numberOfLines={2} style={{ color: colors.blackC,  fontFamily: fontFamily.medium, fontSize:12, opacity:0.5}}>
                        {cartData?.delivery_drop_name}
                      </Text>
                    </Text>
                    <TouchableOpacity onPress={()=>{
                        Communications.phonecall(cartData?.delivery_drop_phone_number, true)
                    }} style={{width:25, height:25, justifyContent:"center", alignItems:"center"}}>
                      <Image source={imagePath.callIconBlue} style={{width:15, height:15}} resizeMode={"cover"}/>
                    </TouchableOpacity>
                  </View> */}
              
                      
                </View>
              }
             
                  
          </View>
          
      </View >
    ); 
  };

  const orderAmountDetail = () => {
    return (
      <View style={styles.priceSection}>
        {/* <Text style={styles.price}>{strings.PRICE}</Text> */}
        <View
          style={[
            styles.bottomTabLableValue,
            // {marginTop: moderateScaleVertical(10)},
          ]}>
          <Text
            style={
              isDarkMode
                ? [
                  styles.priceItemLabel,
                  {
                    color: MyDarkTheme.colors.text,
                    fontSize: textScale(14),
                  },
                ]
                : styles.priceItemLabel
            }>
            {strings.SUBTOTAL}
          </Text>
          <Text
            style={
              isDarkMode
                ? [
                  styles.priceItemLabel,
                  {
                    color: MyDarkTheme.colors.text,
                    fontSize: textScale(14),
                  },
                ]
                : styles.priceItemLabel
            }>{`${currencies?.primary_currency?.symbol}${Number(
              cartData?.total_amount,
            ).toFixed(2)}`}</Text>
        </View>
        {!!cartData?.wallet_amount_used && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                  : styles.priceItemLabel
              }>
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                  : styles.priceItemLabel
              }>{`-${currencies?.primary_currency?.symbol}${Number(
                cartData?.wallet_amount_used ? cartData?.wallet_amount_used : 0,
              ).toFixed(2)}`}</Text>
          </View>
        )}
        {!!cartData?.loyalty_amount_saved && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                  : styles.priceItemLabel
              }>
              {strings.LOYALTY}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                  : styles.priceItemLabel
              }>{`-${currencies?.primary_currency?.symbol}${Number(
                cartData?.loyalty_amount_saved
                  ? cartData?.loyalty_amount_saved
                  : 0,
              ).toFixed(2)}`}</Text>
          </View>
        )}

        {!!cartData?.total_discount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                  : styles.priceItemLabel
              }>
              {strings.TOTAL_DISCOUNT}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                  : styles.priceItemLabel
              }>{`-${currencies?.primary_currency?.symbol}${Number(
                cartData?.total_discount,
              ).toFixed(2)}`}</Text>
          </View>
        )}
        {!!cartData?.taxable_amount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                  : styles.priceItemLabel
              }>
              {strings.TAX_AMOUNT}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                  : styles.priceItemLabel
              }>{`${currencies?.primary_currency?.symbol}${Number(
                cartData?.taxable_amount ? cartData?.taxable_amount : 0,
              ).toFixed(2)}`}</Text>
          </View>
        )}

        <View style={styles.amountPayable}>
          <Text
            style={
              isDarkMode
                ? [
                  styles.priceItemLabel2,
                  {
                    color: MyDarkTheme.colors.text,
                    fontSize: textScale(14),
                  },
                ]
                : styles.priceItemLabel2
            }>
            {strings.AMOUNT_PAYABLE}
          </Text>
          <Text
            style={
              isDarkMode
                ? [
                  styles.priceItemLabel2,
                  {
                    color: MyDarkTheme.colors.text,
                    fontSize: textScale(14),
                  },
                ]
                : styles.priceItemLabel2
            }>{`${currencies?.primary_currency?.symbol}${Number(
              cartData?.payable_amount,
            ).toFixed(2)}`}</Text>
        </View>
      </View>
    );
  };

  const getFooter = () => {
    return (
      <View
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>
        <View
          style={{
            padding: moderateScale(16),
            marginTop:-30,
            marginHorizontal:10
          }}>
          {/* <View  style={styles.addressStyles}>
          <Image source={imagePath.addressIcon} />
          <Text
            style={{
              ...styles.summaryText,
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
              marginLeft: 4,
            }}>
            {strings.DELIEVERY_ADDRESS}
          </Text>
          </View> */}
          { orderType === 'product' ? 
          <View  
            style={{
              padding: moderateScale(16),
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : colors.greyColor,
                borderRadius: moderateScale(10),
                marginBottom: moderateScaleVertical(12),
            }}>
            <View style={{ flexDirection: 'row' ,alignItems: 'center', justifyContent: 'flex-start', marginBottom:  moderateScale(5)}}>
            <Image source={imagePath.downArrow} />
            <Text  style={{ color: themeColors.primary_color, marginLeft: moderateScale(4) }}>{strings.DROPOFF_LOCATION}</Text>
            </View>
            <View>
                <Text>
                {cartData?.address?.address}
                </Text>
            </View>
          </View>
          //  <View
          //     style={{
          //       flexDirection: 'row',
          //       marginBottom: moderateScaleVertical(16),
          //     }}>
          //     <Image source={imagePath.icMap} />
          //     <View style={{ marginLeft: moderateScale(12), flex: 1 }}>
          //       <Text
          //         style={{
          //           ...styles.summaryText,
          //           fontSize: textScale(12),
          //           color: isDarkMode
          //             ? MyDarkTheme.colors.text
          //             : colors.blackOpacity43,
          //           flex: 1,
          //         }}>
          //         {cartData?.address?.address}
          //       </Text>
          //     </View>
          //   </View>
         : 
         <View> 
     
       
          </View>
          
          }
         
          <LeftRightText
            leftText={strings.ORDER_NUMBER}
            rightText={`#${cartData?.order_number || ''}`}
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
            }}
            rightTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />

          <LeftRightText
            leftText={strings.PAYMENT_METHOD}
            rightText={
              cartData?.payment_option?.title_lng
                ? cartData?.payment_option?.title_lng
                : cartData?.payment_option?.title || ''
            }
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
            }}
            rightTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />
          <LeftRightText
            leftText={strings.PLACED_ON}
            rightText={cartData?.created_date}
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
            }}
            rightTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />
          {/* {!!cartData?.scheduled_date_time && (
            <LeftRightText
              leftText={strings.SCHEDULED_DATETIME}
              rightText={moment(cartData?.scheduled_date_time).format('lll')}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
              leftTextStyle={{
                fontSize: textScale(12),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity43,
              }}
              rightTextStyle={{
                fontSize: textScale(12),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
              }}
            />
          )} */}

          {!!cartItems[0]?.vendor_dinein_table_id && (
            <View>
              <View
                style={{
                  height: 0.8,
                  backgroundColor: 'grey',
                  marginBottom: moderateScale(10),
                  opacity: 0.5,
                }}
              />
              <LeftRightText
                leftText={'Table info'}
                rightText={''}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
                leftTextStyle={{
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity43,
                }}
                rightTextStyle={{
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity86,
                }}
              />
              {cartItems[0]?.dineInTableCategory && (
                <LeftRightText
                  leftText={'Category Name'}
                  rightText={cartItems[0]?.dineInTableCategory}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  leftTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                  }}
                  rightTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity86,
                  }}
                />
              )}
              {cartItems[0]?.dineInTableName && (
                <LeftRightText
                  leftText={'Table Number'}
                  rightText={cartItems[0]?.dineInTableName}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  leftTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                  }}
                  rightTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity86,
                  }}
                />
              )}
              {cartItems[0]?.dineInTableCapacity && (
                <LeftRightText
                  leftText={'Seat Capacity'}
                  rightText={cartItems[0]?.dineInTableCapacity}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  leftTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                  }}
                  rightTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity86,
                  }}
                />
              )}
            </View>
          )}

          {(delivery_agent!==null&&delivery_agent!==undefined)&&
            <View  
              style={{
                padding: moderateScale(16),
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.background
                  : colors.lightBluebackground,
                borderRadius: moderateScale(10),
                marginBottom: moderateScaleVertical(12),
              }}>
              <View style={{ flex: 1, flexDirection: 'row' ,alignItems: 'center', justifyContent: 'space-between'}}>
              {/* <View style={{ flex: .2}}><Image source={imagePath.vehicleIcon} /></View> */}
              <View  style={{ flex: .7, flexDirection: 'row' , alignItems: 'center', justifyContent: 'flex-start'}}>
              <Image source={imagePath.truckiconBlue} style={{width:40, height:40}}/>
              <View style={{ flexDirection: 'column' ,alignItems: 'flex-start', justifyContent: 'flex-start' , marginLeft: moderateScale(15), }}>
                  <Text style={{fontFamily:fontFamily.bold, color:colors.black, fontSize:14}}>
                    {strings.SERVICEAGENT}
                  </Text>
                  <Text style={{fontFamily:fontFamily.regular, color:colors.black, fontSize:14}}>
                    {delivery_agent?.name}
                  </Text>
              </View> 
              </View>
              <View  style={{ flex: .3, alignItems:"flex-end",}}>
                <Menu >
                <MenuTrigger  >
                <Image source={imagePath.callIconBlue} style={{width:20, height:20}}/>
                    {/* <TransparentButtonWithTxtAndIcon
                        icon={imagePath.callIcon}
                        btnText={strings.CALL}
                        borderRadius={moderateScale(13)}
                        containerStyle={{
                          alignItems: 'center',
                          height: moderateScaleVertical(46),
                          width:60
                        }}
                        // onPress={() => {
                        //   Communications.phonecall(delivery_agent?.phone_number, true)
                        // }}
                        //marginBottom={moderateScaleVertical(10)}
                      // marginTop={moderateScaleVertical(20)}
                      btnStyle={{
                        backgroundColor: colors.focusBackGround
                      }}
                        textStyle={{
                          color: colors.white,
                          textTransform: 'none',
                          fontSize: textScale(12),
                          marginLeft: moderateScale(4),
                        }}
                      > 
                </TransparentButtonWithTxtAndIcon> */}
                
                </MenuTrigger>
                  <MenuOptions >
                    <MenuOption onSelect={()=>openWhatsApp(delivery_agent?.phone_number)} >
                      <View style={{alignItems:"center", flexDirection:"row", marginTop:10}}>
                        <Text style={{color:colors.black, fontSize:14, fontFamily:fontFamily.bold, marginHorizontal:10, textDecorationLine: 'underline'}}>{delivery_agent?.phone_number}</Text>
                        <Image source={imagePath.whatsappicon} style={{width:15, height:15}}/>
                      </View>
                    </MenuOption>
                    <MenuOption onSelect={() => {
                        Communications.phonecall(delivery_agent?.phone_number, true)
                      }} >
                      <View style={{alignItems:"center", flexDirection:"row", marginVertical:10}}>
                        <Text style={{color:colors.black, fontSize:14, fontFamily:fontFamily.bold, marginHorizontal:10, textDecorationLine: 'underline'}}>{delivery_agent?.phone_number}</Text>
                        <Image source={imagePath.callIconBlue} style={{width:15, height:15}}/>
                      </View>
                    </MenuOption>
                    {/* <MenuOption onSelect={() => alert(`Delete`)} >
                      <Text style={{color: 'red'}}>Delete</Text>
                    </MenuOption> */}
                  </MenuOptions>
                </Menu>
                {/* <TouchableOpacity onPress={()=>openWhatsApp(delivery_agent?.phone_number)}
                  style={{justifyContent:"center", alignItems:"center",height: moderateScaleVertical(46), width:60, marginBottom:10}}>
                  <Image source={imagePath.whatsappicon} style={{width:40, height:40}}/>
                </TouchableOpacity>
                <TransparentButtonWithTxtAndIcon
                      icon={imagePath.callIcon}
                      btnText={strings.CALL}
                      borderRadius={moderateScale(13)}
                      containerStyle={{
                        alignItems: 'center',
                        height: moderateScaleVertical(46),
                        width:60
                      }}
                      onPress={() => {
                        Communications.phonecall(delivery_agent?.phone_number, true)
                      }}
                      //marginBottom={moderateScaleVertical(10)}
                    // marginTop={moderateScaleVertical(20)}
                    btnStyle={{
                      backgroundColor: colors.focusBackGround
                    }}
                      textStyle={{
                        color: colors.white,
                        textTransform: 'none',
                        fontSize: textScale(12),
                        marginLeft: moderateScale(4),
                      }}
                    /> */}
              </View>
              </View>
            </View>
          }


          
          <View
          style={{
            // padding: moderateScale(16),
            // // backgroundColor: isDarkMode
            // //   ? MyDarkTheme.colors.background
            // //   : colors.greyColor,
            // borderRadius: moderateScale(10),
            // borderColor: colors.greyColor,
            // borderWidth: 2,
            
          }}>
          {/* <Text
            style={{
              ...styles.summaryText,
              fontFamily: fontFamily.medium,
              fontSize: textScale(14),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}>
            {strings.PAYMENT_SUMMARY}
          </Text> */}
          <View style={{flexDirection:"row",  alignItems:"center", marginBottom:20, marginTop:10}}>
            <View style={{width:25, height:25, borderRadius:8, backgroundColor:colors.lightBluebackground, justifyContent:"center", alignItems:"center"}}>
              <Image source={imagePath.summeryIcon} style={{width:12, height:12}}/>
            </View>
            <Text
              numberOfLines={1}
              style={[
                      styles.carType,
                      {
                        color: colors.greyText,
                        fontFamily: fontFamily.medium,
                        fontSize: textScale(13),
                        marginLeft:10
                      },
                    ]
              }>
              {strings?.PAYMENT_SUMMARY}
            </Text>
          </View>

          {orderType === 'product' &&

              <>

                {!!cartData?.total_amount && (
                  <LeftRightText
                    // leftText={!!cartData?.total_delivery_fee && orderType !== 'product' && cartData?.total_delivery_fee>0 && strings.SUBTOTAL}
                    leftText={strings.PRODUCT_AMOUNT}
                    rightText={`${currencies?.primary_currency?.symbol}${Number(
                      cartData?.total_amount,
                    ).toFixed(2)}`}
                    isDarkMode={isDarkMode}
                    MyDarkTheme={MyDarkTheme}
                    leftTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                    rightTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                  />
                )}
                {!!cartData?.total_amount && (
                  <LeftRightText
                    // leftText={!!cartData?.total_delivery_fee && orderType !== 'product' && cartData?.total_delivery_fee>0 && strings.SUBTOTAL}
                    leftText={strings.SUBTOTAL}
                    rightText={`${currencies?.primary_currency?.symbol}${Number(
                      cartData?.total_amount,
                    ).toFixed(2)}`}
                    isDarkMode={isDarkMode}
                    MyDarkTheme={MyDarkTheme}
                    leftTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                    rightTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                  />
                )}
                {!!cartData?.total_delivery_fee && orderType !== 'product' && cartData?.total_delivery_fee>0 && (
                  <LeftRightText
                    leftText={strings.DELIVERY_FEE}
                    rightText={`${currencies?.primary_currency?.symbol}${Number(
                      cartData?.total_delivery_fee,
                    ).toFixed(2)}`}
                    isDarkMode={isDarkMode}
                    MyDarkTheme={MyDarkTheme}
                    leftTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                    rightTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                  />
                )}
                {!!cartData?.total_delivery_fee && orderType === 'product' && (
                  <LeftRightText
                    leftText={strings.DELIVERY_FEE}
                    rightText={`${currencies?.primary_currency?.symbol}${Number(
                      cartData?.total_delivery_fee,
                    ).toFixed(2)}`}
                    isDarkMode={isDarkMode}
                    MyDarkTheme={MyDarkTheme}
                    leftTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                    rightTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                  />
                )}
                {!!cartData?.total_discount && (
                  <LeftRightText
                    leftText={strings.DISCOUNT}
                    rightText={`-${currencies?.primary_currency?.symbol}${Number(
                      cartData?.total_discount,
                    ).toFixed(2)}`}
                    isDarkMode={isDarkMode}
                    MyDarkTheme={MyDarkTheme}
                    leftTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                    rightTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                  />
                )}
                {!!cartData?.taxable_amount && (
                  <LeftRightText
                    // leftText={!!cartData?.total_delivery_fee && orderType !== 'product' && cartData?.total_delivery_fee>0 && strings.SUBTOTAL}
                    leftText={strings.TAX}
                    rightText={`${currencies?.primary_currency?.symbol}${Number(
                      cartData?.taxable_amount,
                    ).toFixed(2)}`}
                    isDarkMode={isDarkMode}
                    MyDarkTheme={MyDarkTheme}
                    leftTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                    rightTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                  />
                )}

                <LeftRightText
                  leftText={strings.TOTAL}
                  rightText={`${currencies?.primary_currency?.symbol}${Number(
                    cartData?.payable_amount,
                  ).toFixed(2)}`}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  leftTextStyle={{
                    fontSize: textScale(14),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity86,
                  }}
                  rightTextStyle={{
                    fontSize: textScale(14),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity86,
                  }}
                />
              </>
              
            
          }


          {orderType !== 'product' &&

          <>

            {!!cartData?.service_fee && (
              <LeftRightText
                // leftText={!!cartData?.total_delivery_fee && orderType !== 'product' && cartData?.total_delivery_fee>0 && strings.SUBTOTAL}
                leftText={strings.SERVICEFEE}
                rightText={`${currencies?.primary_currency?.symbol}${Number(
                  cartData?.service_fee,
                ).toFixed(2)}`}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
                leftTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                rightTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
              />
            )}
            {!!cartData?.taxable_amount && (
              <LeftRightText
                // leftText={!!cartData?.total_delivery_fee && orderType !== 'product' && cartData?.total_delivery_fee>0 && strings.SUBTOTAL}
                leftText={strings.VAT}
                rightText={`${currencies?.primary_currency?.symbol}${Number(
                  cartData?.taxable_amount,
                ).toFixed(2)}`}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
                leftTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                rightTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
              />
            )}
            {!!cartData?.total_amount && (
              <LeftRightText
                leftText={strings.GRANDTOTAL}
                rightText={`${currencies?.primary_currency?.symbol}${Number(
                  cartData?.total_amount,
                ).toFixed(2)}`}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
                leftTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
                rightTextStyle={{color:colors.black, fontSize:14, fontFamily:fontFamily.medium}}
              />
            )}
          </>


          }

          <View
            style={{
              // ...styles.dottedLine,
              // borderColor: isDarkMode
              //   ? MyDarkTheme.colors.text
              //   : colors.lightGreyBgColor,
          
            }}
          />



          {paramData?.orderStatus?.current_status?.title ===
            strings.DELIVERED &&
            !!appData?.profile?.preferences?.tip_after_order &&
            cartData?.tip_amount == 0 &&
            !!cartData?.tip &&
            cartData?.tip.length && (
              <View
                style={{
                  flexDirection: 'column',
                  marginTop: 20,
                  justifyContent: 'space-between',
                  marginVertical: moderateScaleVertical(5),
                }}>
                <Text
                  style={{
                    color: colors.textGreyB,
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(12),
                  }}>
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
                          style={{
                            backgroundColor:
                              selectedTipvalue?.value == j?.value
                                ? themeColors.primary_color
                                : 'transparent',
                            flex: 0.18,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 0.7,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            marginRight: 5,
                            marginVertical: 20,
                            borderRadius: moderateScale(5),
                            borderColor: themeColors.primary_color,
                          }}
                          onPress={() => selectedTip(j)}>
                          <Text
                            style={
                              isDarkMode
                                ? {
                                  color:
                                    selectedTipvalue?.value == j?.value
                                      ? colors.white
                                      : MyDarkTheme.colors.text,
                                }
                                : {
                                  color:
                                    selectedTipvalue?.value == j?.value
                                      ? colors.white
                                      : colors.black,
                                }
                            }>
                            {`${currencies?.primary_currency?.symbol} ${j.value}`}
                          </Text>
                          <Text
                            style={{
                              color:
                                selectedTipvalue?.value == j?.value
                                  ? colors.white
                                  : colors.textGreyB,
                            }}>
                            {j.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}

                  <TouchableOpacity
                    style={{
                      backgroundColor:
                        selectedTipvalue == 'custom'
                          ? themeColors.primary_color
                          : 'transparent',
                      flex: cartData?.total_payable_amount !== 0 ? 0.45 : 0.2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 0.7,
                      paddingHorizontal: 15,
                      paddingVertical: 5,
                      marginLeft: 2,
                      marginVertical: 20,
                      borderRadius: moderateScale(5),
                      borderColor: themeColors.primary_color,
                    }}
                    onPress={() => selectedTip('custom')}>
                    <Text
                      style={
                        isDarkMode
                          ? {
                            color:
                              selectedTipvalue == 'custom'
                                ? colors.white
                                : MyDarkTheme.colors.text,
                          }
                          : {
                            color:
                              selectedTipvalue == 'custom'
                                ? colors.white
                                : colors.black,
                          }
                      }>
                      {strings.CUSTOM}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>

                {!!selectedTipvalue && selectedTipvalue == 'custom' && (
                  <View
                    style={{
                      borderRadius: 5,
                      borderWidth: 0.5,
                      borderColor: colors.textGreyB,
                      height: 40,
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
                    />
                  </View>
                )}
                <TouchableOpacity
                  // onPress={onPressRateOrder}
                  onPress={_onAddTip}
                  // style={{flex:0.6}}
                  style={{
                    justifyContent: 'center',
                    backgroundColor: themeColors.primary_color,
                    alignItems: 'center',
                    borderRadius: moderateScale(10),
                    paddingVertical: moderateScaleVertical(10),
                    marginTop: moderateScaleVertical(10),
                  }}>
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: fontFamily.medium,
                      fontSize: textScale(10),
                    }}>
                    {strings.ADD_TIP}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

          <View
            style={{
              height: moderateScaleVertical(40),
              marginBottom:20
            }}
          />
        </View>
        </View>
      </View>
    );
  };

  const selectedTip = (tip) => {
    if (selectedTipvalue == 'custom') {
      updateState({ selectedTipvalue: tip, selectedTipAmount: null });
    } else {
      if (selectedTipvalue && selectedTipvalue?.value == tip?.value) {
        updateState({ selectedTipvalue: null, selectedTipAmount: null });
      } else {
        updateState({ selectedTipvalue: tip, selectedTipAmount: tip?.value });
      }
    }
  };

  const _onAddTip = () => {
    if (!selectedTipAmount) {
      showError(strings.PLEASE_SELECT_VALID_OPTION);
    } else if (!userData?.auth_token) {
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
    } else {
      moveToNewScreen(navigationStrings.TIP_PAYMENT_OPTIONS, {
        selectedTipAmount: selectedTipAmount,
        order_number: cartData?.order_number,
      })();
    }
  };

  const getProductHeader = () => {
  

    let getUserImage = getImageUrl(
      cartData?.user_image?.image_fit,
      cartData?.user_image?.image_path,
      '500/500',
    );

    return (
      <>
        {!!orderStatus && orderStatus?.current_status?.title == 'Placed' && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: moderateScaleVertical(10),
            }}>
            {/* <BallIndicator
              size={35}
              count={10}
              color={themeColors.primary_color}
            /> */}

            <LottieView
              source={loaderFive}
              autoPlay
              loop
              style={{
                height: moderateScaleVertical(100),
                width: moderateScale(100),
              }}
              colorFilters={[
                {
                  keypath: 'right sand',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'left sand',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'right sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'left sand 2',
                  color: themeColors.primary_color,
                },

                {
                  keypath: 'right top sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'left top sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top left sand 1',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top left sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'right fallin sand',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'bottom cyrcle 12',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'bottom cyrcle 11',
                  color: themeColors.primary_color,
                },

                {
                  keypath: 'left fallin sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top right sand 1',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top right sand 1',
                  color: themeColors.primary_color,
                },

                // top right sand 1
              ]}
            />
            <Text style={styles.waitToAccept}>{strings.WAITINGTOACCEPT}</Text>
          </View>
        )}
        {!!orderStatus &&
          orderStatus?.current_status?.title != 'Rejected' &&
          orderStatus?.current_status?.title != 'Placed' && (
            <View
              style={{
                marginVertical: moderateScaleVertical(20),
              }}>
              <StepIndicators
                labels={labels}
                currentPosition={currentPosition}
                themeColor={themeColors}
              />
            </View>
          )}
        {/* {!orderStatus &&
          paramData?.orderStatus?.current_status?.title != 'Rejected' &&
          paramData?.orderStatus?.current_status?.title != 'Placed' && (
            <View
              style={{
                marginVertical: moderateScaleVertical(20),
              }}>
              <StepIndicators
                labels={labels}
                currentPosition={currentPosition}
                themeColor={themeColors}
              />
            </View>
          )} */}
      </>
    );
  };

  const getDeliveryHeader = () => {

   
    let rejected = false;
    let reasonReason = false;
    if(cartItems[0]?.order_status?.current_status?.title==="Rejected"){
      rejected= true;
      reasonReason=(cartItems[0]?.reject_reason!==null&&cartItems[0]?.reject_reason!==undefined)?cartItems[0]?.reject_reason:"";
    }
    let getUserImage = getImageUrl(
      cartData?.user_image?.image_fit,
      cartData?.user_image?.image_path,
      '500/500',
    );

    return (
      <>
        {(deliveryCurrentPosition === -1&&!rejected&&!cartItems[0]?.order_status?.current_status?.title==="Rider Reached") && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: moderateScaleVertical(10),
            }}>
            {/* <BallIndicator
              size={35}
              count={10}
              color={themeColors.primary_color}
            /> */}

            <LottieView
              source={loaderFive}
              autoPlay
              loop
              style={{
                height: moderateScaleVertical(100),
                width: moderateScale(100),
              }}
              colorFilters={[
                {
                  keypath: 'right sand',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'left sand',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'right sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'left sand 2',
                  color: themeColors.primary_color,
                },

                {
                  keypath: 'right top sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'left top sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top left sand 1',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top left sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'right fallin sand',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'bottom cyrcle 12',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'bottom cyrcle 11',
                  color: themeColors.primary_color,
                },

                {
                  keypath: 'left fallin sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top right sand 1',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top right sand 1',
                  color: themeColors.primary_color,
                },

                // top right sand 1
              ]}
            />
            <Text style={styles.waitToAccept}>{strings.WAITINGTOACCEPT}</Text>
          </View>
        )}

        {(deliveryCurrentPosition !== -1&&!rejected)  && (
            <View
              style={{
                marginVertical: moderateScaleVertical(20),
              }}>
              <StepIndicators
                labels={deliveryLabels}
                currentPosition={deliveryCurrentPosition}
                themeColor={themeColors}
              />
            </View>
          )}
        {!orderStatus &&
          paramData?.orderStatus?.current_status?.title != 'Rejected' &&
          paramData?.orderStatus?.current_status?.title != 'Placed' && (
            <View
              style={{
                marginVertical: moderateScaleVertical(20),
              }}>
              <StepIndicators
                labels={labels}
                currentPosition={deliveryCurrentPosition}
                themeColor={themeColors}
              />
            </View>
          )}
      </>
    );
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <HeaderWithFilters
        leftIcon={
          imagePath.icBackb
        }
        centerTitle={strings.ORDER_DETAILS}
      />
      <View
        style={{
          height: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.borderLight,
        }}
      />
 

   
      {/* {delivery_agent && delivery_agent.name &&  (
          <View
            style={{
              width: width - 40,
              justifyContent: 'space-between',
              paddingVertical: moderateScaleVertical(30),
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <FastImage
                  source={{
                    uri:
                    delivery_agent.profile_picture != null &&
                    delivery_agent.profile_picture != '' &&
                    delivery_agent.profile_picture != undefined
                        ?  delivery_agent.profile_picture
                        : dummyUser,
                    priority: FastImage.priority.high,
                  }}
                  style={{
                    height: moderateScale(64),
                    width: moderateScale(64),
                    borderRadius: moderateScale(12),
                  }}
                />
              </View>
            </View>
            {delivery_agent  && delivery_agent.phone_number && (
            <View
                style={{
                  // marginVertical: moderateScaleVertical(5),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: moderateScaleVertical(5),
                }}>
                <GradientButton
                  colorsArray={[
                    themeColors.primary_color,
                    themeColors.primary_color,
                  ]}
                  textStyle={{textTransform: 'none', fontSize: textScale(16)}}
                  onPress={() => Communications.text(delivery_agent?.phone_number)}
                  marginTop={moderateScaleVertical(20)}
                  //marginBottom={moderateScaleVertical(10)}
                  btnText={strings.MESSAGE}
                  containerStyle={{width: width / 2}}
                />
                <TransparentButtonWithTxtAndIcon
                  btnText={strings.CALL}
                  borderRadius={moderateScale(13)}
                  containerStyle={{
                    alignItems: 'center',
                    width: width / 3,
                  }}
                  onPress={() => {
                    Communications.phonecall(delivery_agent?.phone_number, true)
                  }}
                  //marginBottom={moderateScaleVertical(10)}
                  marginTop={moderateScaleVertical(20)}
                  textStyle={{
                    color: themeColors.primary_color,
                    textTransform: 'none',
                    fontSize: textScale(16),
                  }}
                />
            </View>
            )}
          </View>
        ) } */}
      <View
        style={{
          ...styles.mainComponent,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}
        >
        {(cartItems[0]?.order_status?.current_status?.title==="Rejected") && (
            <View style={{marginHorizontal:20,  marginTop:10, backgroundColor:colors.white, borderWidth:0.5, borderRadius:15, borderColor:colors.redB, padding:10}}>

              {/* <LeftRightText
                leftText={strings.ORDER_STATUS}
                rightText={cartItems[0]?.order_status?.current_status?.title}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
                leftTextStyle={{
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity43,
                }}
                rightTextStyle={{
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.redB,
                }}
              />
              <LeftRightText
                leftText={strings.REJECTIONREASON}
                rightText={cartItems[0]?.reject_reason}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
                leftTextStyle={{
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity43,
                }}
                rightTextStyle={{
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity86,
                }}
              /> */}
              <Text style={{color:colors.redB, fontSize:14, fontFamily:fontFamily.medium}}>We're sorry! Your order has been cancelled</Text>
              <Text style={{color:colors.blackC, fontSize:14, fontFamily:fontFamily.bold, marginTop:5}}>Reason: <Text>{cartItems[0]?.reject_reason}</Text></Text>
            </View>
        )}
        <FlatList
          data={cartItems}
          extraData={cartItems}
          ListHeaderComponent={cartItems.length ? (orderType === 'product' ? getProductHeader() :  getDeliveryHeader())  : null}
          ListFooterComponent={cartItems.length ? getFooter() : null}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: colors.backgroundGrey }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={_renderItem}
          ListEmptyComponent={<ListEmptyCart isLoading={isLoading} />}
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        />
      </View>
    </WrapperContainer>
  );
}
