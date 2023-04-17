import React, { useEffect, useState } from 'react';
import {
  I18nManager,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  height,
} from '../../../styles/responsiveSize';
import { getImageUrl } from '../../../utils/helperFunctions';
import stylesFun from './styles';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../../../styles/theme';
import moment from 'moment';
import { string } from 'prop-types';
import { Switch } from 'react-native-paper';
import actions from '../../../redux/actions';
import ListEmptyCar from './ListEmptyCar';
import { style } from 'deprecated-react-native-prop-types/DeprecatedImagePropType';
import { RadioButton } from 'react-native-paper';
import BorderTextArea from "../../../Components/BorderTextArea"
import BorderTextInput from '../../../Components/BorderTextInput';
import { color } from 'react-native-reanimated';

export default function SelectPaymentModalView({
  isLoading = false,
  onPressBack,
  _confirmAndPay,
  slectedDate = '',
  selectedTime = '',
  totalDistance = 0,
  totalDuration = 0,
  selectedCarOption,
  delivery_cart_id,
  navigation = navigation,
  couponInfo = null,
  updatedPrice = null,
  removeCoupon,
  loyalityAmount = 0,
  pickUpTimeType = '',
  redirectToPayement,
  selectedPayment = null,
  pickup_taxi = false,
  delivery_tags_price,
  isWalletEnabled,
  isLoadingB,
  toggleSwitch,
  onMessage,
  message,
  locationDetail,
  focusedContainer=null
}) {
  console.log("TaxiApp - SelectPaymentModalView.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appData, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const styles = stylesFun({ fontFamily, themeColors });
  const commonStyles = commonStylesFun({ fontFamily });
  const { profile } = appData;
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const userData = useSelector((state) => state?.auth?.userData);
  const [cod, setCod] = useState(false);

  const [pickName, setPickName]=useState('');
  const [pickPhoneNo, setpickPhoneNo]=useState('');
  const [dropName, setDropName]=useState('');
  const [dropPhoneNumber, setDropPhoneNumber]=useState('');
  const [sameUserCheck, setSameUserCheck]=useState(false);  // we need to use same drop off phone and name as pickup if its true

 




  // const [state, setState] = useState({ isWalletEnabled: false, isLoadingB: false });
  // const { isWalletEnabled, isLoadingB } = state;

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };
  const errorMethod = (error) => {
    updateState({
      isLoadingB: false,
    });
    showError(error?.message || error?.error);
  };
 
  //Get list of all offers
  const _getAllOffers = (vendor, cartData) => {
    moveToNewScreen(navigationStrings.OFFERS2, {
      vendor: vendor,
      cabOrder: true,
      isTaxi: true,
      isWalletEnabled: isWalletEnabled,
      delivery_cart_id:delivery_cart_id,
      // cartId: cartData.id,
    })();
  };

  const _renderSelectedItem= (item={})=>{
    console.log("_renderSelectedItem", item);
    return (
      <TouchableOpacity   onPress={() =>{}} style={[
        {
            // marginVertical:10,
            borderRadius:15,
            marginTop:15,
            // marginHorizontal:20,
            borderRadius:15,
            backgroundColor:"#E7F2F9",
          }, 
          // (Platform.OS=="ios")&&
          // {
          //   shadowColor: '#171717',
          //   shadowOffset: {width: -2, height: 4},
          //   shadowOpacity: 0.2,
          //   shadowRadius: 3,
          // }, 
          // (Platform.OS=="android")&&{
          //   elevation:10
          // }
        ]}>
            <View
              style={{
                opacity: 1,
                padding:10,
                alignContent:"space-between",
                
              }}>
              <View style={{flexDirection:"row",  alignItems:"center"}}>
                <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center", marginRight:15, marginLeft:10}}>
                 
                  <Image
                    resizeMode={'contain'}
                    style={[{height: 130, width: 120, borderRadius:15, marginTop:-5}, 
                      
                    ]}
                    source={{
                      uri: getImageUrl(
                        item?.media[0]?.image?.path?.proxy_url,
                        item?.media[0]?.image?.path?.image_path,
                        '150/150',
                      ),
                    }}
                  />
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
                          {item?.translation[0]?.title}
                    </Text>
                    {/* <Text
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
                            item.tags_price,
                          ).toFixed(2)}`}
                    </Text> */}

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
                          {item?.dimensions}
                      </Text> 
                      {/* H 20cm * W 20cm * L 20cm */}
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
                          {item?.weight_description}
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
                          {item?.sla}
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

  const onContactSelect=(type, item)=>{
    if(type=="pickup"){
      setPickName(item?.name)
      setpickPhoneNo(item?.phonenumber)
      if(sameUserCheck){
        setDropName(item?.name)
        setDropPhoneNumber(item?.phonenumber)
      }
    }
    else{
      setDropName(item?.name)
      setDropPhoneNumber(item?.phonenumber)
    }
   }

   useEffect(()=>{
    if(sameUserCheck){
      setDropName(pickName)
      setDropPhoneNumber(pickPhoneNo)
    }
   }, [sameUserCheck, pickName, pickPhoneNo]);


  return (
    <View
      style={
        isDarkMode
          ? [
            styles.bottomView,
            {
              backgroundColor: MyDarkTheme.colors.background,
            },
          ]
          : styles.bottomView
      }>
      <View style={{flexDirection:"row", alignItems:"center", position:"absolute",top:0, left:0, right:0, height:60, zIndex:100, backgroundColor:colors.white, marginHorizontal:20}}>
            <TouchableOpacity
              style={{ flex: 0.2 }}
              onPress={onPressBack}>
              <Image
                style={isDarkMode && { tintColor: MyDarkTheme.colors.text }}
                source={imagePath.backArrowCourier}
              />
            </TouchableOpacity>
            <Text
              numberOfLines={1}
              style={[
                      styles.carType,
                      {
                        color: colors.blackC,
                        fontFamily: fontFamily.bold,
                        fontSize: textScale(18),
                        marginLeft:20
                      },
                    ]
              }>
              {strings?.ORDER_SUMMARY}
            </Text>
      </View>
      <ScrollView style={{marginTop:20}}>
        {/* <View
          style={{
            width: moderateScale(35),
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.text
              : colors.grayOpacity51,
            height: moderateScale(2),
            marginTop: moderateScale(20),
            alignSelf: 'center',
          }}
        /> */}
        <View
          style={{
            // justifyContent: 'center',
            // alignItems: 'center',
            // borderColor: isDarkMode
            //   ? MyDarkTheme.colors.text
            //   : colors.grayOpacity51,
            // borderBottomWidth: 0.5,
          }}>
          <View
            style={{
              marginVertical:30,
              paddingHorizontal:20
            }}>

            
            
            
            <View style={{flexDirection:"row",  alignItems:"center", marginTop:20}}>
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

             {_renderSelectedItem(selectedCarOption)}
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
            
        
        
            <View> 
              <View  
              style={{
                marginTop:10,
                padding: moderateScale(16),
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.background
                  : colors.lightBluebackground,
                borderRadius: moderateScale(10),
                marginBottom: moderateScaleVertical(12),
                borderColor:colors.redB,
                borderWidth:(focusedContainer!==null&&focusedContainer=="pickup")?1:0
              }}>
                <View style={{ flexDirection: 'row' ,alignItems: 'center', justifyContent: 'flex-start', marginBottom:  moderateScale(5)}}>
                <View style={{width:25, height:25, borderRadius:10, backgroundColor:colors.white, justifyContent:"center", alignItems:"center"}}>
                  <Image source={imagePath.arrowUpBlueBack} style={{width:18, height:18}} resizeMode={"cover"}/>
                </View>
                
                <Text style={{ color: colors.blackC, marginLeft:10, fontFamily: fontFamily.bold, fontSize:12}} >{strings.PICKUP}</Text>
                </View>
                <View>
                    <Text numberOfLines={2} style={{ color: colors.blackC,  fontFamily: fontFamily.medium, fontSize:12, opacity:0.7}}>
                      {locationDetail[0]?.address}
                      {/* {cartData.delivery_pickup_address} */}
                    </Text>
                </View>
                <View style={{backgroundColor:colors.white, width:'98%', borderRadius:15, borderRadius:15, padding:10 , alignSelf:"center", marginTop:10}}>
                  <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                      <View style={{flex:0.88}}>
                        <BorderTextInput
                          borderRadius={0}
                          containerStyle={{borderWidth:0,marginBottom:0, backgroundColor:colors.white,height:35, alignItems:"center"}}
                          textInputStyle={{height:35, alignSelf:"center", fontSize:13,  fontFamily: fontFamily.bold, color:colors.blackC }}
                          onChangeText={(txt)=>{setPickName(txt)}}
                          placeholder={strings.NAMETXT}
                          value={pickName}
                        />
                        <View style={{width:'100%', height:1, backgroundColor:colors.lightGreyBorder}}/>
                        <BorderTextInput
                          borderRadius={0}
                          containerStyle={{borderWidth:0,marginBottom:0, backgroundColor:colors.white,height:35, alignItems:"center"}}
                          textInputStyle={{height:35, alignSelf:"center", fontSize:13,  fontFamily: fontFamily.bold, color:colors.blackC }}
                          onChangeText={(txt)=>{setpickPhoneNo(txt)}}
                          placeholder={strings.PHONENUMBER}
                          value={pickPhoneNo}
                          keyboardType={"phone-pad"}
                        />
                      </View>

                      <TouchableOpacity 
                        onPress={()=>{navigation.navigate(navigationStrings?.CONTACTSBOOK, {
                          onSelect:(type,item)=>onContactSelect(type,item),
                          type:"pickup"
                        })}}

                        style={{flex:0.12,justifyContent:"center", alignItems:"center", marginLeft:10}}>
                        <View style={{width:40, height:40, justifyContent:"center", alignItems:"center", backgroundColor:colors.lightBluebackground, borderRadius:15}}>
                          <Image source={imagePath.personContact}  style={{width:30, height:30}} resizeMode={"cover"}/>
                        </View>
                      </TouchableOpacity>
                  </View>
                  
                </View>
              </View>
              <View  
              style={{
                padding: moderateScale(16),
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.background
                  : colors.lightBluebackground,
                borderRadius: moderateScale(10),
                marginBottom: moderateScaleVertical(12),
                borderColor:colors.redB,
                borderWidth:(focusedContainer!==null&&focusedContainer=="dropoff")?1:0
              }}>
                <View style={{ flexDirection: 'row' ,alignItems: 'center', justifyContent: 'flex-start', marginBottom:  moderateScale(5)}}>
                <View style={{width:25, height:25, borderRadius:10, backgroundColor:colors.white, justifyContent:"center", alignItems:"center"}}>
                  <Image source={imagePath.arrowDownBlueBack}  style={{width:18, height:18}} resizeMode={"cover"}/>
                </View>
                
                <Text style={{ color: colors.blackC, marginLeft:10, fontFamily: fontFamily.bold, fontSize:12}} >{strings.DROPOFF}</Text>
                </View>
                <View>
                    <Text numberOfLines={2} style={{ color: colors.blackC,  fontFamily: fontFamily.medium, fontSize:12, opacity:0.7}}>
                    {locationDetail[1]?.address}
                    </Text>
                </View>
                <View style={{width:"100%", alignItems:"flex-start"}}>
                  <TouchableOpacity 
                    onPress={() => {sameUserCheck?setSameUserCheck(false):setSameUserCheck(true)}}
                    style={{borderRadius:15,flexDirection:"row", alignItems:"center", justifyContent:"flex-start", marginLeft:-20}}>
                    <RadioButton.Item
                      color={colors.focusBackGround}
                      value={sameUserCheck?1:0}
                      label={""}
                      status={sameUserCheck ? 'checked' : 'unchecked'}
                      onPress={() => {sameUserCheck?setSameUserCheck(false):setSameUserCheck(true)}}
                    />
                      <Text
                        numberOfLines={1}
                        style={[
                                styles.carType,
                                {
                                  color: colors.blackC,
                                  fontFamily: fontFamily.medium,
                                  fontSize: textScale(12),
                                  marginLeft:0
                                },
                              ]
                        }>
                        {strings?.SAMEPICKUPDROPCHECK}
                      </Text>
                  </TouchableOpacity>
                </View>

                <View style={{backgroundColor:colors.white, width:'98%', borderRadius:15, borderRadius:15, padding:10 , alignSelf:"center", marginTop:10}}>
                  <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                      <View style={{flex:0.88}}>
                        <BorderTextInput
                          focusable={!sameUserCheck}
                          editable={!sameUserCheck}
                          borderRadius={0}
                          containerStyle={{borderWidth:0,marginBottom:0, backgroundColor:colors.white,height:35, alignItems:"center"}}
                          textInputStyle={{height:35, alignSelf:"center", fontSize:13,  fontFamily: fontFamily.bold, color:colors.blackC }}
                          onChangeText={(txt)=>{setDropName(txt)}}
                          placeholder={strings.NAMETXT}
                          value={dropName}
                        />
                        <View style={{width:'100%', height:1, backgroundColor:colors.lightGreyBorder}}/>
                        <BorderTextInput
                          focusable={!sameUserCheck}
                          editable={!sameUserCheck}
                          borderRadius={0}
                          containerStyle={{borderWidth:0,marginBottom:0, backgroundColor:colors.white,height:35, alignItems:"center"}}
                          textInputStyle={{height:35, alignSelf:"center", fontSize:13,  fontFamily: fontFamily.bold, color:colors.blackC }}
                          onChangeText={(txt)=>{setDropPhoneNumber(txt)}}
                          placeholder={strings.PHONENUMBER}
                          value={dropPhoneNumber}
                          keyboardType={"phone-pad"}
                        />
                      </View>

                      <TouchableOpacity 
                        onPress={()=>{
                          if(!sameUserCheck){
                            navigation.navigate(navigationStrings?.CONTACTSBOOK, {
                              onSelect:(type,item)=>onContactSelect(type,item),
                              type:"dropoff"
                            })
                          }
                        }}

                        style={{flex:0.12,justifyContent:"center", alignItems:"center", marginLeft:10}}>
                        <View style={{width:40, height:40, justifyContent:"center", alignItems:"center", backgroundColor:colors.lightBluebackground, borderRadius:15, opacity:sameUserCheck?0.5:1}}>
                          <Image source={imagePath.personContact}  style={{width:30, height:30}} resizeMode={"cover"}/>
                        </View>
                      </TouchableOpacity>
                  </View>
                  
                </View>
              </View>
        
            </View>



            <View style={{flexDirection:"row",  alignItems:"center"}}>
                <View style={{width:25, height:25, borderRadius:8, backgroundColor:colors.lightBluebackground, justifyContent:"center", alignItems:"center"}}>
                  <Image source={imagePath.cardBlue} style={{width:15, height:15}}/>
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
                  {strings?.PAYMENT}
                </Text>
            </View>

            <View style={{flexDirection:"row",  alignItems:"center", justifyContent:"space-between", marginTop:20}}>
              <Text
                numberOfLines={1}
                style={[
                        styles.carType,
                        {
                          color: colors.greyText,
                          fontFamily: fontFamily.medium,
                          fontSize: textScale(13),
                        },
                      ]
                }>
                {strings?.SERVICEFEE}
              </Text>
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
                {selectedCarOption ? `${currencies?.primary_currency?.symbol}${Number(
                  selectedCarOption?.service_fee,
                  ).toFixed(2)}`
                  : ''}
              </Text>
            </View>
            <View style={{flexDirection:"row",  alignItems:"center", justifyContent:"space-between", marginTop:10}}>
              <Text
                numberOfLines={1}
                style={[
                        styles.carType,
                        {
                          color: colors.greyText,
                          fontFamily: fontFamily.medium,
                          fontSize: textScale(13),
                        },
                      ]
                }>
                {strings?.VAT}
              </Text>
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
                }>{selectedCarOption ? `${currencies?.primary_currency?.symbol}${Number(
                  selectedCarOption?.tax_amount,
                  ).toFixed(2)}`
                  : ''}
              </Text>
            </View>
            <View style={{flexDirection:"row",  alignItems:"center", justifyContent:"space-between", marginTop:10}}>
              <Text
                numberOfLines={1}
                style={[
                        styles.carType,
                        {
                          color: colors.blackC,
                          fontFamily: fontFamily.bold,
                          fontSize: textScale(14),
                        },
                      ]
                }>
                {strings?.GRANDTOTAL}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                        styles.carType,
                        {
                          color: colors.blackC,
                          fontFamily: fontFamily.bold,
                          fontSize: textScale(14),
                          marginLeft:10
                        },
                      ]
                }>
                {selectedCarOption ? `${currencies?.primary_currency?.symbol}${Number(
                    delivery_tags_price,
                  ).toFixed(2)}`
                  : ''}
              </Text>
            </View>
            <TouchableOpacity 
               onPress={() => {cod?setCod(false):setCod(true)}}
              style={{
                width:"100%", height:50, borderRadius:15, backgroundColor:colors.lightBluebackground, marginTop:20, flexDirection:"row", alignItems:"center",
                borderColor:colors.redB,
                borderWidth:(focusedContainer!==null&&focusedContainer=="cod")?1:0
              }}>
              <RadioButton.Item
                color={colors.focusBackGround}
                value={cod?1:0}
                label={""}
                status={cod ? 'checked' : 'unchecked'}
                onPress={() => {cod?setCod(false):setCod(true)}}
              />
              <Text
                numberOfLines={1}
                style={[
                        styles.carType,
                        {
                          color: colors.blackC,
                          fontFamily: fontFamily.medium,
                          fontSize: textScale(12),
                          marginLeft:0
                        },
                      ]
                }>
                {strings?.CASH_ON_DELIVERY}
              </Text>
            </TouchableOpacity>

            <BorderTextArea
              onChangeText={(txt)=>onMessage(txt)}
              placeholder={strings.MESSSAGE_FOR_US}
              value={message}
              containerStyle={{height:150, padding: 5, marginTop:20, marginBottom:50}}
              // textInputStyle={{height:moderateScaleVertical(108)}}
              textAlignVertical={'top'}
              multiline={true}
            />
          </View>

          
         
          {/* <Text
            style={{
              fontFamily: fontFamily.reguler,
              opacity: 0.5,
              marginBottom: moderateScale(20),
              alignSelf: 'center',
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {strings.ESTIMATION_ONLY}
          </Text> */}
        </View>
        {/* <View
          style={{
            paddingHorizontal: moderateScale(20),
            paddingVertical: moderateScale(20),
            flexDirection: 'row',
            justifyContent: 'space-around',
            borderBottomColor: colors.borderColorD,
            borderBottomWidth: 1,
          }}> */}
          {/* <View>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryLable,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryLable
              }>
              {strings.DISTANCE}
            </Text>
            <Text
              style={[
                styles.distanceDurationDeliveryLable,
                { color: isDarkMode ? MyDarkTheme.colors.text : colors.black },
              ]}>
              {`${totalDistance} kms`}
            </Text>
          </View> */}
          {/* <View style={{flex: 0.33}}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.distanceDurationDeliveryLable,
                      {color: MyDarkTheme.colors.text},
                    ]
                  : styles.distanceDurationDeliveryLable
              }>
              {strings.DURATION}
            </Text>
            <Text
              style={[
                styles.distanceDurationDeliveryLable,
                {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
              ]}>
              {totalDuration < 60
                ? `${totalDuration} mins`
                : `${(totalDuration / 60).toFixed(2)} hrs`}
            </Text>
          </View> */}
          {/* <View>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryLable,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryLable
              }>
              {strings.DELIVERYFEE}
            </Text>

            <View style={{ flexDirection: 'row' }}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.distanceDurationDeliveryValue,
                      {
                        // textDecorationLine: updatedPrice
                        //   ? 'line-through'
                        //   : 'none',
                        textDecorationLine : 'none',
                        opacity: updatedPrice ? 0.5 : 1,
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(12),
                      },
                    ]
                    : [
                      styles.distanceDurationDeliveryValue,
                      {
                        // textDecorationLine: updatedPrice
                        //   ? 'line-through'
                        //   : 'none',
                         textDecorationLine : 'none',
                        opacity: updatedPrice ? 0.5 : 1,
                        fontSize: textScale(12),
                      },
                    ]
                }>
                {selectedCarOption
                  ? `${currencies?.primary_currency?.symbol}${Number(
                    delivery_tags_price,
                  ).toFixed(2)}`
                  : ''}
              </Text> */}
              {/* {updatedPrice && (
                <Text
                  style={
                    (isDarkMode
                      ? [
                        styles.distanceDurationDeliveryValue,
                        {
                          color: MyDarkTheme.colors.text,
                          fontSize: textScale(12),
                        },
                      ]
                      : styles.distanceDurationDeliveryValue,
                      { fontSize: textScale(12) })
                  }>
                  {`${currencies?.primary_currency?.symbol}${Number(selectedCarOption.tags_price) -
                      Number(updatedPrice) >
                      0
                      ? (
                        Number(selectedCarOption.tags_price) -
                        Number(updatedPrice)
                      ).toFixed(2)
                      : 0
                    }`}
                </Text>
              )} */}
            {/* </View>
          </View> */}
        {/* </View> */}


        {/* <View
          style={{
            paddingHorizontal: moderateScale(20),
            paddingVertical: moderateScale(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{ flex: 0.3, justifyContent: 'center' }}>
            <View
              style={{
                height: moderateScale(28),
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Image
                style={{ height: 40, width: 100 }}
                resizeMode={'contain'}
                source={
                  selectedCarOption?.media.length &&
                    selectedCarOption?.media[0]?.image?.path
                    ? {
                      uri: getImageUrl(
                        selectedCarOption?.media[0]?.image?.path?.image_fit,
                        selectedCarOption?.media[0]?.image?.path?.image_path,
                        '500/500',
                      ),
                    }
                    : imagePath.user
                }
              />
            </View>
          </View>
          <View
            style={{
              flex: 0.65,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{ justifyContent: 'center' }}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.distanceDurationDeliveryValue,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.distanceDurationDeliveryValue
                }>
                {selectedCarOption?.translation.length
                  ? selectedCarOption?.translation[0].title
                  : ''}
              </Text>
              <View  style ={{ flexDirection : "row", justifyContent: 'center', alignItems: 'center'}}>
              <Image
              style={[
                // { tintColor: tintColor },
                // appStyle?.tabBarLayout === 2 && {height: 25, width: 25},
              ]}
              source={
                 imagePath.clockIcon
              }
           ></Image>
             <Text
                style={
                  (isDarkMode
                    ? [
                      styles.distanceDurationDeliveryLable,
                      {
                        color: MyDarkTheme.colors.text,
                        marginTop: moderateScale(5),
                      },
                    ]
                    : styles.distanceDurationDeliveryLable,
                  {
                   // marginTop: moderateScale(5),
                    marginLeft: moderateScale(5),
                    color: '#ACB1C0',
                  }) 
                }> */}
                {/* {totalDuration < 60
                  ? `${totalDuration} mins`
                  : `${(totalDuration / 60).toFixed(2)} hrs`} */}
                  {/* {totalDuration}
              </Text>
              </View>
            
            </View>
          </View>
        </View> */}
        {/* {!!loyalityAmount && (
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: moderateScale(20),
              justifyContent: 'space-between',
              marginVertical: moderateScale(16),
            }}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryLable,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryLable
              }>
              {'Loyalty'}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryValue,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryValue
              }>{`-${currencies?.primary_currency?.symbol}${(
                Number(selectedCarOption?.variant[0]?.multiplier) *
                Number(loyalityAmount)
              ).toFixed(2)}`}</Text>
          </View>
        )} */}

        {/* select payment method */}
        {/* <TouchableOpacity
          onPress={redirectToPayement}
          style={
            isDarkMode
              ? [
                  styles.paymentMainView,
                  {
                    justifyContent: 'space-between',
                    backgroundColor: MyDarkTheme.colors.lightDark,
                  },
                ]
              : [styles.paymentMainView, {justifyContent: 'space-between'}]
          }>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={isDarkMode && {tintColor: MyDarkTheme.colors.text}}
              source={imagePath.paymentMethod}
            />
            <Text
              style={
                isDarkMode
                  ? [styles.selectedMethod, {color: MyDarkTheme.colors.text}]
                  : styles.selectedMethod
              }>
              {selectedPayment
                ? selectedPayment?.title
                : strings.SELECT_PAYMENT_METHOD}
            </Text>
          </View>
          <View>
            <Image
              source={imagePath.goRight}
              style={
                isDarkMode
                  ? {
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                      tintColor: MyDarkTheme.colors.text,
                    }
                  : {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}
              }
            />
          </View>
        </TouchableOpacity> */}
        {/* select wallet */}
        {/* <View style={styles.container}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>Deduct from Wallet</Text>
            <Switch value={isWalletEnabled} onChange={toggleSwitch} />
          </View>
        </View> */}

        {/* apply promocode */}
        {/* <TouchableOpacity
          onPress={() => _getAllOffers(selectedCarOption, '')}
          style={styles.offersViewB}>
          {couponInfo ? (
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View
                style={{ flex: 0.7, flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  style={{ tintColor: themeColors.primary_color }}
                  source={imagePath.percent}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.viewOffers, { marginLeft: moderateScale(10) }]}>
                  {`${strings.CODE} ${couponInfo?.name} ${strings.APPLYED}`}
                </Text>
              </View>
              <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                <Text
                  onPress={removeCoupon}
                  style={[styles.removeCoupon, { color: colors.cartItemPrice }]}>
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
        {/* <View style={{ flex: 1,flexDirection : 'row', justifyContent: 'space-around', alignItems:'center', marginTop: moderateScale(20), marginBottom: moderateScale(40),marginHorizontal: moderateScale(20)}}>
        <View  style ={ [styles.dataBoxStyle]}>
        <View style={styles.dataBoxImageStyle}>
        <Image 
              source={
                 imagePath.distanceIcon
              }
         ></Image></View>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.dataBoxLableStyle,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.dataBoxLableStyle
              }>
              {strings.DISTANCE}
            </Text>
            <Text
              style={[
                styles.dataBoxLableSecondStyle,
                { color: isDarkMode ? MyDarkTheme.colors.text : colors.black },
              ]}>
              {`${totalDistance} kms`}
            </Text>
        </View>
        <View  style ={[styles.dataBoxStyle]}>
        <View style={styles.dataBoxImageStyle}><Image 
              source={
                 imagePath.feeIcon
              }
         ></Image></View>
             <Text
                style={
                  isDarkMode
                    ? [
                      styles.dataBoxLableStyle,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.dataBoxLableStyle
                }>
              {strings.DELIVERYFEE}
            </Text>
              <Text
                style={[
                  styles.dataBoxLableSecondStyle,
                  { color: isDarkMode ? MyDarkTheme.colors.text : colors.black },
                ]}>
                {selectedCarOption
                  ? `${currencies?.primary_currency?.symbol}${Number(
                    delivery_tags_price,
                  ).toFixed(2)}`
                  : ''}
              </Text>
        </View>
        <View  style ={[styles.dataBoxStyle]}>
        <View style={ styles.dataBoxImageStyle}><Image 
              source={
                 imagePath.boxIcon
              }
         ></Image></View>
              <Text
                    style={
                      isDarkMode
                        ? [
                          styles.dataBoxLableStyle,
                          { color: MyDarkTheme.colors.text },
                        ]
                        : styles.dataBoxLableStyle
                    }>
                {selectedCarOption?.translation.length
                  ? selectedCarOption?.translation[0].title
                  : ''}
              </Text>
              <Text
                style={[
                  styles.dataBoxLableSecondStyle,
                  { color: isDarkMode ? MyDarkTheme.colors.text : colors.black },
                ]}>
                  {totalDuration}
              </Text>
        </View>
        </View> */}

        {/* {isLoadingB ? (
          <View
            style={{
              // height: height / 4,
              marginVertical: moderateScaleVertical(20),
            }}>
            {[1].map((i, inx) => {
              return (
                <View key={inx}>
                  <ListEmptyCar isLoading={isLoadingB} />
                </View>
              );
            })}
          </View>
        ) :
        <View
          style={{
            // marginTop: moderateScale(10),
            marginTop: moderateScale(30),
            marginHorizontal: moderateScale(20),
            marginBottom: moderateScale(20),
          }}>
          <GradientButton
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={{ textTransform: 'none', fontSize: textScale(12) }}
            onPress={_confirmAndPay}
            btnText={
              pickup_taxi ?
                strings.CONFIRM_SHIPMENT
                :
                pickUpTimeType === 'now'
                  ? strings.BOOK_NOW
                  : strings.SCHEDULE_RIDE_FOR +
                  `${moment(slectedDate).format('DD MMM')} ${selectedTime} `
            }
          />
        </View>} */}




      </ScrollView>
      <View style={{width:'100%', position:'absolute',bottom:0}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal:20,
          // marginVertical:Platform.OS=="ios"? 20:10,
          backgroundColor:colors.white, 
          paddingVertical:10
        }}>
        <GradientButton
          colorsArray={[
            colors.focusBackGround,//colors.lightGreyBgColor
            colors.focusBackGround//:colors.lightGreyBgColor
          ]}
          textStyle={{textTransform: 'none', fontSize: textScale(14)}}
          onPress={()=>  _confirmAndPay({
                  pickName:pickName,
                  pickNo:pickPhoneNo,
                  dropName:dropName,
                  dropPhoneNumber:dropPhoneNumber,
                  samePickDrop:sameUserCheck,
                  paymentmethod:cod
              })
          }
          btnText={strings.CONFIRM_SHIPMENT} //cod
          // ? 
          // : strings.CONFIRM_SHIPMENT
          containerStyle={{flex: 1}}
          // disabled={cod?false:true}
        />
        {/* <TouchableOpacity
          style={{
            flex: 0.14,
            borderRadius: moderateScaleVertical(15),
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: themeColors.primary_color,
            marginLeft:10
          }}
          onPress={onPressPickUplater}>
          <Image
            source={imagePath.calendarA}
            style={{
              tintColor: themeColors.primary_color,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity> */}
      </View>
      </View>

    </View>
  );
}
